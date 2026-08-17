import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Zap, ChevronRight, Star, Clock, CheckCircle, Flame } from 'lucide-react';
import { mockUser, mockGyms, mockActivity, weeklyData } from '../../services/mockData';
import { GymCardLarge } from '../../components/gym/GymCards';
import DigitalPassCard from '../../components/pass/DigitalPassCard';
import { openDirections } from '../../utils/browserActions';

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 18 ? 'Good afternoon' : 'Good evening';

const QUICK_FILTERS = ['Near Me', 'Open Now', 'Low Crowd', 'Included in My Plan'];

export default function MemberHome() {
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bestMatch = mockGyms[0]; // Iron House
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    navigate(`/member/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="anim-fade">
      {/* ── Greeting Banner & Search ── */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: 'var(--sp-8) 0 var(--sp-6)' }}>
        <div className="container">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {GREETING}, {mockUser.firstName} 👋
              </h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>Where do you want to train today?</p>
            </div>
            <button
              onClick={() => navigate('/member/explore')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.45rem 0.875rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--r-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all .15s ease',
              }}
            >
              <MapPin size={13} color="var(--sg-green)" />
              <span>{mockUser.location}</span>
              <ChevronRight size={13} color="var(--text-muted)" />
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="input-group" style={{ position: 'relative', maxWidth: 640, marginBottom: 'var(--sp-4)' }}>
            <Search size={18} className="input-icon" color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input search-bar input-with-icon"
              placeholder="Search gym, area or facility"
              style={{ fontSize: 'var(--text-sm)' }}
            />
            <div className="input-icon-right" style={{ right: 8 }}>
              <button
                type="submit"
                className="btn btn-dark btn-sm"
                style={{ padding: '0.4rem 0.9rem', fontSize: 'var(--text-xs)', borderRadius: 'var(--r-full)' }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick filters */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {QUICK_FILTERS.map(f => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => {
                  setFilter(f === filter ? '' : f);
                  navigate(`/member/explore?filter=${encodeURIComponent(f)}`);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

        {/* ── ROW 1: Best Match + Digital Pass ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)', alignItems: 'stretch' }} className="home-row-1">

          {/* Best Match */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Best match right now</h2>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                <Zap size={11} /> 92% match
              </span>
            </div>

            <div className="card card-shadow" style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 280, flex: 1 }} className="best-match-grid">
                <div style={{ position: 'relative', minHeight: 220 }}>
                  <img src={bestMatch.image} alt={bestMatch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge badge-green" style={{ fontWeight: 800, fontSize: 10 }}>RECOMMENDED</span>
                  </div>
                </div>

                <div style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                        <span>{bestMatch.name}</span>
                        {bestMatch.verified && <CheckCircle size={15} color="var(--sg-green)" fill="var(--sg-green-light)" />}
                      </h3>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                        <Star size={13} fill="var(--status-warning)" color="var(--status-warning)" />
                        <span>{bestMatch.rating}</span>
                      </span>
                    </div>

                    <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 var(--sp-4)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color="var(--sg-green)" /> {bestMatch.area}</span>
                      <span style={{ color: 'var(--border-default)' }}>·</span>
                      <span>{bestMatch.distance} km</span>
                      <span style={{ color: 'var(--border-default)' }}>·</span>
                      <span>{bestMatch.eta} min</span>
                    </p>

                    {/* Status grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                      <div style={{ padding: '8px 12px', background: 'var(--sg-green-light)', borderRadius: 'var(--r-sm)', border: '1px solid var(--sg-green-muted)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: 'var(--sg-green-active)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ACCESS</p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--sg-green-active)' }}>Included in Plan ✓</p>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>CROWD</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--status-success)' }}>Low · Quiet now</p>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>HOURS</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)' }}>Until {bestMatch.closesAt}</p>
                      </div>
                      <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-subtle)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DISTANCE</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)' }}>{bestMatch.distance} km away</p>
                      </div>
                    </div>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '8px 12px', borderRadius: 'var(--r-sm)', margin: '0 0 var(--sp-4)', lineHeight: 1.5, border: '1px solid var(--border-subtle)' }}>
                      <strong>Why this gym?</strong> Close to Mirpur 10, low crowd right now, and includes your preferred strength machines.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                    <Link to={`/member/gym/${bestMatch.id}`} className="btn btn-dark btn-md" style={{ flex: 1 }}>View Gym</Link>
                    <button className="btn btn-secondary btn-md" onClick={() => openDirections(bestMatch.address)}>Directions</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Pass */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Silver GYM Pass</h2>
              <Link to="/member/pass" style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700 }}>
                View details →
              </Link>
            </div>

            <DigitalPassCard compact onOpen={() => navigate('/member/pass')} />

            {/* Contextual advice */}
            <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-lg)', flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, background: 'var(--sg-green)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Optimal Workout Window</p>
                  <p style={{ margin: '0 0 6px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Partner gyms in Mirpur are 35% less crowded than average right now.
                  </p>
                  <Link to={`/member/gym/${bestMatch.id}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Quick check-in at Iron House →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Nearby Gyms ── */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Nearby partner gyms</h2>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Included in your multi-gym subscription</p>
            </div>
            <Link to="/member/explore" className="btn btn-ghost btn-sm" style={{ gap: 5, fontWeight: 700 }}>
              <span>View all 24 gyms</span> <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
            {mockGyms.slice(0, 3).map(gym => (
              <GymCardLarge key={gym.id} gym={gym} />
            ))}
          </div>
        </div>

        {/* ── ROW 3: Activity + Membership ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)', alignItems: 'stretch' }} className="home-row-3">

          {/* Weekly Activity */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Weekly activity</h2>
              <Link to="/member/activity" style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700 }}>Full stats →</Link>
            </div>

            <div className="card card-shadow" style={{ padding: 'var(--sp-6)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>This Week</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-primary)' }}>
                    4 <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>/ 5 goal</span>
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Streak</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 900, color: '#F59E0B' }}>
                    {mockUser.streak} days 🔥
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Training Time</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--text-primary)' }}>
                    4h 35m
                  </p>
                </div>
              </div>

              {/* Bar chart */}
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 8px' }}>Daily workout duration (minutes)</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: 80, gap: 8 }}>
                  {weeklyData.map((d) => (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        title={`${d.day}: ${d.min} minutes`}
                        style={{
                          width: '100%',
                          height: d.min ? `${Math.max(12, (d.min / 90) * 80)}px` : 4,
                          background: d.min ? 'var(--sg-green)' : 'var(--bg-muted)',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 4,
                          transition: 'height .3s ease',
                        }}
                      />
                      <span style={{ fontSize: 10, fontWeight: 600, color: d.min ? 'var(--text-primary)' : 'var(--text-muted)' }}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Membership Usage */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Membership usage</h2>
              <Link to="/member/membership" style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700 }}>Manage →</Link>
            </div>

            <div className="card card-shadow" style={{ padding: 'var(--sp-6)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>{mockUser.plan} Plan</p>
                    <span className="badge badge-green">Active Subscription</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'right' }}>
                    Renews<br /><strong>{mockUser.renewalDate}</strong>
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--sp-4)' }}>
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Visits used this cycle</span>
                    <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{mockUser.visitsUsed} / {mockUser.visitsTotal}</span>
                  </div>
                  <div className="progress-track" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${(mockUser.visitsUsed / mockUser.visitsTotal) * 100}%` }} />
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>
                    <strong style={{ color: 'var(--sg-green)' }}>{mockUser.visitsRemaining} visits</strong> remaining before renewal
                  </p>
                </div>
              </div>

              <Link to="/member/membership" className="btn btn-secondary btn-sm btn-full" style={{ marginTop: 'var(--sp-4)' }}>
                View Plan & Billing
              </Link>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Recent Activity ── */}
        <div>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Recent check-ins</h2>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Your logged workout history</p>
            </div>
            <Link to="/member/activity" className="btn btn-ghost btn-sm" style={{ gap: 5, fontWeight: 700 }}>
              <span>View all activity</span> <ArrowRight size={14} />
            </Link>
          </div>

          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            {mockActivity.slice(0, 4).map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-4)',
                  padding: '12px 0',
                  borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    background: item.type === 'checkin' ? 'var(--sg-green-light)' : 'var(--status-warning-bg)',
                    borderRadius: 'var(--r-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                  }}
                >
                  {item.type === 'checkin' ? '🏋️' : '🏆'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {item.type === 'checkin' ? `Checked in at ${item.gym}` : item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {item.date} · {item.time} {item.duration ? `· ${item.duration}` : ''}
                  </p>
                </div>
                {item.type === 'checkin' && (
                  <Link
                    to={`/member/gym/${item.gymId}`}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--sg-green)', fontWeight: 700, fontSize: 'var(--text-xs)' }}
                  >
                    View Gym
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

