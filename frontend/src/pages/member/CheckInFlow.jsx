import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X, Zap, Check, ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { useGym } from '../../hooks/useGym';
import { useMembership } from '../../hooks/useMembership';
import { useActivity } from '../../hooks/useActivity';
import { checkInService } from '../../services/CheckInService';

export default function CheckInFlow() {
  const { id } = useParams();
  const { gym, isLoading: gymLoading } = useGym(id);
  const { membership, isLoading: memLoading } = useMembership();
  const { activity } = useActivity();
  const navigate = useNavigate();
  const [step, setStep] = useState('pre'); // pre | scan | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current && isScanning.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Failed to stop scanner', err);
      }
      isScanning.current = false;
    }
  };

  const startScanner = async () => {
    setStep('scan');
    setTimeout(async () => {
      try {
        if (!scannerRef.current) scannerRef.current = new Html5Qrcode("member-reader");
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (step !== 'scan') return;
            await stopScanner();
            handleScan(decodedText);
          },
          () => {}
        );
        isScanning.current = true;
      } catch (err) {
        console.error(err);
        setStep('error');
        setErrorMsg('Camera access denied.');
      }
    }, 100);
  };

  const handleScan = async (token) => {
    setStep('loading');
    try {
      const res = await checkInService.checkInGymQr(token);
      setResult(res);
      setStep('success');
    } catch (err) {
      setStep('error');
      setErrorMsg(err.response?.data?.message || 'Check-in failed');
    }
  };

  if (gymLoading || memLoading) return <div style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>Loading check-in...</div>;
  if (!gym || !membership) return <div>Check-in data not available</div>;

  /* ── Pre-screen ── */
  if (step === 'pre') return (
    <div className="container anim-up" style={{ maxWidth: 500, paddingTop: 'var(--sp-12)', paddingBottom: 'var(--sp-12)' }}>
      <Link to={`/gyms/${gym.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)' }}>
        <ArrowLeft size={16} /> Back to gym
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <img src={gym.logoUrl} alt={gym.name} style={{ width: 72, height: 72, borderRadius: 'var(--r-xl)', objectFit: 'cover', margin: '0 auto var(--sp-4)', border: '3px solid var(--sg-green-muted)' }} />
        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 4 }}>Check In</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, margin: 0 }}>
          <MapPin size={16} color="var(--sg-green)" /> {gym.name}
        </p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-2xl)', overflow: 'hidden', marginBottom: 'var(--sp-8)' }}>
        {[
          { label: 'Your plan', value: `${membership.planName || 'Active'} Plan` },
          { label: 'Gym access', value: 'Included', color: 'var(--sg-green)' },
          { label: 'Visits remaining', value: `${membership.visitsRemaining} this month` },
          { label: 'Current crowd', value: gym.crowd?.charAt(0).toUpperCase() + gym.crowd?.slice(1), color: gym.crowd === 'low' ? 'var(--status-success)' : 'var(--status-warning)' },
        ].map((row, i, arr) => (
          <div key={row.label} className="flex-between" style={{ padding: '14px var(--sp-6)', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: i % 2 === 0 ? 'var(--bg-subtle)' : 'var(--bg-surface)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: row.color || 'var(--text-primary)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-xl btn-full" style={{ marginBottom: 'var(--sp-3)' }} onClick={startScanner}>
        Continue to Scan
      </button>
      <Link to="/me/pass" className="btn btn-secondary btn-lg btn-full">Show My Pass Instead</Link>
    </div>
  );

  /* ── Scanner ── */
  if (step === 'scan') return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={async () => { await stopScanner(); setStep('pre'); }} style={{ background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20} color="white" />
        </button>
        <p style={{ color: 'white', fontWeight: 700, margin: 0 }}>Scan Gym QR</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-6)' }}>
        <div id="member-reader" style={{ width: '100%', maxWidth: 300, borderRadius: 'var(--r-xl)', overflow: 'hidden', background: '#000' }}></div>
      </div>

      <p style={{ color: 'rgba(255,255,255,.6)', textAlign: 'center', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-6)' }}>
        Align the gym's QR code within the frame
      </p>
      
      <div style={{ padding: 'var(--sp-6)', display: 'flex', justifyContent: 'center' }}>
        <Link to="/me/pass" onClick={stopScanner} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 'var(--r-full)', padding: '10px 20px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Show My Pass</Link>
      </div>
    </div>
  );

  /* ── Loading / Error ── */
  if (step === 'loading') return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,.15)', borderTopColor: 'var(--sg-green)', borderRadius: '50%', margin: '0 auto var(--sp-6)', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ color: 'white' }}>Verifying…</h2>
      </div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (step === 'error') return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <X size={48} color="var(--status-error)" style={{ marginBottom: 16 }} />
      <h2 style={{ color: 'white', marginBottom: 8 }}>Check-In Failed</h2>
      <p style={{ color: 'var(--sg-silver)', marginBottom: 24 }}>{errorMsg}</p>
      <button className="btn btn-primary" onClick={() => setStep('pre')}>Try Again</button>
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
          { label: 'Workout this month', value: `#${membership.visitsUsed}` },
          { label: 'Current streak', value: `${activity?.workoutCount || 1} days 🔥` },
          { label: 'Visits remaining', value: `${membership.visitsRemaining} left` },
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
