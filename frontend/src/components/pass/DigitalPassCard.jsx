import { mockUser } from '../../services/mockData';

export default function DigitalPassCard({ compact = false, onOpen }) {
  const pct = (mockUser.visitsUsed / mockUser.visitsTotal) * 100;

  if (compact) {
    return (
      <div
        className="pass-card"
        style={{ padding: 'var(--sp-5)', cursor: 'pointer' }}
        onClick={onOpen}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 4px' }}>Silver GYM</p>
              <span className="badge badge-green" style={{ fontSize: 10 }}>ACTIVE</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver)', margin: '0 0 4px' }}>Member ID</p>
              <p style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', margin: 0 }}>{mockUser.id}</p>
            </div>
          </div>

          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'white', margin: '0 0 var(--sp-4)' }}>{mockUser.name}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver)', margin: '0 0 2px' }}>Visits</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'white', margin: 0 }}>
                {mockUser.visitsUsed} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--sg-silver)' }}>/ {mockUser.visitsTotal}</span>
              </p>
            </div>
            <button
              style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 'var(--r-lg)', padding: '.5rem 1rem', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-sm)' }}
              onClick={onOpen}
            >
              Open Pass
            </button>
          </div>

          <div style={{ marginTop: 'var(--sp-3)', height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sg-green)', borderRadius: 'var(--r-full)' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--sg-silver)', margin: '4px 0 0', textAlign: 'right' }}>
            {mockUser.visitsRemaining} visits remaining
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pass-card" style={{ maxWidth: 380, margin: '0 auto' }}>
      {/* Top green stripe */}
      <div style={{ background: 'var(--sg-green)', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'white', letterSpacing: '-.01em' }}>Silver GYM</span>
        <span className="badge" style={{ background: 'rgba(255,255,255,.25)', color: 'white', fontSize: 11 }}>ACTIVE</span>
      </div>

      <div style={{ padding: 'var(--sp-6)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 4px' }}>Member</p>
            <p style={{ fontWeight: 700, color: 'white', margin: 0 }}>{mockUser.name}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 4px' }}>Plan</p>
            <p style={{ fontWeight: 700, color: 'white', margin: 0 }}>{mockUser.plan}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 4px' }}>Member ID</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 600, color: 'white', margin: 0, letterSpacing: 1 }}>{mockUser.id}</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 4px' }}>Visits</p>
            <p style={{ fontWeight: 700, color: 'white', margin: 0 }}>{mockUser.visitsUsed}/{mockUser.visitsTotal}</p>
          </div>
        </div>

        {/* Dashed divider */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,.2)', margin: '0 0 var(--sp-6)' }} />

        {/* QR Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <div style={{ width: 160, height: 160, background: 'white', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="qr-placeholder" style={{ width: '100%', height: '100%', borderRadius: 6 }} />
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver)', textAlign: 'center', margin: 0 }}>
            QR refreshes every 30s · Show to reception
          </p>
        </div>

        <div style={{ marginTop: 'var(--sp-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 4px' }}>REMAINING</p>
            <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--sg-green)', margin: 0 }}>{mockUser.visitsRemaining}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 4px' }}>RENEWS</p>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white', margin: 0 }}>{mockUser.renewalDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
