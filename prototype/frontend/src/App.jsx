import { useState } from 'react'
import { Activity } from 'lucide-react'
import ProviderUpload from './components/ProviderUpload'
import ValidationStatus from './components/ValidationStatus'
import ProviderDetails from './components/ProviderDetails'
import SessionHistory from './components/SessionHistory'
import RecommendedProviders from './components/RecommendedProviders'
import './App.css'

function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [currentDept, setCurrentDept] = useState('')

  const handleReset = () => {
    setResult(null)
    setLoading(false)
    setCurrentDept('')
  }

  const handleValidate = async (data) => {
    setLoading(true)
    setResult(null)
    setCurrentDept(data.department)

    try {
      const response = await fetch('http://localhost:8000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const resultData = await response.json()

      // Add timestamp to result
      const resultWithTime = { ...resultData, timestamp: new Date().toISOString() }

      setResult(resultWithTime)
      setHistory(prev => [resultWithTime, ...prev])

    } catch (error) {
      console.error("Error validating provider:", error)
      setResult({
        status: "ERROR",
        final_trust_score: 0,
        validation_results: [{
          source: "System",
          status: "ERROR",
          message: "Connection failed. Please check backend server status."
        }]
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="logo-icon">
            <Activity size={20} />
          </div>
          <h1>HealthGuard AI</h1>
        </div>
        <p className="subtitle">
          Autonomous Agentic AI that validates healthcare provider credentials against National Medical Commission (NMC) registries and performs geospatial verification in real-time.
        </p>
      </header>

      <main className="dashboard-grid">
        <section className="input-section">
          <ProviderUpload onValidate={handleValidate} loading={loading} />
          {result && !loading && (
            <RecommendedProviders department={currentDept} />
          )}
        </section>

        <section className="output-section">
          <ValidationStatus loading={loading} result={result} onReset={handleReset} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ProviderDetails result={result} />
            <SessionHistory history={history} onSelect={setResult} />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div>© 2025 HealthGuard AI. All rights reserved.</div>
        <div className="footer-links">
          <a href="file:///c:/Users/Ayaan/Downloads/neural%20nexus/NeuralNexus_ProviderDataValidation_EY_Techathon_6.0__Detailed_Executive_Summary.pptx" className="footer-link" target="_blank" rel="noopener noreferrer">Presentation PPT</a>
          <a href="#" className="footer-link">Privacy</a>
          <a href="https://www.ey.com/en_in/techathon-6" target="_blank" rel="noopener noreferrer" className="footer-link">EY Techathon 6.0</a>
        </div>
      </footer>
    </div>
  )
}

export default App
