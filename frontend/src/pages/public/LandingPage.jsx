import { CheckCircle, MapPin, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { mockGyms } from '../../services/mockData';

export default function LandingPage() {
  return (
    <div className="landing-page animate-fade-in">
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--color-bg-base)', padding: 'var(--space-12) 0', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
              FitPass Dhaka
            </h4>
            <h1 style={{ marginBottom: 'var(--space-6)', lineHeight: 1.1 }}>
              Your city is <br/>
              <span style={{ color: 'var(--color-brand-primary)' }}>your gym.</span>
            </h1>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-8)', maxWidth: '480px' }}>
              Access trusted gyms across Dhaka with one flexible membership. Work out near home, office, university, or wherever your day takes you.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
              <Link to="/explore"><Button variant="primary" size="lg" icon={Search}>Explore Gyms</Button></Link>
              <Link to="#memberships"><Button variant="secondary" size="lg">See Memberships</Button></Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', color: '#F59F00' }}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>4.8</span> member rating
              <span style={{ margin: '0 var(--space-2)' }}>•</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>120+</span> Partner Gyms
            </div>
          </div>

          <div style={{ position: 'relative', height: '600px' }}>
            <Card style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: '24px', overflow: 'hidden', padding: 0, border: '4px solid white', boxShadow: 'var(--shadow-xl)' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCdCcHSyJ5meOw19OhgNsU7Sqn9zY8PLzeIDNQdb73Xn0YcGRxPnq42sCWcbhGZgkxjK57pR4bN09A8JDbhp3KCOofHBADyc70NyfmNFVkbekxeLrqSVMeHniv145NSLLh6uHuKE_elEFH5PGsZJX-JxAEl67_MYJO00LNrUunoVmLumn6cwMVLew0Nndd3uOsixIHORQRU65bT5OSSqs6x95UCkVKf1gKf-delCarR2IK3GsH2m1T" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Overlay elements to simulate UI */}
              <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--color-brand-primary)', color: 'white', padding: '8px', borderRadius: '50%', boxShadow: 'var(--shadow-md)', marginBottom: '8px' }}>
                  <MapPin size={24} />
                </div>
              </div>

              <Card style={{ position: 'absolute', bottom: 'var(--space-6)', right: 'var(--space-6)', left: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
                <img src={mockGyms[0].image} alt="Gym" style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: '2px' }}>{mockGyms[0].name}</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', margin: 0, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="text-muted">{mockGyms[0].area}</span>
                    <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>Low crowd</span>
                  </p>
                </div>
                <Badge variant="success">Included</Badge>
              </Card>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: 'var(--space-24) 0', backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2>How FitPass Works</h2>
          </div>
          <div className="grid-cols-auto" style={{ gap: 'var(--space-8)' }}>
            {[
              { num: '01', title: 'Choose your plan', desc: 'Select a flexible membership tier.' },
              { num: '02', title: 'Find a nearby gym', desc: 'Search by location, amenities, or crowd.' },
              { num: '03', title: 'Check in with FitPass', desc: 'Scan the QR code at the reception.' },
              { num: '04', title: 'Workout anywhere', desc: 'Enjoy your session across Dhaka.' }
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--color-brand-primary-light)', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
                  {step.num}
                </div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships */}
      <section id="memberships" style={{ padding: 'var(--space-24) 0', backgroundColor: 'var(--color-bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2>Choose Your Plan</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>Flexible monthly subscriptions. No hidden fees. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'center' }}>
            
            <Card style={{ padding: 'var(--space-8)' }}>
              <h3>Essential</h3>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>For casual users.</p>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800 }}>৳1,990</span><span className="text-muted">/mo</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                {['5 visits per month', 'Essential tier gyms', 'Basic analytics'].map(feature => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <CheckCircle size={20} color="var(--color-brand-primary)" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" fullWidth>Get Essential</Button>
            </Card>

            <Card style={{ padding: 'var(--space-8)', border: '2px solid var(--color-brand-primary)', transform: 'scale(1.05)', boxShadow: 'var(--shadow-xl)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)' }}>
                <Badge variant="success" style={{ backgroundColor: 'var(--color-brand-primary)', color: 'white' }}>RECOMMENDED</Badge>
              </div>
              <h3>Active</h3>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>For regular fitness enthusiasts.</p>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800 }}>৳3,490</span><span className="text-muted">/mo</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                {['15 visits per month', 'Active + Essential tier gyms', 'Advanced analytics', '1 free freeze per year'].map(feature => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <CheckCircle size={20} color="var(--color-brand-primary)" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" fullWidth>Get Active</Button>
            </Card>

            <Card style={{ padding: 'var(--space-8)' }}>
              <h3>Unlimited</h3>
              <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>For fitness freaks.</p>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800 }}>৳5,990</span><span className="text-muted">/mo</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                {['Unlimited visits', 'All gym tiers included', 'Priority support', 'Unlimited freezes'].map(feature => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <CheckCircle size={20} color="var(--color-brand-primary)" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" fullWidth>Get Unlimited</Button>
            </Card>

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 992px) {
          .landing-page section > .container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
