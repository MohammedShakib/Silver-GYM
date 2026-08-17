import { mockUser } from '../../services/mockData';
import { QrCode, Sparkles, CheckCircle } from 'lucide-react';

export default function DigitalPassCard({ compact = false, onOpen }) {
  const pct = Math.min(100, Math.round((mockUser.visitsUsed / mockUser.visitsTotal) * 100));

  if (compact) {
    return (
      <div
        className="pass-card"
        style={{
          padding: 'var(--sp-6)',
          cursor: onOpen ? 'pointer' : 'default',
          borderRadius: 'var(--r-xl)',
          background: 'linear-gradient(145deg, #101722 0%, #171D26 60%, #101722 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 32px rgba(16,23,34,0.3)',
          transition: 'transform .2s ease, box-shadow .2s ease',
        }}
        onClick={onOpen}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-sm)', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Silver GYM
                </span>
                <span className="badge badge-green" style={{ fontSize: 9, padding: '1px 5px', fontWeight: 800 }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--sg-silver)' }}>{mockUser.plan} Plan</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member ID</p>
              <p style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '0.04em' }}>{mockUser.id}</p>
            </div>
          </div>

          {/* Member Name */}
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.01em' }}>
              {mockUser.name}
            </p>
          </div>

          {/* Usage + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-3)' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--sg-silver)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly Visits</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1 }}>
                {mockUser.visitsUsed} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--sg-silver)' }}>/ {mockUser.visitsTotal}</span>
              </p>
            </div>
            {onOpen && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{
                  gap: 5,
                  fontSize: 'var(--text-xs)',
                  padding: '0.4rem 0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(32,200,99,0.3)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              >
                <QrCode size={13} strokeWidth={2.4} /> Open Pass
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ height: 5, background: 'rgba(255,255,255,.12)', borderRadius: 'var(--r-full)', overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sg-green)', borderRadius: 'var(--r-full)', transition: 'width .6s ease' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--sg-silver)' }}>
              Renews {mockUser.renewalDate}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sg-green)' }}>
              {mockUser.visitsRemaining} visits remaining
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pass-card"
      style={{
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 'var(--r-2xl)',
        background: 'linear-gradient(160deg, #101722 0%, #171D26 65%, #0D1117 100%)',
        border: '1px solid rgba(255,255,255,.1)',
        boxShadow: '0 20px 48px rgba(16,23,34,0.45)',
        overflow: 'hidden',
      }}
    >
      {/* Top green brand bar */}
      <div style={{
        background: 'var(--sg-green)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'white', letterSpacing: '-0.02em' }}>
            Silver GYM
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.15)', padding: '1px 6px', borderRadius: 999 }}>
            PASS
          </span>
        </div>
        <span className="badge" style={{ background: 'rgba(255,255,255,.25)', color: 'white', fontSize: 10, fontWeight: 800 }}>
          ACTIVE MEMBER
        </span>
      </div>

      <div style={{ padding: 'var(--sp-6)', position: 'relative', zIndex: 1 }}>
        {/* Member Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 2px' }}>Member Name</p>
            <p style={{ fontWeight: 800, color: 'white', margin: 0, fontSize: 'var(--text-base)' }}>{mockUser.name}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 2px' }}>Plan</p>
            <p style={{ fontWeight: 800, color: 'var(--sg-green)', margin: 0, fontSize: 'var(--text-base)' }}>{mockUser.plan} Plan</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 2px' }}>Member ID</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 700, color: 'white', margin: 0, fontSize: 'var(--text-sm)', letterSpacing: 1 }}>{mockUser.id}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 2px' }}>Visits Used</p>
            <p style={{ fontWeight: 800, color: 'white', margin: 0, fontSize: 'var(--text-sm)' }}>{mockUser.visitsUsed} / {mockUser.visitsTotal}</p>
          </div>
        </div>

        {/* Dashed divider */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,.18)', margin: '0 0 var(--sp-6)' }} />

        {/* QR Code Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div style={{
            width: 172,
            height: 172,
            background: 'white',
            borderRadius: 'var(--r-lg)',
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}>
            <div className="qr-placeholder" style={{ width: '100%', height: '100%', borderRadius: 8 }} />
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver)', textAlign: 'center', margin: 0 }}>
            Show QR to reception for check-in
          </p>
        </div>

        {/* Stats footer */}
        <div style={{
          marginTop: 'var(--sp-6)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-4)',
          paddingTop: 'var(--sp-4)',
          borderTop: '1px solid rgba(255,255,255,.1)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Remaining Visits</p>
            <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--sg-green)', margin: 0, lineHeight: 1.1 }}>
              {mockUser.visitsRemaining}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Renews On</p>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.5 }}>
              {mockUser.renewalDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

