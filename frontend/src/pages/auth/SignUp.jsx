import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const name = `${firstName} ${lastName}`.trim();
    const res = await register(name, email, password, phone);
    
    if (res.success) {
      navigate('/onboarding', { replace: true });
    } else {
      setError(res.error || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-12)', textDecoration: 'none', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, background: 'var(--sg-charcoal)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 12 }}>SG</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>Silver GYM</span>
        </Link>

        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 8, textAlign: 'center' }}>Create your account</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)', textAlign: 'center' }}>Start with just the basics.</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="auth-form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>First name</label>
              <input type="text" className="input" placeholder="Alex" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Last name</label>
              <input type="text" className="input" placeholder="Rahman" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email address</label>
            <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Phone number</label>
            <input type="tel" className="input" placeholder="+880 17XX XXXXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" className="input" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} minLength="8" required />
          </div>
          <button type="submit" className="btn btn-dark btn-lg btn-full" style={{ marginTop: 'var(--sp-2)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : <><span style={{ marginRight: '8px' }}>Create Account</span> <ArrowRight size={16} /></>}
          </button>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
            By creating an account you agree to our{' '}
            <Link to="/#about" style={{ color: 'var(--sg-green)' }}>Terms</Link> and{' '}
            <Link to="/#about" style={{ color: 'var(--sg-green)' }}>Privacy Policy</Link>
          </p>
        </form>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-6)' }}>
          Already a member?{' '}
          <Link to="/sign-in" style={{ color: 'var(--sg-green)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
