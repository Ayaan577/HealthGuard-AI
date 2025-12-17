import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (result) => {
    try {
        console.log("Starting PDF Generation for:", result);

        // 1. Initialize Document
        const doc = new jsPDF();
        console.log("jsPDF instance created");

        // EY Brand Colors (RGB)
        const eyBlack = [46, 46, 46];      // #2E2E2E
        const eyYellow = [255, 230, 0];    // #FFE600
        const eyTeal = [0, 163, 173];      // #00A3AD
        const dangerRed = [255, 0, 51];    // #FF0033

        // Header - Yellow Beam
        doc.setFillColor(...eyBlack);
        doc.rect(0, 0, 210, 35, 'F'); // Reduced height

        doc.setDrawColor(...eyYellow);
        doc.setLineWidth(2);
        doc.line(0, 35, 210, 35);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22); // Slightly smaller
        doc.setFont("helvetica", "bold");
        doc.text("HealthGuard AI", 20, 18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Provider Validation Report", 20, 28);

        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.text(`REF: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 150, 18);

        // Provider Details Section
        doc.setTextColor(...eyBlack);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PROVIDER DETAILS", 20, 48);

        // Extract Registry Info
        const registryInfo = result.validation_results ? result.validation_results.find(r => r.source === 'NMC Registry') : null;
        const qualification = registryInfo && registryInfo.qualifications ? registryInfo.qualifications.join(", ") : "N/A";
        // Truncate council if too long
        let council = registryInfo && registryInfo.council ? registryInfo.council : "N/A";
        if (council.length > 40) council = council.substring(0, 37) + "...";

        // 2. Generate Table with Theme
        console.log("Generating AutoTable...");
        autoTable(doc, {
            startY: 52,
            head: [['FIELD', 'VALUE']],
            body: [
                ['Provider Name', result.provider_name],
                ['Registration No', result.reg_no],
                ['Qualification', qualification],
                ['State Council', council],
                ['Address', result.address],
            ],
            theme: 'grid',
            headStyles: {
                fillColor: eyBlack,
                textColor: eyYellow,
                fontStyle: 'bold',
                fontSize: 9,
                cellPadding: 3
            },
            styles: {
                fontSize: 9,
                cellPadding: 3, // Tighter padding
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { fontStyle: 'bold', width: 50 },
                1: { width: 120 }
            },
            margin: { left: 20, right: 20 }
        });

        // Validation Results Section
        // Tighter spacing after table
        let finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) + 15 || 110;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...eyBlack);
        doc.text("VERIFICATION STATUS", 20, finalY);

        const isVerified = result.status === 'VERIFIED';
        const isFlagged = result.status === 'FLAGGED';

        const statusColor = isVerified ? eyTeal : isFlagged ? [255, 153, 0] : dangerRed;
        const statusText = isVerified ? "VERIFIED" : isFlagged ? "FLAGGED" : "REJECTED";

        // Status Card - Compact height
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(20, finalY + 5, 170, 35, 3, 3, 'FD'); // Box height 35

        // Large Status Text
        doc.setFontSize(22);
        doc.setTextColor(...statusColor);
        doc.setFont("helvetica", "bold");
        doc.text(statusText, 105, finalY + 22, { align: 'center' });

        // Trust Score
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`Trust Score: ${Math.round(result.final_trust_score)}/100`, 105, finalY + 32, { align: 'center' });

        // Geospatial Logic - Compact
        const geoResult = result.validation_results.find(r => r.source === 'Geolocation');
        finalY += 55; // Reduced jump from 80 to 55

        if (geoResult && geoResult.coordinates) {
            doc.setTextColor(...eyBlack);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("GEOSPATIAL VERIFICATION", 20, finalY);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);

            // Wrap Text Logic
            const addressValue = geoResult.formatted_address || "N/A";
            const splitAddress = doc.splitTextToSize(addressValue, 130);

            doc.text("Matched Address:", 20, finalY + 8);
            doc.text(splitAddress, 60, finalY + 8);

            const linesOffset = splitAddress.length * 4; // Tighter line height

            doc.text(`Coordinates: ${geoResult.coordinates.lat}, ${geoResult.coordinates.lng}`, 20, finalY + 8 + linesOffset + 5);
            doc.text("Source: OpenStreetMap Satellite Data", 20, finalY + 8 + linesOffset + 10);
        }

        // Footer - Fixed at bottom
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(...eyYellow);
        doc.setLineWidth(1);
        doc.line(20, pageHeight - 20, 190, pageHeight - 20); // Moved down

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, pageHeight - 12);
        doc.text("Powered by HealthGuard AI | EY Techathon Submission", 20, pageHeight - 7);

        // Save
        const filename = `HealthGuard_Report_${result.provider_name.replace(/\s+/g, '_')}.pdf`;
        doc.save(filename);
        console.log("PDF Saved successfully as " + filename);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF: " + error.message);
    }
};
