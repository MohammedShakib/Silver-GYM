import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockActivity, weeklyData, rewards, mockGyms, mockUser } from '../../services/mockData';
import { Flame, Dumbbell, Clock, MapPin, ChevronLeft, ChevronRight, CheckCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

const TABS = ['History', 'Rewards'];
const PERIODS = ['Week', 'Month', '3 Months', 'Year'];

function CalendarHeatmap() {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  // Build a 5-week display (35 days)
  const today = new Date();
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (34 - i));
    const hasWorkout = [0, 2, 5, 6, 8, 10, 11, 14, 17, 20, 23, 27, 30].includes(i);
    return { date: d.getDate(), hasWorkout, isToday: i === 34 };
  });
  const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      {/* Month header & controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {currentMonth}
        </h3>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            style={{ width: 28, height: 28, padding: 0 }}
            title="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            style={{ width: 28, height: 28, padding: 0 }}
            title="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 'var(--sp-4)' }}>
        {WEEK_LABELS.map((label) => (
          <div key={label} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', paddingBottom: 4 }}>
            {label}
          </div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--r-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: d.isToday ? 'var(--sg-charcoal)' : d.hasWorkout ? 'var(--sg-green-light)' : 'var(--bg-subtle)',
              border: d.isToday
                ? '2px solid var(--sg-charcoal)'
                : d.hasWorkout
                ? '1px solid rgba(32, 200, 99, 0.4)'
                : '1px solid var(--border-subtle)',
              color: d.isToday ? 'white' : d.hasWorkout ? 'var(--sg-green-active)' : 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: d.isToday || d.hasWorkout ? 800 : 500,
              cursor: 'pointer',
              transition: 'transform .15s ease',
              position: 'relative',
            }}
          >
            <span>{d.date}</span>
            {d.hasWorkout && !d.isToday && (
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--sg-green)', marginTop: 2 }} />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, background: 'var(--sg-green-light)', border: '1px solid var(--sg-green)', borderRadius: 3 }} />
          <span>Workout completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, background: 'var(--sg-charcoal)', borderRadius: 3 }} />
          <span>Today</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 3 }} />
          <span>Rest day</span>
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
      <PageHeader
        title="Your Activity"
        subtitle="See how consistent you've been and track your progress across all partner gyms."
      >
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', padding: 3, borderRadius: 'var(--r-full)', border: '1px solid var(--border-subtle)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`filter-chip ${period === p ? 'active' : ''}`}
              style={{
                fontSize: 11,
                padding: '0.3rem 0.75rem',
                border: 'none',
                background: period === p ? 'var(--sg-green)' : 'transparent',
                color: period === p ? 'white' : 'var(--text-secondary)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* 4 Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {[
          { icon: Dumbbell, value: '12', label: 'Workouts Logged', sub: 'Target: 15 / month', color: 'var(--sg-green)' },
          { icon: Flame,    value: `${mockUser.streak} days`, label: 'Current Streak', sub: 'Personal best: 8 days', color: '#F59E0B' },
          { icon: MapPin,   value: '4', label: 'Gyms Explored', sub: 'In Mirpur & Banani', color: 'var(--status-info)' },
          { icon: Clock,    value: '12h 40m', label: 'Training Time', sub: 'Avg. 63m / session', color: 'var(--sg-charcoal)' },
        ].map(m => (
          <div key={m.label} className="stat-card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
              <div style={{ width: 40, height: 40, background: `${m.color}15`, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={19} color={m.color} strokeWidth={2.2} />
              </div>
              <span className="badge badge-neutral" style={{ fontSize: 10 }}>{period}</span>
            </div>
            <div className="stat-value" style={{ fontSize: 'var(--text-3xl)', marginBottom: 2 }}>{m.value}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Main 65/35 Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)', alignItems: 'stretch' }} className="activity-main-grid">
        
        {/* Left column: Calendar & Weekly Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {/* Calendar */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Workout Calendar</h2>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Track your attendance consistency</p>
              </div>
              <span className="badge badge-green" style={{ fontWeight: 700 }}>12 Days Active</span>
            </div>
            <CalendarHeatmap />
          </div>

          {/* Weekly Trend Chart */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Weekly training volume</h2>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Minutes trained per day</p>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Total: 275 mins</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', height: 110, gap: 12, paddingTop: 'var(--sp-4)' }}>
              {weeklyData.map(d => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: d.min > 0 ? 'var(--sg-green-active)' : 'var(--text-muted)' }}>
                    {d.min > 0 ? `${d.min}m` : '—'}
                  </span>
                  <div
                    title={`${d.day}: ${d.min} mins`}
                    style={{
                      width: '100%',
                      height: d.min ? `${Math.max(16, (d.min / 90) * 80)}px` : 6,
                      background: d.min ? 'var(--sg-green)' : 'var(--bg-muted)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 6,
                      transition: 'height .3s ease',
                    }}
                  />
                  <span style={{ fontSize: 11, color: d.min ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Highlights & Gyms Visited */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {/* Consistency highlight card */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)', background: 'linear-gradient(145deg, #101722 0%, #171D26 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-3)' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(32, 200, 99, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="var(--sg-green)" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-sm)', color: 'white' }}>Consistency Insight</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--sg-silver)' }}>Based on your last 30 days</p>
              </div>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-silver-light)', margin: '0 0 var(--sp-4)', lineHeight: 1.5 }}>
              You workout most consistently on <strong>Monday & Wednesday mornings</strong> at Iron House Fitness.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--sg-silver)', margin: '0 0 2px', textTransform: 'uppercase' }}>Monthly Goal Progress</p>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'white', margin: 0 }}>12 / 15 workouts (80%)</p>
              </div>
              <span className="badge badge-green" style={{ fontSize: 10 }}>On Track</span>
            </div>
          </div>

          {/* Gyms Visited */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-3)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Gyms you've visited</h3>
              <Link to="/member/explore" style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700 }}>Explore more →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {[
                { gym: mockGyms[0], visits: 6, tag: 'Most Visited' },
                { gym: mockGyms[1], visits: 3, tag: null },
                { gym: mockGyms[3], visits: 2, tag: null },
                { gym: mockGyms[2], visits: 1, tag: null },
              ].map(({ gym, visits, tag }) => (
                <Link
                  key={gym.id}
                  to={`/member/gym/${gym.id}`}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    textDecoration: 'none',
                    transition: 'all .15s ease',
                  }}
                  className="card-hover"
                >
                  <img src={gym.image} alt={gym.name} style={{ width: 44, height: 44, borderRadius: 'var(--r-sm)', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {gym.name}
                      </p>
                      {tag && <span className="badge badge-green" style={{ fontSize: 9, padding: '1px 5px' }}>{tag}</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{gym.area}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{visits}</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>visits</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Workout History & Rewards */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <div className="tabs" style={{ marginBottom: 'var(--sp-6)' }}>
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'History' ? 'Workout History' : 'Achievements & Rewards'}
            </button>
          ))}
        </div>

        {/* Tab 1: Workout History */}
        {tab === 'History' && (
          <div className="anim-fade">
            <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
              {mockActivity.map((item, idx, arr) => (
                <div key={item.id} className="timeline-item" style={{ paddingBottom: idx < arr.length - 1 ? 'var(--sp-5)' : 0 }}>
                  <div className="timeline-dot">
                    {item.type === 'checkin' ? <Dumbbell size={18} strokeWidth={2.2} /> : <Trophy size={18} strokeWidth={2.2} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {item.type === 'checkin' ? `Checked in at ${item.gym}` : item.title}
                        </p>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {item.date} · {item.time} {item.duration ? `· ${item.duration} duration` : ''}
                        </p>
                      </div>
                      {item.type === 'checkin' && (
                        <Link
                          to={`/member/gym/${item.gymId}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: 'var(--text-xs)', gap: 4 }}
                        >
                          <span>View Gym</span> <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Rewards */}
        {tab === 'Rewards' && (
          <div className="anim-fade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-5)' }}>
              {rewards.map(r => (
                <div
                  key={r.id}
                  className="card card-shadow"
                  style={{
                    padding: 'var(--sp-5)',
                    border: r.achieved ? '1.5px solid var(--sg-green)' : '1px solid var(--border-subtle)',
                    background: r.achieved ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: r.achieved ? 'var(--sg-green)' : 'var(--bg-muted)',
                        color: r.achieved ? 'white' : 'var(--text-secondary)',
                        borderRadius: 'var(--r-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        flexShrink: 0,
                        boxShadow: r.achieved ? 'var(--shadow-green)' : 'none',
                      }}
                    >
                      {r.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex-between" style={{ marginBottom: 4 }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>{r.title}</p>
                        {r.achieved && <span className="badge badge-green" style={{ fontSize: 9, fontWeight: 800 }}>UNLOCKED</span>}
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{r.desc}</p>
                      {!r.achieved && (
                        <div>
                          <div className="progress-track" style={{ height: 5, marginBottom: 4 }}>
                            <div className="progress-fill" style={{ width: `${(r.progress / r.goal) * 100}%` }} />
                          </div>
                          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)' }}>
                            {r.progress} / {r.goal} completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

