import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockActivity, weeklyData, rewards, mockGyms, mockUser } from '../../services/mockData';
import { Trophy, Flame, Dumbbell, Clock, MapPin, ChevronRight } from 'lucide-react';

const TABS = ['History', 'Rewards'];
const PERIODS = ['Week', 'Month', '3 Months', 'Year'];

function CalendarHeatmap() {
  // Build a simple 5-week display (35 days)
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (34 - i));
    const hasWorkout = [0, 2, 5, 6, 8, 10, 11, 14, 17, 20, 23].includes(i);
    return { date: d.getDate(), hasWorkout, isToday: i === 34 };
  });
  const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {WEEK_LABELS.map((l, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', paddingBottom: 4 }}>{l}</div>
        ))}
        {days.map((d, i) => (
          <div key={i} style={{
            width: '100%', aspectRatio: '1', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: d.isToday ? 'var(--sg-charcoal)' : d.hasWorkout ? 'var(--sg-green)' : 'var(--bg-muted)',
            color: d.isToday ? 'white' : d.hasWorkout ? 'white' : 'var(--text-muted)',
            fontSize: 11, fontWeight: d.isToday || d.hasWorkout ? 700 : 400,
            cursor: 'pointer',
            boxShadow: d.isToday ? '0 0 0 2px var(--sg-charcoal), 0 0 0 3px var(--border-default)' : 'none',
          }}>
            {d.date}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: 'var(--sg-green)', borderRadius: 2 }} /> Workout day
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: 'var(--sg-charcoal)', borderRadius: 2 }} /> Today
        </div>
      </div>
    </div>
  );
}

export default function Activity() {
  const [tab, setTab] = useState('History');
  const [period, setPeriod] = useState('Month');

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Your Activity</h1>
          <p style={{ margin: 0 }}>See how consistent you've been.</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`filter-chip ${period === p ? 'active' : ''}`} style={{ fontSize: 12 }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Hero KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
        {[
          { icon: Dumbbell, value: '12', label: 'Workouts', color: 'var(--sg-green)' },
          { icon: Flame,    value: `${mockUser.streak} days`, label: 'Current Streak', color: '#F59E0B' },
          { icon: MapPin,   value: '4', label: 'Gyms Explored', color: 'var(--status-info)' },
          { icon: Clock,    value: '12h 40m', label: 'Training Time', color: 'var(--sg-charcoal)' },
        ].map(m => (
          <div key={m.label} className="stat-card card-shadow">
            <div style={{ width: 40, height: 40, background: `${m.color}15`, borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-3)' }}>
              <m.icon size={20} color={m.color} />
            </div>
            <div className="stat-value">{m.value}</div>
            <div className="stat-label">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar Heatmap */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Workout Calendar</h2>
        <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
          <CalendarHeatmap />
        </div>
      </div>

      {/* Weekly Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Weekly trend</h2>
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 100, gap: 10 }}>
              {weeklyData.map(d => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.min > 0 ? `${d.min}m` : ''}</span>
                  <div style={{ width: '100%', height: d.min ? `${(d.min / 100) * 80}%` : 4, background: d.min ? 'var(--sg-green)' : 'var(--bg-muted)', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gyms Visited */}
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Gyms you've visited</h2>
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            {[{ gym: mockGyms[0], visits: 6 }, { gym: mockGyms[1], visits: 3 }, { gym: mockGyms[3], visits: 2 }].map(({ gym, visits }) => (
              <Link key={gym.id} to={`/member/gym/${gym.id}`} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none' }}>
                <img src={gym.image} alt={gym.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{gym.name}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{gym.area}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>{visits}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>visits</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: History / Rewards */}
      <div className="tabs" style={{ marginBottom: 'var(--sp-6)' }}>
        {TABS.map(t => <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {/* Workout History */}
      {tab === 'History' && (
        <div className="anim-fade">
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Workout history</h2>
          {mockActivity.map((item, i) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot">
                {item.type === 'checkin' ? '🏋️' : '🏆'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 700 }}>
                      {item.type === 'checkin' ? item.gym : item.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                      {item.date} · {item.time} {item.duration ? `· ${item.duration}` : ''}
                    </p>
                  </div>
                  {item.type === 'checkin' && (
                    <Link to={`/member/gym/${item.gymId}`} style={{ color: 'var(--sg-green)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>View gym</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards */}
      {tab === 'Rewards' && (
        <div className="anim-fade">
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--sp-5)' }}>Achievements</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-5)' }}>
            {rewards.map(r => (
              <div key={r.id} className="card card-shadow" style={{ padding: 'var(--sp-5)', border: r.achieved ? '1.5px solid var(--sg-green)' : '1px solid var(--border-subtle)', background: r.achieved ? 'var(--sg-green-light)' : 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, background: r.achieved ? 'var(--sg-green)' : 'var(--bg-muted)', borderRadius: 'var(--r-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: r.achieved ? 'var(--shadow-green)' : 'none' }}>
                    {r.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: 4 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-lg)' }}>{r.title}</p>
                      {r.achieved && <span className="badge badge-green" style={{ fontSize: 9 }}>ACHIEVED</span>}
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{r.desc}</p>
                    {!r.achieved && (
                      <>
                        <div className="progress-track" style={{ marginBottom: 4 }}>
                          <div className="progress-fill" style={{ width: `${(r.progress / r.goal) * 100}%` }} />
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{r.progress} / {r.goal}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
