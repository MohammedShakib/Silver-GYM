import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Users, ScanLine, DollarSign } from 'lucide-react';

export default function GymOwnerDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: 'var(--space-2)' }}>Good morning, Iron House Fitness</h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>Today at a glance</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-brand-primary-light)', color: 'var(--color-brand-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ScanLine size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Check-ins today</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>42</span>
          </div>
        </Card>
        
        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Active visitors</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>18</span>
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Est. Earnings (Today)</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>৳4,200</span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <Card style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Live Check-Ins</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Alex Rahman', time: '7:14 PM', plan: 'Active Plan', status: 'Approved' },
              { name: 'Nadia Islam', time: '7:09 PM', plan: 'Unlimited', status: 'Approved' },
              { name: 'Tahmid Hasan', time: '6:58 PM', plan: 'Essential', status: 'Approved' }
            ].map((checkin, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < 2 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{checkin.name.charAt(0)}</div>
                  <div>
                    <span style={{ display: 'block', fontWeight: 600 }}>{checkin.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{checkin.time} • {checkin.plan}</span>
                  </div>
                </div>
                <Badge variant="success">{checkin.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-brand-primary)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <ScanLine size={48} style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Receptionist Mode</h3>
          <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '24px' }}>Scan member QR codes directly from this device.</p>
          <button style={{ padding: '12px 24px', backgroundColor: 'white', color: 'var(--color-brand-primary)', border: 'none', borderRadius: 'var(--radius-full)', fontWeight: 700, cursor: 'pointer' }}>
            Open Scanner
          </button>
        </Card>
      </div>
    </div>
  );
}
