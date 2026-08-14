import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, X, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ReceptionScanner() {
  const [state, setState] = useState('ready'); // ready | scanning | verified

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 'var(--sp-8)' }} className="anim-fade">

      {state === 'ready' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
            <p className="eyebrow eyebrow-dark" style={{ marginBottom: 'var(--sp-3)' }}>Iron House Fitness · Reception</p>
            <h1 style={{ color: 'white', fontSize: 'var(--text-5xl)', marginBottom: 8 }}>Silver GYM<br/>Check-In</h1>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-lg)' }}>Scan a member's pass QR code to verify access</p>
          </div>

          {/* Scanner viewport */}
          <div style={{ position: 'relative', width: 320, height: 320, marginBottom: 'var(--sp-8)' }}>
            {[['tl', 0, 0], ['tr', 0, undefined], ['bl', undefined, 0], ['br', undefined, undefined]].map(([k, top, left]) => (
              <div key={k} style={{ position: 'absolute', width: 50, height: 50, top, bottom: top === undefined ? 0 : undefined, left, right: left === undefined ? 0 : undefined, borderTop: top === 0 ? '3px solid var(--sg-green)' : 'none', borderBottom: top === undefined ? '3px solid var(--sg-green)' : 'none', borderLeft: left === 0 ? '3px solid var(--sg-green)' : 'none', borderRight: left === undefined ? '3px solid var(--sg-green)' : 'none', borderRadius: top === 0 && left === 0 ? '12px 0 0 0' : top === 0 ? '0 12px 0 0' : left === 0 ? '0 0 0 12px' : '0 0 12px 0' }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(34,197,94,.03)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 6, height: 6, background: 'var(--sg-green)', borderRadius: '50%', boxShadow: '0 0 20px var(--sg-green), 0 0 40px rgba(34,197,94,.4)' }} className="anim-pulse" />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'var(--sg-green)', boxShadow: '0 0 12px var(--sg-green)', animation: 'scanLine 2.5s ease-in-out infinite' }} />
          </div>

          <button
            className="btn btn-primary btn-xl"
            style={{ gap: 10, marginBottom: 'var(--sp-4)', minWidth: 260 }}
            onClick={() => { setState('scanning'); setTimeout(() => setState('verified'), 2000); }}
          >
            <Zap size={18} /> Start Scanning
          </button>
          <Link to="/partner" className="btn btn-ghost" style={{ color: 'var(--sg-silver)' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </>
      )}

      {state === 'scanning' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,.15)', borderTopColor: 'var(--sg-green)', borderRadius: '50%', margin: '0 auto var(--sp-6)', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ color: 'white', marginBottom: 8 }}>Reading QR code…</h2>
          <p style={{ color: 'var(--sg-silver)' }}>Checking membership and access</p>
          <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {state === 'verified' && (
        <div style={{ textAlign: 'center', maxWidth: 480 }} className="anim-scale">
          <div style={{ width: 100, height: 100, background: 'var(--sg-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-6)', boxShadow: '0 0 40px rgba(34,197,94,.4)' }}>
            <CheckCircle size={52} color="white" />
          </div>

          <h2 style={{ color: 'var(--sg-green)', fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Member Verified ✓</h2>

          <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-6)', margin: 'var(--sp-6) 0', textAlign: 'left' }}>
            {[
              { label: 'Member', value: 'Alex Rahman' },
              { label: 'Plan', value: 'Active' },
              { label: 'Access', value: 'Approved ✓', color: 'var(--sg-green)' },
              { label: 'Visits remaining', value: '3 this month' },
              { label: 'Member since', value: 'March 2026' },
            ].map(row => (
              <div key={row.label} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: row.color || 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setState('ready')}>
              Confirm Entry
            </button>
            <button className="btn btn-ghost" style={{ color: 'var(--status-error)' }} onClick={() => setState('ready')}>
              <X size={16} /> Reject
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes scanLine{0%,100%{top:5%}50%{top:88%}}`}</style>
    </div>
  );
}
