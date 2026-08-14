import { useState, useEffect } from 'react';
import { RefreshCw, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockActivity } from '../../services/mockData';
import DigitalPassCard from '../../components/pass/DigitalPassCard';

export default function MyPass() {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 30), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="anim-up" style={{ minHeight: 'calc(100vh - var(--header-h))', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--sp-8) var(--sp-4)' }}>

      <h1 style={{ color: 'white', fontSize: 'var(--text-3xl)', marginBottom: 'var(--sp-2)', textAlign: 'center' }}>My Silver GYM Pass</h1>
      <p style={{ color: 'var(--sg-silver)', marginBottom: 'var(--sp-8)', textAlign: 'center' }}>Show this pass at any partner gym reception</p>

      {/* Full Pass Card */}
      <div style={{ width: '100%', maxWidth: 400, marginBottom: 'var(--sp-6)' }}>
        <DigitalPassCard />
      </div>

      {/* Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)' }}>
        <RefreshCw size={14} className={seconds < 5 ? 'anim-spin' : ''} />
        <span>QR code refreshes in <strong style={{ color: 'white' }}>{seconds}s</strong></span>
      </div>

      {/* Info box */}
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-8)', display: 'flex', gap: 12 }}>
        <Info size={18} color="var(--sg-silver)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'white' }}>How to use your pass</p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--sg-silver)', lineHeight: 1.65 }}>
            Show this QR code to the receptionist at any Silver GYM partner gym. They will scan it to verify your membership and log your visit.
          </p>
        </div>
      </div>

      {/* Recent pass activity */}
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h3 style={{ color: 'white', marginBottom: 'var(--sp-4)', fontSize: 'var(--text-xl)' }}>Recent Pass Activity</h3>
        {mockActivity.filter(a => a.type === 'checkin').slice(0, 3).map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'white' }}>{a.gym}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--sg-silver)' }}>{a.date} · {a.time}</p>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--sg-green)', background: 'rgba(34,197,94,.12)', padding: '3px 8px', borderRadius: 'var(--r-full)' }}>
              Verified ✓
            </span>
          </div>
        ))}
        <Link to="/member/activity" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sg-green)', fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 'var(--sp-4)' }}>
          View full history <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
