import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X, Zap, Check } from 'lucide-react';
import { mockGyms, mockUser } from '../../services/mockData';
import Button from '../../components/ui/Button';

export default function CheckInFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const gym = mockGyms.find(g => g.id === id) || mockGyms[0];
  
  const [step, setStep] = useState('pre'); // pre, scan, validating, success

  const handleStartScan = () => {
    setStep('scan');
    // Simulate scan success after 2 seconds
    setTimeout(() => setStep('validating'), 2000);
  };

  useEffect(() => {
    if (step === 'validating') {
      const timer = setTimeout(() => setStep('success'), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'pre') {
    return (
      <div style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column', padding: 'var(--space-6)' }} className="animate-fade-in container">
        <Link to={`/member/gym/${gym.id}`} style={{ alignSelf: 'flex-start', marginBottom: 'var(--space-8)' }}>
          <Button variant="ghost" icon={X}>Cancel</Button>
        </Link>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Check In</h1>
            <p className="text-muted" style={{ fontSize: '18px' }}>{gym.name}</p>
          </div>

          <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-8)' }}>
            <div className="flex-row-between" style={{ marginBottom: '16px' }}>
              <span className="text-muted">Current crowd</span>
              <span style={{ color: 'var(--color-status-success)', fontWeight: 600, textTransform: 'capitalize' }}>{gym.crowd}</span>
            </div>
            <div className="flex-row-between" style={{ marginBottom: '16px' }}>
              <span className="text-muted">Your Plan</span>
              <span style={{ fontWeight: 600 }}>{mockUser.tier}</span>
            </div>
            <div className="flex-row-between" style={{ marginBottom: '16px' }}>
              <span className="text-muted">Available Visits</span>
              <span style={{ fontWeight: 600 }}>{mockUser.visitsRemaining}</span>
            </div>
            <div className="flex-row-between" style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
              <span className="text-muted">Access</span>
              <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>Included ✓</span>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleStartScan}>Continue to Scan</Button>
        </div>
      </div>
    );
  }

  if (step === 'scan' || step === 'validating') {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setStep('pre')} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} />
          </button>
          <div style={{ color: 'white', fontWeight: 600 }}>{gym.name}</div>
          <button style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
          <div style={{ width: '280px', height: '280px', border: '4px solid rgba(255,255,255,0.3)', borderRadius: '24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Scanner corners */}
            <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '40px', height: '40px', borderTop: '4px solid var(--color-brand-primary)', borderLeft: '4px solid var(--color-brand-primary)', borderRadius: '24px 0 0 0' }}></div>
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '40px', height: '40px', borderTop: '4px solid var(--color-brand-primary)', borderRight: '4px solid var(--color-brand-primary)', borderRadius: '0 24px 0 0' }}></div>
            <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '40px', height: '40px', borderBottom: '4px solid var(--color-brand-primary)', borderLeft: '4px solid var(--color-brand-primary)', borderRadius: '0 0 0 24px' }}></div>
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '40px', height: '40px', borderBottom: '4px solid var(--color-brand-primary)', borderRight: '4px solid var(--color-brand-primary)', borderRadius: '0 0 24px 0' }}></div>
            
            {/* Scanning line animation */}
            {step === 'scan' && (
              <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '2px', backgroundColor: 'var(--color-brand-primary)', boxShadow: '0 0 8px var(--color-brand-primary)', animation: 'scan 2s linear infinite' }}></div>
            )}
            
            {step === 'validating' && (
              <div className="animate-fade-in" style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="spinner" style={{ marginBottom: '16px' }}></div>
                <span style={{ fontWeight: 600 }}>Validating...</span>
              </div>
            )}
          </div>
          <p style={{ color: 'white', marginTop: '32px', textAlign: 'center' }}>
            {step === 'scan' ? 'Align QR code within the frame' : 'Checking membership access'}
          </p>
        </div>

        <div style={{ padding: 'var(--space-8)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <Button variant="ghost" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>Show My Pass</Button>
          <Button variant="ghost" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>Enter Code</Button>
        </div>

        <style>{`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
          .spinner {
            width: 40px; height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: var(--color-brand-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Success Screen
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-brand-primary)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: 'var(--space-6)', color: 'white' }} className="animate-slide-up">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ width: '96px', height: '96px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-8)' }} className="animate-scale-in">
          <Check size={48} color="white" strokeWidth={3} />
        </div>
        
        <h1 style={{ color: 'white', marginBottom: 'var(--space-2)' }}>You're in!</h1>
        <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: 'var(--space-12)' }}>{gym.name}</p>

        <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 'var(--space-6)', borderRadius: '24px', width: '100%', maxWidth: '320px' }}>
          <div className="flex-row-between" style={{ marginBottom: '12px' }}>
            <span style={{ opacity: 0.8 }}>Checked in</span>
            <span style={{ fontWeight: 600 }}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex-row-between" style={{ marginBottom: '12px' }}>
            <span style={{ opacity: 0.8 }}>Workout #</span>
            <span style={{ fontWeight: 600 }}>{mockUser.totalVisits - mockUser.visitsRemaining + 1} this month</span>
          </div>
          <div className="flex-row-between">
            <span style={{ opacity: 0.8 }}>Current streak</span>
            <span style={{ fontWeight: 600 }}>{mockUser.streak + 1} days 🔥</span>
          </div>
        </div>
        
        <p style={{ fontSize: '24px', fontWeight: 700, marginTop: 'var(--space-12)' }}>Have a great workout.</p>
      </div>
      
      <Button 
        size="lg" 
        fullWidth 
        style={{ backgroundColor: 'white', color: 'var(--color-brand-primary)' }}
        onClick={() => navigate('/member')}
      >
        Done
      </Button>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}
