import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, Activity, CreditCard, User, Bell, MapPin, QrCode, X, RefreshCw } from 'lucide-react';
import { mockUser } from '../services/mockData';
import BrandLogo from '../components/brand/BrandLogo';
import DigitalPassCard from '../components/pass/DigitalPassCard';

const TOP_NAV = [
  { to: '/member', label: 'Home', icon: Home, exact: true },
  { to: '/member/explore', label: 'Explore', icon: Compass, exact: false },
  { to: '/member/activity', label: 'Activity', icon: Activity, exact: false },
  { to: '/member/membership', label: 'Membership', icon: CreditCard, exact: false },
];

const BOT_NAV = [
  { to: '/member', label: 'Home', icon: Home, exact: true },
  { to: '/member/explore', label: 'Explore', icon: Compass, exact: false },
  { to: '/member/pass', label: 'My Pass', icon: QrCode, isCenter: true },
  { to: '/member/activity', label: 'Activity', icon: Activity, exact: false },
  { to: '/member/profile', label: 'Profile', icon: User, exact: false },
];

export default function MemberLayout() {
  const { pathname, hash } = useLocation();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(30);

  const isActive = (to, exact = false) => {
    if (exact || to === '/member') {
      return pathname === '/member';
    }

    return pathname.startsWith(to);
  };

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const scrollTargetId = hash.replace('#', '');
    window.setTimeout(() => {
      const target = document.getElementById(scrollTargetId);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [hash, pathname]);

  useEffect(() => {
    if (!isPassModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsPassModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPassModalOpen]);

  useEffect(() => {
    if (!isPassModalOpen) {
      setSeconds(30);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSeconds(current => current > 0 ? current - 1 : 30);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPassModalOpen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-h)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-8)' }}>
            <Link to="/member" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo variant="icon" size="sm" />
              <BrandLogo variant="wordmark" size="sm" className="hide-tablet" />
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile" aria-label="Member Navigation">
              {TOP_NAV.map(({ to, label, icon: Icon, exact }) => {
                const active = isActive(to, exact);

                return (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--r-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: active ? 600 : 500,
                      color: active ? 'var(--sg-green)' : 'var(--text-secondary)',
                      background: active ? 'var(--sg-green-light)' : 'transparent',
                      transition: 'all .15s ease',
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.3 : 1.9} color={active ? 'var(--sg-green)' : 'currentColor'} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <Link
              to="/member/explore"
              className="hide-mobile"
              title="Change area"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.4rem 0.85rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'border-color .15s, background .15s',
              }}
            >
              <MapPin size={13} color="var(--sg-green)" />
              <span>{mockUser.location}</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="btn btn-primary btn-sm hide-mobile"
              style={{ gap: 6, fontWeight: 700, border: 'none' }}
            >
              <QrCode size={14} strokeWidth={2.2} className="pass-cta-spin" />
              <span>My Pass</span>
            </button>

            <Link
              to="/member/activity"
              title="Recent alerts & activity"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                position: 'relative',
                width: 36,
                height: 36,
                borderRadius: 'var(--r-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'background .15s',
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                background: 'var(--status-error)',
                borderRadius: '50%',
                border: '1.5px solid white',
              }} />
            </Link>

            <Link to="/member/profile" title="My Account" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={mockUser.avatar}
                alt="Alex Rahman"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '2px solid var(--sg-green-muted)',
                }}
              />
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: 80 }}>
        <Outlet />
      </main>

      {isPassModalOpen && (
        <div
          className="pass-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsPassModalOpen(false);
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            background: 'rgba(6, 10, 16, 0.72)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-pass-modal-title"
            className="pass-modal-shell"
            onMouseDown={event => event.stopPropagation()}
            style={{
              width: 'min(392px, 100%)',
              maxHeight: 'calc(100vh - 40px)',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '28px',
              background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.98) 0%, rgba(10, 14, 22, 0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
              padding: '20px 18px 18px',
            }}
          >
            <button
              type="button"
              onClick={() => setIsPassModalOpen(false)}
              onMouseDown={event => event.stopPropagation()}
              aria-label="Close pass popup"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5,
              }}
            >
              <X size={16} />
            </button>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.18)', marginBottom: 10 }}>
                  <QrCode size={22} color="var(--sg-green)" className="pass-cta-spin" />
                </div>
                <h2 id="member-pass-modal-title" style={{ margin: '0 0 4px', color: 'white', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  My Silver GYM Pass
                </h2>
                <p style={{ margin: 0, color: 'var(--sg-silver)', fontSize: '13px' }}>
                  Reception e QR ta dekhalen check-in hoye jabe
                </p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <DigitalPassCard />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--sg-silver)', fontSize: '13px', marginBottom: 0 }}>
                <RefreshCw size={14} className="pass-cta-spin-slow" />
                <span>QR refreshes in <strong style={{ color: 'white' }}>{seconds}s</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="show-mobile" aria-label="Mobile Navigation" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        background: 'rgba(255,255,255,.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 200,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {BOT_NAV.map(({ to, label, icon: Icon, isCenter, exact }) => {
          const active = isActive(to, exact);

          return (
            <Link
              key={to}
              to={to}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', position: 'relative' }}
            >
              {isCenter ? (
                <div style={{
                  width: 50,
                  height: 50,
                  background: 'var(--sg-charcoal)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(16,23,34,.3)',
                  marginTop: -22,
                  border: '2px solid white',
                }}>
                  <Icon size={22} color="var(--sg-green)" strokeWidth={2.2} />
                </div>
              ) : (
                <>
                  <Icon size={19} strokeWidth={active ? 2.3 : 1.8} color={active ? 'var(--sg-green)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? 'var(--sg-green)' : 'var(--text-muted)' }}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
