import { Link } from 'react-router-dom'
import { CreditCard, Heart, MapPin, QrCode, Sparkles } from 'lucide-react'
import { mockActivity, mockUser } from '../../services/mockData'
import { useSavedGyms } from '../../hooks/useSavedGyms'

export default function Profile() {
  const { savedGymIds } = useSavedGyms()
  const totalMinutes = mockActivity
    .filter((item) => item.duration)
    .reduce((sum, item) => {
      const [hoursPart, minutesPart] = item.duration.split(' ')
      const hours = hoursPart?.includes('h') ? Number.parseInt(hoursPart, 10) * 60 : 0
      const minutes = minutesPart ? Number.parseInt(minutesPart, 10) : 0
      return sum + hours + minutes
    }, 0)

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>
      <div className="card card-shadow" style={{ padding: 'var(--sp-8)', marginBottom: 'var(--sp-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            style={{
              width: 92,
              height: 92,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--sg-green-muted)',
            }}
          />

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-green">Active Member</span>
              <span className="badge badge-neutral">ID {mockUser.id}</span>
            </div>
            <h1 style={{ marginBottom: 4 }}>{mockUser.name}</h1>
            <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}>
              {mockUser.plan} Plan • Member since {mockUser.memberSince}
            </p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
              <MapPin size={15} color="var(--sg-green)" />
              {mockUser.location}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-5)', marginBottom: 'var(--sp-8)' }}>
        {[
          { label: 'Current plan', value: mockUser.plan, icon: CreditCard, color: 'var(--sg-green)' },
          { label: 'Visits left', value: `${mockUser.visitsRemaining}`, icon: QrCode, color: 'var(--status-info)' },
          { label: 'Saved gyms', value: `${savedGymIds.length}`, icon: Heart, color: 'var(--status-error)' },
          { label: 'Minutes trained', value: `${totalMinutes}`, icon: Sparkles, color: 'var(--status-warning)' },
        ].map((item) => (
          <div key={item.label} className="stat-card card-shadow">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--r-lg)',
                background: `${item.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--sp-3)',
              }}
            >
              <item.icon size={20} color={item.color} />
            </div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }}>
        <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
          <h2 style={{ marginBottom: 'var(--sp-4)' }}>Quick actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <Link to="/member/pass" className="btn btn-primary btn-full">
              Open My Pass
            </Link>
            <Link to="/member/membership" className="btn btn-secondary btn-full">
              Manage Membership
            </Link>
            <Link to="/member/activity" className="btn btn-secondary btn-full">
              Review Activity
            </Link>
          </div>
        </div>

        <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
          <h2 style={{ marginBottom: 'var(--sp-4)' }}>Account status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {[
              { label: 'Membership', value: 'Active' },
              { label: 'Renewal date', value: mockUser.renewalDate },
              { label: 'Current streak', value: `${mockUser.streak} days` },
              { label: 'Favorite areas', value: 'Mirpur, Banani' },
            ].map((row) => (
              <div key={row.label} className="flex-between">
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
