import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, MapPin, Clock, Users, Zap, ChevronRight, Shield, TrendingUp } from 'lucide-react';
import { GYM_IMAGES, mockGyms, plans, AREAS } from '../../services/mockData';

function TrustStat({ number, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{number}</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function FeatureGymCard({ gym }) {
  const crowdColors = { low: 'var(--status-success)', moderate: 'var(--status-warning)', busy: 'var(--status-error)' };
  return (
    <div className="card card-shadow card-hover" style={{ overflow: 'hidden' }}>
      <div style={{ height: 200, position: 'relative' }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {gym.plans.includes('Active') && (
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span className="badge badge-green" style={{ fontSize: 10 }}>Active + Unlimited</span>
          </div>
        )}
      </div>
      <div style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
            {gym.name}
            {gym.verified && <CheckCircle size={14} color="var(--sg-green)" />}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            <Star size={12} fill="var(--status-warning)" color="var(--status-warning)" /> {gym.rating}
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <MapPin size={12} /> {gym.area} · {gym.distance} km · {gym.eta} min
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>
            <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />Open · {gym.closesAt}
          </span>
          <span style={{ color: crowdColors[gym.crowd], fontWeight: 600 }}>{gym.crowd.charAt(0).toUpperCase() + gym.crowd.slice(1)} Crowd</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--sp-4)' }}>
          {gym.amenities.slice(0, 3).map(a => (
            <span key={a} style={{ fontSize: 11, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 'var(--r-sm)' }}>{a}</span>
          ))}
        </div>
        <Link to={`/member/gym/${gym.id}`} className="btn btn-secondary btn-sm btn-full">View Gym</Link>
      </div>
    </div>
  );
}

function PricingCard({ plan }) {
  return (
    <div
      className="card"
      style={{
        padding: 'var(--sp-8)',
        border: plan.recommended ? '2px solid var(--sg-green)' : '1px solid var(--border-subtle)',
        position: 'relative',
        boxShadow: plan.recommended ? 'var(--shadow-green)' : 'var(--shadow-sm)',
        transform: plan.recommended ? 'scale(1.03)' : 'none',
      }}
    >
      {plan.recommended && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
          <span className="badge badge-green" style={{ background: 'var(--sg-green)', color: 'white', fontSize: 11, padding: '.25rem .875rem' }}>
            MOST POPULAR
          </span>
        </div>
      )}
      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>{plan.name}</h3>
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <span style={{ fontSize: 'var(--text-5xl)', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>৳{plan.price.toLocaleString()}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>/month</span>
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 'var(--sp-8)' }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
            <CheckCircle size={15} color="var(--sg-green)" style={{ flexShrink: 0 }} /> {f}
          </li>
        ))}
        {plan.missing.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <span style={{ width: 15, height: 15, flexShrink: 0, border: '1.5px solid var(--border-default)', borderRadius: '50%', display: 'inline-block' }} /> {f}
          </li>
        ))}
      </ul>
      <Link
        to="/join"
        className={`btn btn-full btn-lg ${plan.recommended ? 'btn-primary' : 'btn-secondary'}`}
      >
        Get {plan.name}
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const featuredGyms = mockGyms.slice(0, 3);

  return (
    <div className="anim-fade">

      {/* ════════════ HERO ════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        background: 'linear-gradient(160deg, var(--bg-surface) 60%, var(--bg-subtle) 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 25% 60%, rgba(34,197,94,.04) 0%, transparent 50%), radial-gradient(circle at 75% 20%, rgba(28,33,40,.03) 0%, transparent 50%)', pointerEvents: 'none' }} />

        {/* Left */}
        <div style={{ padding: 'var(--sp-24) var(--sp-16) var(--sp-24) var(--page-px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 580 }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>Silver GYM · Dhaka</p>

            <h1 style={{ fontSize: 'clamp(2.75rem, 5vw, 4.25rem)', fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 'var(--sp-6)', color: 'var(--text-primary)' }}>
              One membership.{' '}
              <span style={{ color: 'var(--sg-green)' }}>Every gym</span>{' '}
              you need.
            </h1>

            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--sp-8)', maxWidth: 480 }}>
              Access trusted gyms across Dhaka with one flexible Silver GYM membership. Train near home, office, university — or wherever your day takes you.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-8)' }}>
              <Link to="/member/explore" className="btn btn-dark btn-lg" style={{ gap: 8 }}>
                Explore Gyms <ArrowRight size={17} />
              </Link>
              <Link to="/#plans" className="btn btn-secondary btn-lg">View Memberships</Link>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-6)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--status-warning)" color="var(--status-warning)" />)}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>4.8 Member Rating</span>
              </div>
              <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>120+</strong> Partner Gyms
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>8+</strong> Areas
              </span>
            </div>
          </div>
        </div>

        {/* Right — Product visual */}
        <div style={{ padding: 'var(--sp-12) var(--page-px) var(--sp-12) var(--sp-8)', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', height: 600 }}>
            {/* Map background */}
            <div className="map-surface" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-2xl)', boxShadow: 'var(--shadow-2xl)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <img src={GYM_IMAGES.hero} alt="Dhaka map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .85 }} />

              {/* Map pins */}
              <div className="user-pin" style={{ left: '42%', top: '55%' }} />
              {[
                { left: '42%', top: '30%', label: 'Iron House' },
                { left: '28%', top: '60%', label: 'PowerFit' },
                { left: '68%', top: '38%', label: 'Block 35' },
              ].map((p, i) => (
                <div key={i} className="map-pin" style={{ left: p.left, top: p.top }}>
                  <div className={`map-pin-dot ${i === 0 ? 'active' : ''}`} style={{ width: 28, height: 28 }}>
                    <span style={{ fontSize: 10, fontWeight: 800 }}>SG</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Gym preview card */}
            <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16, background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(12px)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-4)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12, alignItems: 'center' }}>
              <img src={mockGyms[0].image} alt="Gym" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <strong style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Iron House Fitness</strong>
                  <CheckCircle size={13} color="var(--sg-green)" />
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 'var(--text-xs)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-muted)' }}><MapPin size={11} /> Mirpur 10 · 0.7 km</span>
                  <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Low Crowd</span>
                </div>
              </div>
              <span className="badge badge-green" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>Included ✓</span>
            </div>

            {/* Pass overlay */}
            <div style={{ position: 'absolute', top: 20, right: -16, width: 200, background: 'linear-gradient(135deg, #1C2128, #2D3748)', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-xl)', color: 'white', border: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ fontSize: 9, color: 'var(--sg-silver)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.07em' }}>Silver GYM</p>
              <span className="badge badge-green" style={{ fontSize: 9, marginBottom: 8, display: 'inline-flex' }}>ACTIVE</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'white', margin: '4px 0 2px' }}>Alex Rahman</p>
              <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 10px' }}>Active Plan · SG-2048-DA</p>
              <div style={{ height: 3, background: 'rgba(255,255,255,.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: '80%', background: 'var(--sg-green)', borderRadius: 2 }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: 0 }}>12 / 15 visits</p>
            </div>

            {/* Access success badge */}
            <div style={{ position: 'absolute', top: '52%', left: 20, background: 'white', borderRadius: 12, padding: '8px 14px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 7, border: '1px solid var(--sg-green-muted)' }}>
              <CheckCircle size={16} color="var(--sg-green)" />
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>Access Available</p>
                <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>Included in Active Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile responsive */}
        <style>{`
          @media (max-width: 900px) {
            section:first-of-type { grid-template-columns: 1fr !important; }
            section:first-of-type > div:last-child { display: none; }
            section:first-of-type > div:first-child { padding: 6rem 1.5rem 4rem !important; }
          }
        `}</style>
      </section>

      {/* ════════════ TRUST STRIP ════════════ */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: 'var(--sp-10) 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-8)', alignItems: 'center' }}>
          <TrustStat number="120+" label="Partner Gyms" />
          <div style={{ width: 1, height: 48, background: 'var(--border-subtle)', margin: '0 auto' }} />
          <TrustStat number="10K+" label="Monthly Check-ins" />
          <div style={{ width: 1, height: 48, background: 'var(--border-subtle)', margin: '0 auto' }} />
          <TrustStat number="8+" label="Dhaka Areas" />
          <div style={{ width: 1, height: 48, background: 'var(--border-subtle)', margin: '0 auto' }} />
          <TrustStat number="4.8★" label="Member Rating" />
          <div style={{ display: 'none' }} />
        </div>
        <style>{`.container > div:nth-child(even) { display: block; } @media (max-width: 600px) { .container > div:nth-child(even) { display: none !important; } }`}</style>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how" style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>How It Works</p>
            <h2>One membership. A simpler<br/>way to train.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-6)', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: 32, left: '12%', right: '12%', height: 2, background: 'linear-gradient(to right, var(--sg-green-muted), var(--sg-green), var(--sg-green-muted))', zIndex: 0 }} className="hide-mobile" />

            {[
              { num: '01', title: 'Choose your membership', desc: 'Pick a plan that fits your training frequency. Cancel anytime.', color: 'var(--sg-green-light)', textColor: 'var(--sg-green-active)' },
              { num: '02', title: 'Find a gym nearby', desc: 'Search by your current location, area, or facility type.', color: 'var(--status-info-bg)', textColor: 'var(--status-info)' },
              { num: '03', title: 'Check in with Silver GYM', desc: 'Scan the gym QR or show your digital member pass.', color: 'var(--status-warning-bg)', textColor: '#92400E' },
              { num: '04', title: 'Workout anywhere', desc: 'Your membership follows you to every gym in the network.', color: 'var(--bg-dark)', textColor: 'var(--sg-green)' },
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 64, height: 64, background: step.color, borderRadius: 'var(--r-2xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-5)', border: '2px solid white', boxShadow: 'var(--shadow-md)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'var(--text-xl)', color: step.textColor }}>{step.num}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>{step.title}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CITY COVERAGE ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-16)', alignItems: 'center' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>City Coverage</p>
              <h2 style={{ marginBottom: 'var(--sp-5)' }}>Train wherever<br/>Dhaka takes you.</h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)', lineHeight: 1.7 }}>
                Silver GYM partner gyms are spread across 8+ major areas. Your membership works at all of them.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
                {AREAS.map(area => (
                  <div key={area.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: area.active ? '1.5px solid var(--sg-green)' : '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {area.active && <span style={{ width: 7, height: 7, background: 'var(--sg-green)', borderRadius: '50%', display: 'inline-block' }} />}
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{area.name}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{area.gyms} gyms</span>
                  </div>
                ))}
              </div>
              <Link to="/member/explore" className="btn btn-dark">Explore All Areas <ArrowRight size={16} /></Link>
            </div>

            {/* Visual map placeholder */}
            <div className="map-surface" style={{ height: 460, borderRadius: 'var(--r-2xl)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-subtle)' }}>
              <img src={GYM_IMAGES.hero} alt="Dhaka coverage map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .85 }} />
              {[
                { label: 'Mirpur', left: '30%', top: '55%' },
                { label: 'Gulshan', left: '68%', top: '35%' },
                { label: 'Uttara', left: '52%', top: '18%' },
                { label: 'Banani', left: '60%', top: '42%' },
              ].map(p => (
                <div key={p.label} className="map-pin" style={{ left: p.left, top: p.top }}>
                  <div className="map-pin-dot"><span style={{ fontSize: 9, fontWeight: 800 }}>SG</span></div>
                  <div className="map-pin-label">{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FEATURED GYMS ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-10)' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 'var(--sp-3)' }}>Partner Gyms</p>
              <h2>Discover your next<br/>workout spot</h2>
            </div>
            <Link to="/member/explore" className="btn btn-secondary" style={{ gap: 6, whiteSpace: 'nowrap' }}>
              View All Gyms <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-6)' }}>
            {featuredGyms.map(gym => <FeatureGymCard key={gym.id} gym={gym} />)}
          </div>
        </div>
      </section>

      {/* ════════════ LIFESTYLE SCENARIO ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--sg-charcoal)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow eyebrow-dark" style={{ marginBottom: 'var(--sp-4)' }}>Real Life Flexibility</p>
          <h2 style={{ color: 'white', marginBottom: 'var(--sp-5)' }}>Your membership<br/>moves with you.</h2>
          <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-lg)', marginBottom: 'var(--sp-12)' }}>
            One membership. Multiple locations. Zero new contracts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-6)' }}>
            {[
              { icon: '🌅', time: '7:00 AM', label: 'Morning · Home', gym: 'Iron House Fitness', area: 'Mirpur 10', image: GYM_IMAGES.ironHouse },
              { icon: '🏙️', time: '6:30 PM', label: 'After Work · Office', gym: 'Urban Strength', area: 'Banani', image: GYM_IMAGES.urbanFit },
              { icon: '☀️', time: '10:00 AM', label: 'Weekend', gym: 'Block 35 Fitness', area: 'Gulshan 2', image: GYM_IMAGES.block35 },
            ].map(s => (
              <div key={s.gym} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img src={s.image} alt={s.gym} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.7)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,.5)', borderRadius: 8, padding: '4px 10px', fontSize: 'var(--text-xs)', color: 'white', fontWeight: 600 }}>
                    {s.time}
                  </div>
                </div>
                <div style={{ padding: 'var(--sp-5)' }}>
                  <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</p>
                  <h4 style={{ color: 'white', fontSize: 'var(--text-lg)', marginBottom: 4 }}>{s.gym}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>
                    <MapPin size={12} color="var(--sg-green)" /> {s.area}
                    <span className="badge badge-green" style={{ marginLeft: 4, fontSize: 9 }}>Active ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MEMBERSHIP PLANS ════════════ */}
      <section id="plans" style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>Membership Plans</p>
            <h2>Flexible plans for<br/>every trainer</h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginTop: 'var(--sp-4)' }}>
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-6)', alignItems: 'center' }}>
            {plans.map(plan => <PricingCard key={plan.id} plan={plan} />)}
          </div>
        </div>
      </section>

      {/* ════════════ GYM OWNER CTA ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ background: 'var(--sg-charcoal)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-16)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--sp-12)', alignItems: 'center' }}>
            <div>
              <p className="eyebrow eyebrow-dark" style={{ marginBottom: 'var(--sp-4)' }}>For Gym Owners</p>
              <h2 style={{ color: 'white', marginBottom: 'var(--sp-5)' }}>Grow your gym<br/>with Silver GYM.</h2>
              <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-lg)', marginBottom: 'var(--sp-8)', lineHeight: 1.7 }}>
                Reach new members, fill off-peak capacity, and track verified visitors — all from one partner dashboard.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-10)' }}>
                {[
                  'Reach new Silver GYM members',
                  'Fill off-peak capacity',
                  'Verified digital check-ins',
                  'Transparent payout tracking',
                  'No manual membership management',
                  'Real-time gym analytics',
                ].map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>
                    <CheckCircle size={14} color="var(--sg-green)" style={{ flexShrink: 0 }} /> {b}
                  </div>
                ))}
              </div>
              <Link to="/for-gyms" className="btn btn-primary btn-lg">Become a Partner <ArrowRight size={16} /></Link>
            </div>
            <div className="hide-mobile" style={{ width: 280, flexShrink: 0 }}>
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
                <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', marginBottom: 'var(--sp-4)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Today's Overview</p>
                {[
                  { label: 'Check-ins', value: '34' },
                  { label: 'Active Visitors', value: '18' },
                  { label: 'Estimated Payout', value: '৳4,200' },
                  { label: 'Avg Rating', value: '4.8 ★' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--sg-silver)' }}>{s.label}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'white' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>Member Stories</p>
            <h2>Real members.<br/>Real workouts.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-6)' }}>
            {[
              { name: 'Tanvir Ahmed', role: 'Member · Mirpur', quote: 'I travel between Mirpur and Gulshan for work. Silver GYM means I can train near whichever office I\'m at. One plan. Zero excuses.', rating: 5 },
              { name: 'Nadia Chowdhury', role: 'Member · Banani', quote: 'As a student I couldn\'t afford multiple gym memberships. Silver GYM covers my home in Mirpur and my university area in Uttara.', rating: 5 },
              { name: 'Imran Kabir', role: 'Gym Owner · Mirpur', quote: 'Our off-peak hours are now filled with Silver GYM members. The check-in system is seamless and payouts are transparent.', rating: 5 },
            ].map(t => (
              <div key={t.name} className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--sp-4)' }}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={13} fill="var(--status-warning)" color="var(--status-warning)" />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--sp-5)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--sg-charcoal)' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: 'var(--sp-4)' }}>Get Started</p>
          <h2 style={{ marginBottom: 'var(--sp-5)' }}>Ready to make<br/>Dhaka your gym?</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>
            Join 10,000+ members already training anywhere in the city.
          </p>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/join" className="btn btn-dark btn-xl" style={{ gap: 8 }}>Join Silver GYM <ArrowRight size={18} /></Link>
            <Link to="/member/explore" className="btn btn-secondary btn-xl">Explore Gyms</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
