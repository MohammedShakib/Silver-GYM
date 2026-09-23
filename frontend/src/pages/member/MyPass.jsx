import { useState, useEffect } from 'react';
import { RefreshCw, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { generatePassToken } from '../../services/PassService';
import DigitalPassCard from '../../components/pass/DigitalPassCard';
import api from '../../services/api';

export default function MyPass() {
  const [seconds, setSeconds] = useState(45);
  const [passToken, setPassToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchPassToken = async () => {
    try {
      setError(null);
      const data = await generatePassToken();
      setPassToken(data.token);
      setSeconds(data.ttl || 45);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate pass');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get('/check-ins/history');
      setRecentActivity(res.data.checkIns || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPassToken();
    fetchRecentActivity();
  }, []);

  useEffect(() => {
    if (loading || error) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          fetchPassToken();
          return 45; // temporary until fetch resolves
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [loading, error]);

  return (
    <div className="anim-up" style={{ minHeight: 'calc(100vh - var(--header-h))', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--sp-8) var(--sp-4)' }}>
      <h1 style={{ color: 'white', fontSize: 'var(--text-3xl)', marginBottom: 'var(--sp-2)', textAlign: 'center' }}>My Silver GYM Pass</h1>
      <p style={{ color: 'var(--sg-silver)', marginBottom: 'var(--sp-8)', textAlign: 'center' }}>Show this pass at any partner gym reception</p>

      {/* Full Pass Card */}
      <div style={{ width: '100%', maxWidth: 400, marginBottom: 'var(--sp-6)' }}>
        {error ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--r-xl)', color: 'var(--sg-error)' }}>
            <p style={{ fontWeight: 'bold' }}>Pass Unavailable</p>
            <p style={{ fontSize: 'var(--text-sm)' }}>{error}</p>
          </div>
        ) : (
          <DigitalPassCard passToken={passToken} />
        )}
      </div>

      {/* Timer */}
      {!error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-8)' }}>
          <RefreshCw size={14} className={seconds < 5 ? 'anim-spin' : ''} />
          <span>QR code refreshes in <strong style={{ color: 'white' }}>{seconds}s</strong></span>
        </div>
      )}

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
        {recentActivity.slice(0, 3).map(a => (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'white' }}>{a.gym.name}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--sg-silver)' }}>
                {new Date(a.checkedInAt).toLocaleDateString()} · {new Date(a.checkedInAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--sg-green)', background: 'rgba(34,197,94,.12)', padding: '3px 8px', borderRadius: 'var(--r-full)' }}>
              Verified ✓
            </span>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>No recent activity.</p>
        )}
        <Link to="/me/activity" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sg-green)', fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 'var(--sp-4)' }}>
          View full history <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
