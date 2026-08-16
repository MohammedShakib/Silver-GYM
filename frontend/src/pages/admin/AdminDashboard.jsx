import { Link } from 'react-router-dom';
import { Users, Building, Activity, DollarSign, AlertCircle, UserCheck } from 'lucide-react';
import { adminData } from '../../services/mockData';

const TODAY_LABEL = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

function MetricCard({ icon: Icon, value, label, sub, color }) {
  return (
    <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
        <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        {sub && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-success)', fontWeight: 600 }}>{sub}</span>}
      </div>
      <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 900, lineHeight: 1 }}>{value}</p>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="anim-fade">
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <p className="eyebrow" style={{ marginBottom: 'var(--sp-2)' }}>Platform Administration</p>
        <h1 style={{ marginBottom: 4 }}>Overview</h1>
        <p>{TODAY_LABEL}</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
        <MetricCard icon={Users}      value={adminData.activeMembers.toLocaleString()} label="Active Members"        color="var(--status-info)"    sub="+12% vs last mo" />
        <MetricCard icon={Building}   value={adminData.partnerGyms}   label="Partner Gyms"           color="var(--sg-green)" />
        <MetricCard icon={Activity}   value={adminData.checkinsToday.toLocaleString()} label="Check-ins Today"  color="var(--status-warning)" />
        <MetricCard icon={DollarSign} value={`৳${(adminData.mrr / 1000000).toFixed(1)}M`} label="Monthly Recurring Revenue" color="var(--sg-charcoal)" sub="MRR" />
        <MetricCard icon={AlertCircle} value={adminData.pendingApplications} label="Pending Gym Applications" color="var(--status-warning)" />
        <MetricCard icon={UserCheck}   value={adminData.supportIssues}       label="Open Support Issues"      color="var(--status-error)" />
      </div>

      {/* Gym applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
            <h3>Pending Gym Applications</h3>
            <Link to="/admin/applications" className="btn btn-ghost btn-sm">View all</Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Gym Name', 'Area', 'Owner', 'Applied', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Titan Fitness', area: 'Badda',       owner: 'R. Hossain', date: '12 Aug', status: 'Reviewing' },
                { name: 'FlexZone',      area: 'Uttara',      owner: 'S. Akter',   date: '11 Aug', status: 'Pending' },
                { name: 'FitCore',       area: 'Mohammadpur', owner: 'M. Ali',     date: '09 Aug', status: 'Pending' },
              ].map((r, i) => (
                <tr key={r.name} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 ? 'var(--bg-subtle)' : 'transparent' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{r.area}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{r.owner}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{r.date}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--r-full)', background: r.status === 'Reviewing' ? 'var(--status-info-bg)' : 'var(--status-warning-bg)', color: r.status === 'Reviewing' ? 'var(--status-info)' : '#92400E' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <Link to="/admin/applications" className="btn btn-secondary btn-sm">Review</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            <h4 style={{ marginBottom: 'var(--sp-4)' }}>Platform Health</h4>
            {[
              { label: 'Uptime', value: '99.98%', color: 'var(--status-success)' },
              { label: 'Avg check-in time', value: '1.2s', color: 'var(--sg-green)' },
              { label: 'Active gyms today', value: '98 / 124', color: 'var(--text-primary)' },
              { label: 'Payout pending', value: '৳842K', color: 'var(--status-warning)' },
            ].map(r => (
              <div key={r.label} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--sg-charcoal)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', color: 'white' }}>
            <h4 style={{ color: 'white', marginBottom: 8 }}>Revenue Growth</h4>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)' }}>Monthly recurring revenue</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, color: 'var(--sg-green)', margin: 0 }}>৳4.2M</p>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginTop: 4 }}>+18% vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
