import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function SignIn() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left - Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--sp-16)', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-12)', textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'var(--sg-charcoal)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 12 }}>SG</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>Silver GYM</span>
        </Link>

        <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 8 }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>Sign in to your Silver GYM account</p>

        <form onSubmit={e => { e.preventDefault(); navigate('/member'); }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email address</label>
            <input type="email" className="input" placeholder="you@example.com" defaultValue="alex@example.com" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Password</label>
              <Link to="/#about" style={{ fontSize: 'var(--text-sm)', color: 'var(--sg-green)' }}>Forgot password?</Link>
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} className="input" placeholder="Your password" defaultValue="password123" style={{ paddingRight: 44 }} />
              <button type="button" className="input-icon-right" onClick={() => setShow(!show)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                {show ? <EyeOff size={17} color="var(--text-muted)" /> : <Eye size={17} color="var(--text-muted)" />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-dark btn-lg btn-full" style={{ marginTop: 'var(--sp-2)' }}>
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--sp-6)' }}>
          Don't have an account?{' '}
          <Link to="/join" style={{ color: 'var(--sg-green)', fontWeight: 600 }}>Join Silver GYM</Link>
        </p>
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

      <style>{`@media (max-width: 768px) { section { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
