import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to re-center map when coordinates change
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 15);
    return null;
}

function MapComponent({ lat, lng, popupText }) {
    if (!lat || !lng) return null;

    const position = [lat, lng];

    return (
        <div style={{ height: '280px', width: '100%', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem', border: '1px solid var(--border-color)' }}>
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={position} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {popupText || "Provider Location"}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default MapComponent;
