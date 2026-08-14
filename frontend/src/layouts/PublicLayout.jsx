import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { to: '/explore',    label: 'Explore Gyms' },
  { to: '/#how',       label: 'How It Works' },
  { to: '/#plans',     label: 'Membership' },
  { to: '/for-gyms',   label: 'For Gym Owners' },
  { to: '/about',      label: 'About' },
];

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [['Explore Gyms','/explore'],['Memberships','/#plans'],['How It Works','/#how'],['City Coverage','/#areas']],
  },
  {
    heading: 'For Members',
    links: [['Activity','/member/activity'],['My Pass','/member/pass'],['Help','#']],
  },
  {
    heading: 'For Gyms',
    links: [['Become a Partner','/for-gyms'],['Partner Login','/partner']],
  },
  {
    heading: 'Company',
    links: [['About','/about'],['Contact','#'],['Privacy','#'],['Terms','#']],
  },
];

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ─── Navbar ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--header-h)',
        background: 'rgba(250,250,249,.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--sg-charcoal)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 14, fontFamily: 'var(--font-heading)' }}>SG</span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', letterSpacing: '-.02em' }}>
              Silver GYM
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hide-mobile" style={{ display: 'flex', gap: 4 }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  padding: '.45rem .875rem',
                  borderRadius: 'var(--r-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-subtle)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <Link to="/sign-in" className="btn btn-ghost btn-sm hide-mobile">Sign In</Link>
            <Link to="/join" className="btn btn-dark btn-sm">Join Silver GYM</Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer style={{ background: 'var(--bg-dark)', color: 'var(--text-on-dark)', paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-10)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 'var(--sp-8)', marginBottom: 'var(--sp-12)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-4)' }}>
                <div style={{ width: 28, height: 28, background: 'var(--sg-green)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 12, fontFamily: 'var(--font-heading)' }}>SG</span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'white' }}>Silver GYM</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)', lineHeight: 1.7, maxWidth: 220 }}>
                One membership. Multiple gyms. Workout anywhere across Dhaka.
              </p>
            </div>

            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--sg-silver)', marginBottom: 'var(--sp-4)' }}>
                  {col.heading}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={to} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)', transition: 'color .15s' }}
                        onMouseEnter={e => e.target.style.color = 'white'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-on-dark-muted)'}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)', margin: 0 }}>
              © 2026 Silver GYM Bangladesh. All rights reserved.
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-dark-muted)', margin: 0 }}>
              Made in Dhaka 🇧🇩
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
