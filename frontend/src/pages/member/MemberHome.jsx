import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Users, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { mockUser, mockGyms, mockActivity, weeklyData } from '../../services/mockData';
import { GymCardLarge } from '../../components/gym/GymCards';
import DigitalPassCard from '../../components/pass/DigitalPassCard';

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 18 ? 'Good afternoon' : 'Good evening';

const QUICK_FILTERS = ['Near Me', 'Open Now', 'Low Crowd', 'Included in My Plan'];

export default function MemberHome() {
  const [filter, setFilter] = useState('');
  const bestMatch = mockGyms[0]; // Iron House

  return (
    <div className="anim-fade">
      {/* ── Greeting Banner ── */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: 'var(--sp-8) 0 var(--sp-6)' }}>
        <div className="container">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 4 }}>
                {GREETING}, {mockUser.firstName} 👋
              </h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>Where do you want to train today?</p>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '.45rem .875rem', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-full)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="var(--sg-green)" /> {mockUser.location} <ChevronRight size={13} />
            </button>
          </div>

          {/* Search */}
          <div className="input-group" style={{ position: 'relative', maxWidth: 680, marginBottom: 'var(--sp-4)' }}>
            <Search size={18} className="input-icon" />
            <input type="text" className="input search-bar input-with-icon" placeholder="Search gym, area or facility" />
            <div className="input-icon-right" style={{ right: 12 }}>
              <button style={{ background: 'var(--sg-charcoal)', border: 'none', borderRadius: 'var(--r-full)', padding: '6px 14px', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'white', cursor: 'pointer' }}>Search</button>
            </div>
          </div>

          {/* Quick filters */}
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {QUICK_FILTERS.map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f === filter ? '' : f)}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-12)' }}>

        {/* ── ROW 1: Best Match + Digital Pass ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>

          {/* Best Match */}
          <div>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Best match right now</h2>
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={11} /> 92% match
              </span>
            </div>

            <div className="card card-shadow" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr' }}>
                <div style={{ position: 'relative', height: 240 }}>
                  <img src={bestMatch.image} alt={bestMatch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(0,0,0,.4))' }} />
                </div>
                <div style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>{bestMatch.name}</h3>
                    <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {bestMatch.area}</span>
                      <span>·</span>
                      <span>{bestMatch.distance} km · {bestMatch.eta} min</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
                      <div style={{ padding: '10px 12px', background: 'var(--sg-green-light)', borderRadius: 'var(--r-md)', border: '1px solid var(--sg-green-muted)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--sg-green-active)', fontWeight: 600 }}>ACCESS</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)' }}>Included ✓</p>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>CROWD</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--status-success)' }}>Low · Great now</p>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>HOURS</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)' }}>Until {bestMatch.closesAt}</p>
                      </div>
                      <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>DISTANCE</p>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)' }}>{bestMatch.distance} km away</p>
                      </div>
                    </div>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--r-md)', margin: '0 0 var(--sp-5)' }}>
                      <strong>Why this gym?</strong> Close to your location, low crowd right now, and has your preferred strength equipment.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                    <Link to={`/member/gym/${bestMatch.id}`} className="btn btn-dark btn-lg" style={{ flex: 1 }}>View Gym</Link>
                    <button className="btn btn-secondary btn-lg">Directions</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Pass */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>My Silver GYM Pass</h2>
            <DigitalPassCard compact onOpen={() => window.location.href = '/member/pass'} />

            {/* Smart suggestion */}
            <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-xl)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 8, height: 8, background: 'var(--sg-green)', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>Good time to train</p>
                  <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    Iron House Fitness is 35% less crowded than usual right now.
                  </p>
                  <Link to={`/member/gym/${bestMatch.id}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--sg-green)', fontWeight: 600 }}>
                    View Gym →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Nearby Gyms ── */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Nearby gyms</h2>
            <Link to="/member/explore" className="btn btn-ghost btn-sm" style={{ gap: 5 }}>View all <ArrowRight size={14} /></Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
            {mockGyms.slice(0, 3).map(gym => <GymCardLarge key={gym.id} gym={gym} />)}
          </div>
        </div>

        {/* ── ROW 3: Activity + Membership ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>

          {/* Weekly Activity */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>Weekly activity</h2>
            <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>This Week</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 800 }}>4 <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', fontWeight: 400 }}>/ 5 goal</span></p>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Streak</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#F59E0B' }}>{mockUser.streak} 🔥</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Training Time</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 800 }}>4h 35m</p>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 80, gap: 8 }}>
                {weeklyData.map((d, i) => (
                  <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', height: d.min ? `${(d.min / 100) * 80}px` : 4, background: d.min ? 'var(--sg-green)' : 'var(--bg-muted)', borderRadius: '3px 3px 0 0', minHeight: 4, transition: 'height .3s' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Membership Usage */}
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>Membership usage</h2>
            <div className="card card-shadow" style={{ padding: 'var(--sp-6)', height: 'calc(100% - 50px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 'var(--text-lg)' }}>{mockUser.plan} Plan</p>
                  <span className="badge badge-green">Active</span>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Renews {mockUser.renewalDate}</p>
              </div>

              <div style={{ marginBottom: 'var(--sp-3)' }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Visits used</span>
                  <span style={{ fontWeight: 700 }}>{mockUser.visitsUsed} / {mockUser.visitsTotal}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(mockUser.visitsUsed / mockUser.visitsTotal) * 100}%` }} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>
                  {mockUser.visitsRemaining} visits remaining this month
                </p>
              </div>

              <Link to="/member/membership" className="btn btn-secondary btn-sm btn-full" style={{ marginTop: 'auto' }}>
                Manage Membership
              </Link>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Recent Activity ── */}
        <div>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Recent activity</h2>
            <Link to="/member/activity" className="btn btn-ghost btn-sm" style={{ gap: 5 }}>View all <ArrowRight size={14} /></Link>
          </div>

          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            {mockActivity.slice(0, 4).map((item, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', paddingBottom: i < 3 ? 'var(--sp-4)' : 0, marginBottom: i < 3 ? 'var(--sp-4)' : 0, borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ width: 40, height: 40, background: item.type === 'checkin' ? 'var(--sg-green-light)' : 'var(--status-warning-bg)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.type === 'checkin' ? '🏋️' : '🏆'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {item.type === 'checkin' ? `Checked in at ${item.gym}` : item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {item.date} · {item.time} {item.duration ? `· ${item.duration}` : ''}
                  </p>
                </div>
                {item.type === 'checkin' && (
                  <Link to={`/member/gym/${item.gymId}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 600 }}>View</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
