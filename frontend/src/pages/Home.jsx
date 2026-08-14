import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge.jsx'
import { getApiHealth } from '../services/api.js'

const Home = () => {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    getApiHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Silver GYM</p>
          <h1>Build strength, track progress, and manage members.</h1>
          <p className="hero-copy">
            A full-stack starter ready for membership plans, trainer profiles,
            class schedules, and admin workflows.
          </p>
          <div className="hero-actions">
            <button type="button">Get Started</button>
            <StatusBadge status={apiStatus} />
          </div>
        </div>
      </section>

      <section className="feature-grid" aria-label="Project modules">
        <article>
          <h2>Frontend</h2>
          <p>React client organized for pages, components, and API services.</p>
        </article>
        <article>
          <h2>Backend</h2>
          <p>Express API with routing, controllers, config, and middleware.</p>
        </article>
        <article>
          <h2>Next Steps</h2>
          <p>Ready for auth, members, trainers, packages, and payments.</p>
        </article>
      </section>
    </main>
  )
}

export default Home
