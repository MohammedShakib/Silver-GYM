import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/member');
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 'var(--space-12)' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-10)' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= step ? 'var(--color-brand-primary)' : 'var(--color-bg-subtle)' }}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Where do you usually work out?</h1>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>We'll find the best gyms near your usual locations.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'Office', 'University'].map(loc => (
                <button key={loc} onClick={handleNext} style={{ padding: '24px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', fontSize: '18px', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>
                  {loc}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: 'var(--space-2)' }}>What are your fitness goals?</h1>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Select all that apply.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 'var(--space-8)' }}>
              {['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength', 'Cardio', 'Yoga / Mobility'].map(goal => (
                <button key={goal} style={{ padding: '16px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', fontWeight: 500, cursor: 'pointer' }}>
                  {goal}
                </button>
              ))}
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>Continue</Button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Your Recommended Plan</h1>
            <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Based on your goals and location.</p>
            
            <div style={{ backgroundColor: 'var(--color-brand-primary-light)', padding: 'var(--space-8)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--color-brand-primary)', marginBottom: 'var(--space-8)' }}>
              <div style={{ color: 'var(--color-brand-primary)', fontWeight: 800, marginBottom: '8px' }}>ACTIVE PLAN</div>
              <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>৳3,490 <span style={{ fontSize: '16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>/mo</span></div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <li>✓ 15 visits per month</li>
                <li>✓ Active + Essential tier gyms</li>
                <li>✓ Great for {mockUser.location} area</li>
              </ul>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>Activate Membership</Button>
          </div>
        )}

      </div>
    </div>
  );
}
