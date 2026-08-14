import { useState } from 'react';
import { Target, Flame, Calendar as CalendarIcon, Map, Award, Clock } from 'lucide-react';
import { mockActivity } from '../../services/mockData';
import Card from '../../components/ui/Card';

export default function Activity() {
  const [activeTab, setActiveTab] = useState('history'); // history, rewards

  return (
    <div className="container animate-fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      <h1 style={{ marginBottom: 'var(--space-8)' }}>Your Activity</h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <Target size={18} /> Workouts this month
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800 }}>12</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/ 15 goal</span>
          </div>
        </Card>
        
        <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <Flame size={18} color="#F59F00" /> Current streak
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#F59F00' }}>4</span>
            <span style={{ color: 'var(--color-text-muted)' }}>days</span>
          </div>
        </Card>

        <Card style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
            <Map size={18} /> Gyms explored
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800 }}>5</span>
            <span style={{ color: 'var(--color-text-muted)' }}>total</span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: 'var(--space-8)' }}>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ padding: '0 0 12px 0', border: 'none', background: 'none', fontWeight: activeTab === 'history' ? 700 : 500, color: activeTab === 'history' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'history' ? '3px solid var(--color-brand-primary)' : '3px solid transparent', cursor: 'pointer' }}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          style={{ padding: '0 0 12px 0', border: 'none', background: 'none', fontWeight: activeTab === 'rewards' ? 700 : 500, color: activeTab === 'rewards' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'rewards' ? '3px solid var(--color-brand-primary)' : '3px solid transparent', cursor: 'pointer' }}
        >
          Rewards & Badges
        </button>
      </div>

      {activeTab === 'history' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)', '@media(min-width: 768px)': { gridTemplateColumns: '2fr 1fr' } }}>
          <div>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Recent Workouts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {mockActivity.map(activity => (
                <Card key={activity.id} style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon size={24} color="var(--color-brand-primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{activity.gym || activity.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>{activity.date}</p>
                  </div>
                  {activity.type === 'workout' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
                      <Clock size={16} color="var(--color-text-muted)" /> 1h 15m
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            
            <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', border: '2px solid var(--color-brand-primary)', backgroundColor: 'var(--color-brand-primary-light)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-brand-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(25, 195, 106, 0.3)' }}>
                <Award size={32} color="white" />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Consistent</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>12 workouts this month</p>
                <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-brand-primary)' }}>ACHIEVED</div>
              </div>
            </Card>

            <Card style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Map size={32} color="var(--color-text-muted)" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>Explorer</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Visit 10 different gyms</p>
                <div style={{ marginTop: '12px', height: '6px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', backgroundColor: 'var(--color-brand-primary)' }}></div>
                </div>
                <div style={{ fontSize: '12px', textAlign: 'right', marginTop: '4px', color: 'var(--color-text-muted)' }}>5 / 10</div>
              </div>
            </Card>
            
          </div>
        </div>
      )}
    </div>
  );
}
