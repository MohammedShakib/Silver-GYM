import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockUser } from '../../services/mockData';
import Card from '../../components/ui/Card';

export default function DigitalPass() {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#1A1D20', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-6)' }} className="animate-fade-in">
      
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <Link to="/member" style={{ color: 'white' }}>
          <ArrowLeft size={24} />
        </Link>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Digital Pass</h2>
        <div style={{ width: '24px' }}></div> {/* Spacer */}
      </div>

      <div style={{ width: '100%', maxWidth: '360px', position: 'relative' }}>
        {/* Pass Top Notch (Apple Wallet Style) */}
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '24px', backgroundColor: '#1A1D20', borderRadius: '0 0 12px 12px', zIndex: 10 }}></div>

        {/* The Pass */}
        <Card style={{ 
          backgroundColor: 'white', 
          color: 'var(--color-text-primary)', 
          borderRadius: '24px', 
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Pass Header */}
          <div style={{ backgroundColor: 'var(--color-brand-primary)', padding: 'var(--space-6)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-family-heading)', fontWeight: 800, fontSize: '24px' }}>Silver GYM</span>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600 }}>
              ACTIVE
            </div>
          </div>

          {/* Pass Info */}
          <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderBottom: '2px dashed var(--color-border-subtle)' }}>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Member</span>
              <span style={{ fontWeight: 600, fontSize: '16px' }}>{mockUser.name}</span>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Plan</span>
              <span style={{ fontWeight: 600, fontSize: '16px' }}>{mockUser.tier}</span>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Member ID</span>
              <span style={{ fontWeight: 600, fontSize: '16px', fontFamily: 'monospace' }}>{mockUser.id}</span>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Visits Left</span>
              <span style={{ fontWeight: 600, fontSize: '16px' }}>{mockUser.visitsRemaining}</span>
            </div>
          </div>

          {/* QR Code Area */}
          <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Cutouts for dashed line */}
            <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', backgroundColor: '#1A1D20', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '24px', height: '24px', backgroundColor: '#1A1D20', borderRadius: '50%' }}></div>

            <div style={{ width: '200px', height: '200px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)', position: 'relative' }}>
               {/* Simulating a real QR code using CSS pattern */}
               <div style={{ width: '180px', height: '180px', background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
               <div style={{ position: 'absolute', backgroundColor: 'white', padding: '4px', borderRadius: '8px' }}>
                 <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-brand-primary)', borderRadius: '4px' }}></div>
               </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: 'var(--space-4)' }}>
              <RefreshCw size={14} className={secondsLeft === 30 ? '' : 'spin'} />
              <span>Refreshes in {secondsLeft}s</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '12px', backgroundColor: 'var(--color-bg-subtle)', padding: '8px 12px', borderRadius: '8px' }}>
              <AlertCircle size={14} />
              Present this code at the reception
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Renews automatically on {mockUser.renewalDate}
          </div>
        </Card>
      </div>

      <style>{`
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
