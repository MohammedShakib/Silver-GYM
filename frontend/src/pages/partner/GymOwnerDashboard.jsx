import { Link } from 'react-router-dom';
import { CheckCircle, ScanLine, Users, BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { ownerData } from '../../services/mockData';

const TODAY_LABEL = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

function KpiCard({ icon: Icon, value, label, color }) {
  return (
    <div className="card card-shadow" style={{ padding: 'var(--sp-6)', display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ width: 48, height: 48, background: `${color}18`, borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 900, lineHeight: 1 }}>{value}</p>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function GymOwnerDashboard() {
  return (
    <div className="anim-fade">
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 'var(--sp-2)' }}>Partner Dashboard</p>
          <h1 style={{ marginBottom: 4 }}>Good morning, Iron House.</h1>
          <p style={{ margin: 0 }}>{TODAY_LABEL}</p>
        </div>
        <Link to="/partner/reception" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
          <ScanLine size={18} /> Open Reception Mode
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
        <KpiCard icon={ScanLine}    value={ownerData.todayCheckins} label="Check-ins today"     color="var(--sg-green)" />
        <KpiCard icon={Users}       value={ownerData.currentVisitors} label="Currently inside"  color="var(--status-info)" />
        <KpiCard icon={BarChart3}   value={ownerData.monthlyVisits}   label="Monthly visits"    color="var(--status-warning)" />
        <KpiCard icon={DollarSign}  value={`৳${ownerData.estimatedPayout.toLocaleString()}`} label="Est. payout" color="var(--sg-charcoal)" />
        <KpiCard icon={TrendingUp}  value={`${ownerData.avgRating}★`} label="Avg member rating" color="#7C3AED" />
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-6)' }}>

        {/* Live check-ins */}
        <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
            <h3>Live Check-Ins</h3>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, background: 'var(--sg-green)', borderRadius: '50%', animation: 'pulse 1.5s ease infinite' }} /> Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {ownerData.recentCheckins.map((c, i) => (
              <div key={i} className="flex-between" style={{ padding: 'var(--sp-4)', background: 'var(--bg-subtle)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--sg-green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--sg-green-active)' }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{c.time} · {c.plan}</p>
                  </div>
                </div>
                <span className="badge badge-green" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <CheckCircle size={11} /> Approved
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          {/* Live capacity */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Live Capacity</h3>
            <div style={{ marginBottom: 'var(--sp-3)' }}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Currently inside</span>
                <span style={{ fontWeight: 800, fontSize: 'var(--text-xl)' }}>18</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '36%', background: 'var(--sg-green)' }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>36% capacity · Low crowd</p>
            </div>
          </div>

          {/* Reception mode CTA */}
          <div style={{ background: 'var(--sg-charcoal)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-6)', textAlign: 'center', color: 'white' }}>
            <ScanLine size={40} color="var(--sg-green)" style={{ margin: '0 auto var(--sp-4)' }} />
            <h4 style={{ color: 'white', marginBottom: 8 }}>Reception Mode</h4>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-5)' }}>
              Tablet-optimized scanner for fast member check-in.
            </p>
            <Link to="/partner/reception" className="btn btn-primary btn-full">Open Scanner</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
