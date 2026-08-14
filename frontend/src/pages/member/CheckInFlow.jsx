import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X, Zap, Check, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { mockGyms, mockUser } from '../../services/mockData';

export default function CheckInFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gym = mockGyms.find(g => g.id === id) || mockGyms[0];
  const [step, setStep] = useState('pre'); // pre | scan | verifying | success

  useEffect(() => {
    if (step === 'scan') {
      const t = setTimeout(() => setStep('verifying'), 2200);
      return () => clearTimeout(t);
    }
    if (step === 'verifying') {
      const t = setTimeout(() => setStep('success'), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  /* ── Pre-screen ── */
  if (step === 'pre') return (
    <div className="container anim-up" style={{ maxWidth: 500, paddingTop: 'var(--sp-12)', paddingBottom: 'var(--sp-12)' }}>
      <Link to={`/member/gym/${gym.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)' }}>
        <ArrowLeft size={16} /> Back to gym
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <img src={gym.image} alt={gym.name} style={{ width: 72, height: 72, borderRadius: 'var(--r-xl)', objectFit: 'cover', margin: '0 auto var(--sp-4)', border: '3px solid var(--sg-green-muted)' }} />
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 4 }}>Check In</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, margin: 0 }}>
          <MapPin size={16} color="var(--sg-green)" /> {gym.name}
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', overflow: 'hidden', marginBottom: 'var(--sp-8)' }}>
        {[
          { label: 'Your plan', value: `${mockUser.plan} Plan` },
          { label: 'Gym access', value: '✓ Included', color: 'var(--sg-green)' },
          { label: 'Visits remaining', value: `${mockUser.visitsRemaining} this month` },
          { label: 'Current crowd', value: gym.crowd.charAt(0).toUpperCase() + gym.crowd.slice(1), color: gym.crowd === 'low' ? 'var(--status-success)' : 'var(--status-warning)' },
          { label: 'Gym status', value: `Open · Until ${gym.closesAt}`, color: 'var(--status-success)' },
        ].map((row, i, arr) => (
          <div key={row.label} className="flex-between" style={{ padding: '14px var(--sp-6)', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'var(--bg-subtle)' : 'var(--bg-surface)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: row.color || 'var(--text-primary)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-xl btn-full" style={{ marginBottom: 'var(--sp-3)' }} onClick={() => setStep('scan')}>
        Continue to Scan
      </button>
      <Link to="/member/pass" className="btn btn-secondary btn-lg btn-full">Show My Pass Instead</Link>
    </div>
  );

  /* ── Scanner ── */
  if (step === 'scan') return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep('pre')} style={{ background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20} color="white" />
        </button>
        <p style={{ color: 'white', fontWeight: 700, margin: 0 }}>Scan Gym QR</p>
        <button style={{ background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Zap size={18} color="white" />
        </button>
      </div>

      {/* Camera viewport */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
        <div style={{ position: 'relative', width: 280, height: 280 }}>
          {/* Corner brackets */}
          {[['tl', 'top left', 'borderTop,borderLeft'], ['tr', 'top right', 'borderTop,borderRight'], ['bl', 'bottom left', 'borderBottom,borderLeft'], ['br', 'bottom right', 'borderBottom,borderRight']].map(([key]) => {
            const isLeft = key.includes('l');
            const isTop = key.includes('t');
            return (
              <div key={key} style={{
                position: 'absolute', width: 40, height: 40,
                top: isTop ? -2 : undefined, bottom: isTop ? undefined : -2,
                left: isLeft ? -2 : undefined, right: isLeft ? undefined : -2,
                borderTop: isTop ? '3px solid var(--sg-green)' : 'none',
                borderBottom: !isTop ? '3px solid var(--sg-green)' : 'none',
                borderLeft: isLeft ? '3px solid var(--sg-green)' : 'none',
                borderRight: !isLeft ? '3px solid var(--sg-green)' : 'none',
                borderRadius: isTop && isLeft ? '8px 0 0 0' : isTop ? '0 8px 0 0' : isLeft ? '0 0 0 8px' : '0 0 8px 0',
              }} />
            );
          })}

          {/* Scan line */}
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'var(--sg-green)', boxShadow: '0 0 12px var(--sg-green)', animation: 'scanLine 1.8s ease-in-out infinite', zIndex: 2 }} />

          {/* Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.03)', borderRadius: 12 }} />
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,.6)', textAlign: 'center', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-6)' }}>
        Align the gym's QR code within the frame
      </p>

      <div style={{ padding: 'var(--sp-6)', display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
        <button style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 'var(--r-full)', padding: '10px 20px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Enter Code</button>
        <Link to="/member/pass" style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 'var(--r-full)', padding: '10px 20px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>Show My Pass</Link>
      </div>

      <style>{`@keyframes scanLine { 0%,100%{top:5%} 50%{top:88%} }`}</style>
    </div>
  );

  /* ── Verifying ── */
  if (step === 'verifying') return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,.15)', borderTopColor: 'var(--sg-green)', borderRadius: '50%', margin: '0 auto var(--sp-6)', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ color: 'white', marginBottom: 'var(--sp-6)' }}>Verifying access…</h2>
        {['Checking membership', 'Verifying gym access', 'Counting visit'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8, opacity: i === 0 ? 1 : .5 }}>
            <CheckCircle size={16} color="var(--sg-green)" />
            <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,.8)' }}>{s}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Success ── */
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--sg-green)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 'var(--sp-8)' }} className="anim-fade">
      <div style={{ width: 96, height: 96, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-6)' }} className="anim-scale">
        <Check size={52} color="white" strokeWidth={2.5} />
      </div>

      <h1 style={{ color: 'white', fontSize: 'var(--text-5xl)', marginBottom: 8, textAlign: 'center' }}>You're in!</h1>
      <p style={{ fontSize: 'var(--text-xl)', opacity: .9, marginBottom: 'var(--sp-12)', textAlign: 'center' }}>{gym.name}</p>

      <div style={{ background: 'rgba(0,0,0,.12)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-6)', width: '100%', maxWidth: 340, marginBottom: 'var(--sp-8)' }}>
        {[
          { label: 'Checked in at', value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          { label: 'Workout this month', value: `#${mockUser.visitsUsed}` },
          { label: 'Current streak', value: `${mockUser.streak} days 🔥` },
          { label: 'Visits remaining', value: `${mockUser.visitsRemaining - 1} left` },
        ].map(row => (
          <div key={row.label} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
            <span style={{ opacity: .8, fontSize: 'var(--text-sm)' }}>{row.label}</span>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, textAlign: 'center', marginBottom: 'var(--sp-10)' }}>Have a great workout.</p>

      <button
        className="btn btn-xl btn-full"
        style={{ background: 'white', color: 'var(--sg-green)', maxWidth: 340 }}
        onClick={() => navigate('/member')}
      >
        Done
      </button>
    </div>
  );
}
