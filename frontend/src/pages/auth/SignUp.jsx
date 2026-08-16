import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

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

        <form onSubmit={e => { e.preventDefault(); navigate('/onboarding'); }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>First name</label>
              <input type="text" className="input" placeholder="Alex" />
            </div>
            <div>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Last name</label>
              <input type="text" className="input" placeholder="Rahman" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email address</label>
            <input type="email" className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Phone number</label>
            <input type="tel" className="input" placeholder="+880 17XX XXXXXX" />
          </div>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" className="input" placeholder="At least 8 characters" />
          </div>
          <button type="submit" className="btn btn-dark btn-lg btn-full" style={{ marginTop: 'var(--sp-2)' }}>
            Create Account <ArrowRight size={16} />
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
