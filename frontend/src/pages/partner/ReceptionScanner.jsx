import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Zap, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { checkInService } from '../../services/CheckInService';

export default function ReceptionScanner() {
  const { gymId } = useParams();
  const [state, setState] = useState('ready'); // ready | scanning | loading | verified | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  useEffect(() => {
    return () => {
      stopScanner();
    };
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
    setState('scanning');
    
    // Slight delay to ensure DOM element exists
    setTimeout(async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode("reader");
        }
        
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText, decodedResult) => {
            if (state !== 'scanning') return; // Debounce
            await stopScanner();
            handleScan(decodedText);
          },
          (errorMessage) => {
            // parse errors ignored for continuous scanning
          }
        );
        isScanning.current = true;
      } catch (err) {
        console.error('Error starting scanner', err);
        setState('error');
        setErrorMsg('Could not start camera. Please check permissions.');
      }
    }, 100);
  };

  const handleScan = async (token) => {
    setState('loading');
    try {
      // In a real app, gymId should be derived from the logged-in partner's context.
      // For now, if we don't have gymId in params, we might hardcode or assume '1' (Iron House).
      const activeGymId = gymId || '1'; 
      
      const res = await checkInService.verifyMemberPass(activeGymId, token);
      setResult(res);
      setState('verified');
    } catch (err) {
      setState('error');
      setErrorMsg(err.response?.data?.message || 'Verification failed. Invalid pass or access denied.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 'var(--sp-8)' }} className="anim-fade">

      {state === 'ready' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-10)' }}>
            <p className="eyebrow eyebrow-dark" style={{ marginBottom: 'var(--sp-3)' }}>Partner · Reception</p>
            <h1 style={{ color: 'white', fontSize: 'var(--text-5xl)', marginBottom: 8 }}>Silver GYM<br/>Check-In</h1>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-lg)' }}>Scan a member's pass QR code to verify access</p>
          </div>

          <button
            className="btn btn-primary btn-xl"
            style={{ gap: 10, marginBottom: 'var(--sp-4)', minWidth: 260 }}
            onClick={startScanner}
          >
            <Zap size={18} /> Start Camera Scanner
          </button>
          <Link to="/partner" className="btn btn-ghost" style={{ color: 'var(--sg-silver)' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </>
      )}

      {state === 'scanning' && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
          <h2 style={{ color: 'white', marginBottom: 'var(--sp-4)' }}>Scan Member Pass</h2>
          
          <div id="reader" style={{ width: '100%', borderRadius: 'var(--r-xl)', overflow: 'hidden', background: '#000', marginBottom: 'var(--sp-4)' }}></div>
          
          <button className="btn btn-ghost" style={{ color: 'var(--sg-silver)' }} onClick={async () => { await stopScanner(); setState('ready'); }}>
            Cancel
          </button>
        </div>
      )}

      {state === 'loading' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,.15)', borderTopColor: 'var(--sg-green)', borderRadius: '50%', margin: '0 auto var(--sp-6)', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ color: 'white', marginBottom: 8 }}>Verifying…</h2>
          <p style={{ color: 'var(--sg-silver)' }}>Checking membership and access</p>
          <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {state === 'error' && (
        <div style={{ textAlign: 'center', maxWidth: 480 }} className="anim-scale">
          <div style={{ width: 100, height: 100, background: 'var(--status-error)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-6)', boxShadow: '0 0 40px rgba(239,68,68,.3)' }}>
            <X size={52} color="white" />
          </div>
          <h2 style={{ color: 'var(--status-error)', fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: 'var(--sg-silver)', marginBottom: 'var(--sp-6)' }}>{errorMsg}</p>
          
          <button className="btn btn-primary btn-lg" onClick={() => setState('ready')}>
            Scan Another
          </button>
        </div>
      )}

      {state === 'verified' && result && (
        <div style={{ textAlign: 'center', maxWidth: 480 }} className="anim-scale">
          <div style={{ width: 100, height: 100, background: 'var(--sg-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-6)', boxShadow: '0 0 40px rgba(34,197,94,.4)' }}>
            <CheckCircle size={52} color="white" />
          </div>

          <h2 style={{ color: 'var(--sg-green)', fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Member Verified ✓</h2>

          <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-6)', margin: 'var(--sp-6) 0', textAlign: 'left' }}>
            {[
              { label: 'Check-In ID', value: result.checkIn.id.slice(0, 8) },
              { label: 'Access', value: 'Approved ✓', color: 'var(--sg-green)' },
              { label: 'Method', value: 'Member Pass Scan' }
            ].map(row => (
              <div key={row.label} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: row.color || 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg" onClick={() => setState('ready')}>
            Done
          </button>
        </div>
      )}

    </div>
  );
}
