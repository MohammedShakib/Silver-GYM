import { Outlet, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border-subtle)',
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container flex-row-between">
          <Link to="/" style={{ 
            fontFamily: 'var(--font-family-heading)', 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: 800, 
            color: 'var(--color-brand-primary)' 
          }}>
            FitPass
          </Link>

          <nav style={{ display: 'none', gap: 'var(--space-6)', '@media(minWidth: 768px)': { display: 'flex' } }}>
            <Link to="/explore" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Explore Gyms</Link>
            <Link to="/#memberships" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Memberships</Link>
            <Link to="/#how-it-works" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>How It Works</Link>
            <Link to="/partner" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>For Gym Partners</Link>
          </nav>

          <div className="flex-row-center">
            <Link to="/member"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/onboarding"><Button variant="primary">Join FitPass</Button></Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
            <div>
              <h2 style={{ color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>FitPass</h2>
              <p>One membership.<br/>Multiple gyms.<br/>Workout anywhere.</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
              <div>
                <h4 style={{ marginBottom: 'var(--space-4)' }}>Product</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <li><Link to="/explore" className="text-muted">Explore Gyms</Link></li>
                  <li><Link to="/#memberships" className="text-muted">Pricing</Link></li>
                  <li><Link to="/partner" className="text-muted">Partners</Link></li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: 'var(--space-4)' }}>Company</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <li><Link to="/about" className="text-muted">About Us</Link></li>
                  <li><Link to="/contact" className="text-muted">Contact</Link></li>
                  <li><Link to="/privacy" className="text-muted">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
