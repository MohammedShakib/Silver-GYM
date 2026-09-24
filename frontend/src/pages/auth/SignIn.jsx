import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignIn() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLoginSuccess = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
    } else if (user.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    } else if (user.role === 'GYM_OWNER') {
      navigate('/partner', { replace: true });
    } else {
      navigate('/member', { replace: true });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(email, password);
    
    if (res.success) {
      handleLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async (demoEmail) => {
    setError('');
    setIsSubmitting(true);
    setEmail(demoEmail);
    setPassword('password123');
    
    const res = await login(demoEmail, 'password123');
    if (res.success) {
      handleLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-split-page" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left - Form */}
      <div className="auth-form-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--sp-16)', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-12)', textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'var(--sg-charcoal)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 12 }}>SG</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>Silver GYM</span>
        </Link>

        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>Sign in to your Silver GYM account</p>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Password</label>
              <Link to="/#about" style={{ fontSize: 'var(--text-sm)', color: 'var(--sg-green)' }}>Forgot password?</Link>
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <input 
                type={show ? 'text' : 'password'} 
                className="input" 
                placeholder="Your password" 
                style={{ paddingRight: 44 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="input-icon-right" onClick={() => setShow(!show)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                {show ? <EyeOff size={17} color="var(--text-muted)" /> : <Eye size={17} color="var(--text-muted)" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-dark btn-lg btn-full" style={{ marginTop: 'var(--sp-2)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : <><span style={{ marginRight: '8px' }}>Sign In</span> <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-6)' }}>
          Don't have an account?{' '}
          <Link to="/join" style={{ color: 'var(--sg-green)', fontWeight: 600 }}>Join Silver GYM</Link>
        </p>

        {/* Demo Login Buttons */}
        <div style={{ marginTop: '32px', padding: '16px', background: '#161B22', borderRadius: '12px', border: '1px solid #30363D' }}>
          <p style={{ fontSize: '13px', color: '#8B949E', marginBottom: '12px', textAlign: 'center', fontWeight: 600 }}>QUICK DEMO ACCESS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="button" onClick={() => handleDemoSignIn('alex@example.com')} className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }} disabled={isSubmitting}>
              Login as Member
            </button>
            <button type="button" onClick={() => handleDemoSignIn('owner@silvergym.test')} className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }} disabled={isSubmitting}>
              Login as Partner
            </button>
            <button type="button" onClick={() => handleDemoSignIn('admin@silvergym.test')} className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }} disabled={isSubmitting}>
              Login as Admin
            </button>
          </div>
        </div>
      </div>

      {/* Right - Visual */}
      <div style={{ background: 'var(--sg-charcoal)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--sp-12)' }} className="hide-mobile">
        <h2 style={{ color: 'white', fontSize: 'var(--text-4xl)', textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
          One membership.<br/><span style={{ color: 'var(--sg-green)' }}>Every gym.</span>
        </h2>
        <p style={{ color: 'var(--sg-silver)', textAlign: 'center', fontSize: 'var(--text-lg)', maxWidth: 360 }}>
          120+ partner gyms across 8 areas of Dhaka. All in one membership.
        </p>
      </div>
    </div>
  );
}
