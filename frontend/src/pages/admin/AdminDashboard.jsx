import Card from '../../components/ui/Card';
import { Users, Building, Activity, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: 'var(--space-8)' }}>Admin Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Active Members</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>12,450</span>
          </div>
        </Card>
        
        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-brand-primary-light)', color: 'var(--color-brand-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Partner Gyms</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>124</span>
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Check-ins Today</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>1,892</span>
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>MRR</span>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>৳4.2M</span>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        <Card style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Pending Gym Applications</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Gym Name</th>
                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Area</th>
                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Applied Date</th>
                <th style={{ padding: '12px 0', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '16px 0', fontWeight: 500 }}>Titan Fitness</td>
                <td style={{ padding: '16px 0', color: 'var(--color-text-secondary)' }}>Badda</td>
                <td style={{ padding: '16px 0', color: 'var(--color-text-secondary)' }}>12 Aug 2026</td>
                <td style={{ padding: '16px 0' }}><span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Reviewing</span></td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
