import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share, MapPin, Clock, Users, Star, CheckCircle, Navigation, ChevronRight } from 'lucide-react';
import { mockGyms, mockUser } from '../../services/mockData';
import { useSavedGyms } from '../../hooks/useSavedGyms';
import { openDirections, sharePage } from '../../utils/browserActions';

const CROWD_LABELS = {
  low: { label: 'Low', color: 'var(--status-success)', bg: 'var(--sg-green-light)', desc: 'Usually quiet right now' },
  moderate: { label: 'Moderate', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)', desc: 'About average for this time' },
  busy: { label: 'Busy', color: 'var(--status-error)', bg: 'var(--status-error-bg)', desc: 'Expect some wait times' },
};

export default function GymDetails() {
  const { id } = useParams();
  const gym = mockGyms.find(g => g.id === id) || mockGyms[0];
  const crowd = CROWD_LABELS[gym.crowd];
  const included = gym.plans.includes(mockUser.plan);
  const [activeTab, setActiveTab] = useState('about');
  const [shareFeedback, setShareFeedback] = useState('');
  const { isSaved, toggleSavedGym } = useSavedGyms();
  const saved = isSaved(gym.id);

  const currentHour = new Date().getHours();
  const todayHour = Math.min(currentHour - 6, 23);

  return (
    <div className="anim-fade">
      {/* Back */}
      <div style={{ background: 'var(--bg-surface)', padding: 'var(--sp-4) 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <Link to="/member/explore" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            <ArrowLeft size={16} /> Explore
          </Link>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>{gym.name}</span>
        </div>
      </div>

      {/* Gallery */}
      <div className="container" style={{ paddingTop: 'var(--sp-6)', paddingBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '240px 160px', gap: 'var(--sp-2)', borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
          <img src={gym.images[0]} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover', gridRow: '1 / 3' }} />
          <div style={{ position: 'relative' }}>
            <img src={gym.images[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <img src={gym.images[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={() => window.open(gym.images[0], '_blank', 'noopener,noreferrer')} style={{ background: 'rgba(255,255,255,.95)', border: 'none', borderRadius: 'var(--r-md)', padding: '8px 16px', fontWeight: 700, fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                View all photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: 'var(--sp-8)', alignItems: 'flex-start' }} className="gym-details-grid">

          {/* Left — Main content */}
          <div>
            {/* Header */}
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
              <div>
                {gym.verified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 'var(--sp-2)' }}>
                    <CheckCircle size={14} color="var(--sg-green)" />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 600 }}>Verified Silver GYM Partner</span>
                  </div>
                )}
                <h1 style={{ fontSize: 'var(--text-5xl)', marginBottom: 6 }}>{gym.name}</h1>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontSize: 'var(--text-base)' }}>
                    <Star size={15} fill="var(--status-warning)" color="var(--status-warning)" /> {gym.rating}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>({gym.reviewCount} reviews)</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    <MapPin size={14} /> {gym.area}, Dhaka · {gym.distance} km · {gym.eta} min
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                <button onClick={() => toggleSavedGym(gym.id)} className="btn btn-secondary btn-sm" style={{ gap: 5 }}>
                  <Heart size={14} fill={saved ? 'var(--status-error)' : 'none'} color={saved ? 'var(--status-error)' : 'currentColor'} /> Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 5 }}
                  onClick={async () => {
                    const shared = await sharePage({
                      title: gym.name,
                      text: `Check out ${gym.name} on Silver GYM`,
                      url: `${window.location.origin}/member/gym/${gym.id}`,
                    });

                    setShareFeedback(shared ? 'Link shared' : 'Share unavailable');
                    window.setTimeout(() => setShareFeedback(''), 1800);
                  }}
                >
                  <Share size={14} /> {shareFeedback || 'Share'}
                </button>
              </div>
            </div>

            {/* Quick status row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
              {[
                { icon: Clock, label: 'Open Now', sub: `Until ${gym.closesAt}`, color: 'var(--status-success)' },
                { icon: Users, label: crowd.label + ' Crowd', sub: crowd.desc, color: crowd.color },
                { icon: CheckCircle, label: included ? `Included in ${mockUser.plan}` : 'Upgrade Required', sub: included ? 'Your plan covers this gym' : 'Not in your plan', color: included ? 'var(--sg-green)' : 'var(--status-error)' },
                { icon: MapPin, label: `${gym.distance} km away`, sub: `~${gym.eta} min travel`, color: 'var(--status-info)' },
              ].map(s => (
                <div key={s.label} style={{ padding: 'var(--sp-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)' }}>
                  <s.icon size={16} color={s.color} style={{ marginBottom: 6 }} />
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--sp-8)' }}>
              {[['about', 'About'], ['amenities', 'Amenities'], ['crowd', 'Crowd Times'], ['reviews', 'Reviews'], ['location', 'Location']].map(([key, label]) => (
                <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
              ))}
            </div>

            {/* About */}
            {activeTab === 'about' && (
              <div className="anim-fade">
                <h3 style={{ marginBottom: 'var(--sp-4)' }}>About the gym</h3>
                <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>{gym.description}</p>
                {gym.trainers.length > 0 && (
                  <>
                    <h3 style={{ marginBottom: 'var(--sp-5)' }}>Trainers</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--sp-4)' }}>
                      {gym.trainers.map(t => (
                        <div key={t.name} style={{ padding: 'var(--sp-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)', display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ width: 44, height: 44, background: 'var(--bg-muted)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--sg-charcoal)', flexShrink: 0 }}>
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{t.name}</p>
                            <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.specialty}</p>
                            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t.experience}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Amenities */}
            {activeTab === 'amenities' && (
              <div className="anim-fade">
                <h3 style={{ marginBottom: 'var(--sp-5)' }}>Facilities & Amenities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--sp-3)' }}>
                  {gym.amenities.map(a => (
                    <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)' }}>
                      <CheckCircle size={16} color="var(--sg-green)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crowd */}
            {activeTab === 'crowd' && (
              <div className="anim-fade">
                <h3 style={{ marginBottom: 'var(--sp-5)' }}>When should I go?</h3>
                <div style={{ padding: 'var(--sp-6)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--sp-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--sp-6)' }}>
                    <div style={{ width: 12, height: 12, background: crowd.color, borderRadius: '50%' }} />
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 700 }}>{crowd.label} right now</p>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{crowd.desc}</p>
                    </div>
                  </div>

                  <div className="crowd-bar-chart">
                    {gym.crowdByHour.slice(6, 24).map((pct, i) => {
                      const barColor = pct > 75 ? 'var(--status-error)' : pct > 45 ? 'var(--status-warning)' : 'var(--sg-green)';
                      const isNow = i === todayHour;
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div className="crowd-bar" style={{ height: `${Math.max(pct, 5)}%`, background: barColor, opacity: isNow ? 1 : .4, width: '100%' }} />
                          {i % 3 === 0 && <span style={{ fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{i + 6}am</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <h3 style={{ marginBottom: 'var(--sp-4)' }}>Opening Hours</h3>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
                  {gym.hours.map((h, i) => (
                    <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px var(--sp-5)', background: i % 2 === 0 ? 'var(--bg-subtle)' : 'var(--bg-surface)', borderBottom: i < gym.hours.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{h.day}</span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="anim-fade">
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--sp-8)', marginBottom: 'var(--sp-8)' }}>
                  <div style={{ textAlign: 'center', padding: 'var(--sp-6)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)' }}>
                    <p style={{ fontSize: 'var(--text-7xl)', fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>{gym.rating}</p>
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 4 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--status-warning)" color="var(--status-warning)" />)}
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{gym.reviewCount} reviews</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    {gym.reviews.map(r => (
                      <div key={r.author} style={{ padding: 'var(--sp-5)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)' }}>
                        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="var(--status-warning)" color="var(--status-warning)" />)}
                        </div>
                        <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>"{r.text}"</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{r.author}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{r.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {activeTab === 'location' && (
              <div className="anim-fade">
                <h3 style={{ marginBottom: 'var(--sp-5)' }}>Location</h3>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)' }}>{gym.address}</p>
                <div className="map-surface" style={{ height: 300, borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: 'var(--sp-5)', position: 'relative', border: '1px solid var(--border-subtle)' }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW1VIhpQI3RKs-ZZyXPMMuVEhv9YntXyKw3h2VyD2cNRZ46cmKGRo3_f6nKp1oNZzTybULzbWdJBky6ksIyHwl1wfe6IVgCAwMLtS6EaqnQRMYJh_HDGisidQ1a4dQR1vJ8GlsGh2mxorJ0ppt-uDCq7W0kmWHwtZ1r5iJg6Yz_9cjl5Fp_-bh9Jim_ggGuoRk45ho2g8sHOq6Gzk68orIZ12r6SlwV4Ir5h0qEXhzrQQdpheasY6g" alt="Location" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .9 }} />
                  <div className="map-pin" style={{ left: '50%', top: '50%' }}>
                    <div className="map-pin-dot active" style={{ width: 32, height: 32 }}><span style={{ fontSize: 9, fontWeight: 900 }}>SG</span></div>
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ gap: 8 }} onClick={() => openDirections(gym.address)}><Navigation size={16} /> Get Directions</button>
              </div>
            )}
          </div>

          {/* Right — Sticky access card */}
          <div style={{ position: 'sticky', top: 'calc(var(--header-h) + var(--sp-6))' }}>
            <div className="card" style={{ padding: 'var(--sp-6)', border: `2px solid ${included ? 'var(--sg-green)' : 'var(--border-default)'}`, boxShadow: included ? 'var(--shadow-green)' : 'var(--shadow-lg)' }}>
              <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Access with Silver GYM</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'var(--sp-6)' }}>
                {[
                  { label: 'Your membership', value: `${mockUser.plan} Plan` },
                  { label: 'Access status', value: included ? '✓ Included' : '✗ Upgrade needed', valueColor: included ? 'var(--sg-green)' : 'var(--status-error)' },
                  { label: 'Visits remaining', value: `${mockUser.visitsRemaining} this month` },
                  { label: 'Current crowd', value: crowd.label, valueColor: crowd.color },
                  { label: 'Gym status', value: 'Open · Until ' + gym.closesAt, valueColor: 'var(--status-success)' },
                ].map(row => (
                  <div key={row.label} className="flex-between">
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{row.label}</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: row.valueColor || 'var(--text-primary)' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {included ? (
                <>
                  <Link to={`/member/check-in/${gym.id}`} className="btn btn-primary btn-lg btn-full" style={{ marginBottom: 'var(--sp-3)' }}>
                    Check In
                  </Link>
                  <button className="btn btn-secondary btn-full" style={{ gap: 8 }} onClick={() => openDirections(gym.address)}>
                    <Navigation size={16} /> Get Directions
                  </button>
                </>
              ) : (
                <>
                  <Link to="/member/membership" className="btn btn-dark btn-lg btn-full" style={{ marginBottom: 'var(--sp-3)' }}>
                    Upgrade to Access
                  </Link>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
                    This gym is included in the Unlimited plan.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
