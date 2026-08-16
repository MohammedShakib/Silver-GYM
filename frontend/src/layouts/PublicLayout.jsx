import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import BrandLogo from '../components/brand/BrandLogo';

const NAV_LINKS = [
  { to: '/member/explore', label: 'Explore Gyms' },
  { to: '/#how',            label: 'How It Works' },
  { to: '/#plans',          label: 'Membership' },
  { to: '/#for-gyms',       label: 'For Gym Owners' },
  { to: '/#about',          label: 'About' },
];

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Explore Gyms', to: '/member/explore' },
      { label: 'Membership Plans', to: '/#plans' },
      { label: 'How It Works', to: '/#how' },
      { label: 'City Coverage', to: '/#areas' },
      { label: 'Digital Pass App', to: '/member/pass' },
    ],
  },
  {
    heading: 'For Members',
    links: [
      { label: 'Member Pass', to: '/member/pass' },
      { label: 'Activity & Streaks', to: '/member/activity' },
      { label: 'Find Nearby Gyms', to: '/member/explore' },
      { label: 'Member Rewards', to: '/member' },
      { label: 'Help & FAQ', to: '/#about' },
    ],
  },
  {
    heading: 'For Gyms',
    links: [
      { label: 'Become a Partner', to: '/#for-gyms' },
      { label: 'Owner Dashboard', to: '/partner' },
      { label: 'Revenue Calculator', to: '/#for-gyms' },
      { label: 'Partner Guidelines', to: '/#for-gyms' },
      { label: 'Success Stories', to: '/#for-gyms' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Silver GYM', to: '/#about' },
      { label: 'Our Mission in Dhaka', to: '/#about' },
      { label: 'Careers', to: '/#about' },
      { label: 'Press & Media', to: '/#about' },
      { label: 'Contact Us', to: '/#about' },
    ],
  },
  {
    heading: 'Legal & Security',
    links: [
      { label: 'Privacy Policy', to: '/#about' },
      { label: 'Terms of Service', to: '/#about' },
      { label: 'Gym Safety Code', to: '/#about' },
      { label: 'Refund Policy', to: '/#about' },
      { label: 'Security Overview', to: '/#about' },
    ],
  },
];

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = location.hash.replace('#', '');

    window.setTimeout(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [location.hash, location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* ─── Navbar ─── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--header-h)',
          background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(250, 250, 249, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(229, 231, 235, 0.6)',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.05)' : 'none',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
            }}
          >
            <BrandLogo variant="full" size="sm" />
          </Link>

          {/* Nav links (Desktop) */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--r-md)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  transition: 'all 0.18s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/sign-in"
              className="hide-mobile"
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'transparent',
                borderRadius: 'var(--r-md)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Sign In
            </Link>
            <Link
              to="/join"
              className="btn btn-primary"
              style={{
                padding: '0.62rem 1.35rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: 'var(--r-lg)',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              Join Silver GYM
              <ArrowRight size={16} />
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'none',
                color: 'var(--text-primary)',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.6rem 0',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/sign-in" className="btn btn-secondary btn-full" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/join" className="btn btn-primary btn-full" onClick={() => setMobileMenuOpen(false)}>
                Join Silver GYM
              </Link>
            </div>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #0D1117 0%, #080B10 100%)',
          color: 'var(--text-on-dark)',
          paddingTop: 'var(--sp-20)',
          paddingBottom: 'var(--sp-12)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          {/* Top Row: Brand & Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr repeat(5, 1fr)',
              gap: 'var(--sp-8)',
              marginBottom: 'var(--sp-16)',
            }}
          >
            {/* Brand column */}
            <div style={{ paddingRight: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-4)' }}>
                <BrandLogo variant="full" size="sm" dark />
              </div>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-on-dark-muted)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--sp-6)',
                  maxWidth: 260,
                }}
              >
                Dhaka's unified fitness network. One flexible membership unlocks 120+ verified partner gyms across the capital.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <a
                  href="/#about"
                  aria-label="Facebook"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sg-silver)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--sg-green)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = 'var(--sg-silver)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="/#about"
                  aria-label="Instagram"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sg-silver)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--sg-green)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = 'var(--sg-silver)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a
                  href="/#about"
                  aria-label="LinkedIn"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sg-silver)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--sg-green)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = 'var(--sg-silver)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a
                  href="/#about"
                  aria-label="X / Twitter"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--sg-silver)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--sg-green)';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = 'var(--sg-silver)';
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* 5 Nav columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    color: 'white',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  {col.heading}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-on-dark-muted)',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={e => (e.target.style.color = 'var(--sg-green)')}
                        onMouseLeave={e => (e.target.style.color = 'var(--text-on-dark-muted)')}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 'var(--sp-8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--sp-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-on-dark-muted)', margin: 0 }}>
                © 2026 Silver GYM Technologies Ltd. All rights reserved.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-on-dark-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, background: 'var(--sg-green)', borderRadius: '50%', display: 'inline-block' }} />
                Network Status: 124 Gyms Online
              </span>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-on-dark-muted)', margin: 0 }}>
                Crafted with care in Dhaka 🇧🇩
              </p>
            </div>
          </div>
        </div>

        {/* Responsive CSS for footer grid on smaller screens */}
        <style>{`
          @media (max-width: 1024px) {
            footer .container > div:first-child {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            footer .container > div:first-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}
