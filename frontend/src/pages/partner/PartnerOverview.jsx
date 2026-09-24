import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../../components/ui/Skeleton';
import { Users, UserCheck, DollarSign, Star, Clock } from 'lucide-react';

export default function PartnerOverview() {
  const { selectedGym } = usePartnerGym();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadOverview = async () => {
      try {
        const res = await partnerApi.getOverview(selectedGym.id);
        if (active) setData(res);
      } catch (err) {
        console.error('Failed to load overview', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    setLoading(true);
    loadOverview();

    // Poll every 30 seconds for live updates
    const interval = setInterval(loadOverview, 30000);
    
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedGym.id]);

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Failed to load overview data.</div>;

  const { metrics, recentCheckIns } = data;

  const kpis = [
    { label: "Today's Check-Ins", value: metrics.checkInsToday, icon: <UserCheck size={24} color="#22c55e" /> },
    { label: "Active Recently (2h)", value: metrics.recentVisitors, icon: <Clock size={24} color="#3b82f6" /> },
    { label: "Unique Members This Month", value: metrics.uniqueMembersThisMonth, icon: <Users size={24} color="#a855f7" /> },
    { label: "Estimated Revenue This Month", value: `৳${metrics.estimatedRevenueThisMonth.toLocaleString()}`, icon: <DollarSign size={24} color="#f59e0b" /> },
    { label: "Average Rating", value: metrics.averageRating.toFixed(1), icon: <Star size={24} color="#eab308" /> },
  ];

  return (
    <div className="anim-fade" style={{ maxWidth: 1200 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Good morning, {selectedGym.name}</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Here's what's happening today.</p>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 40 }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ color: '#8B949E', fontSize: 13, fontWeight: 600 }}>{kpi.label}</span>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 8 }}>
                {kpi.icon}
              </div>
            </div>
            <div style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        {/* Recent Check-Ins */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #30363D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Recent Verified Check-Ins</h3>
            <span style={{ color: '#8B949E', fontSize: 13 }}>Live Updates (30s)</span>
          </div>
          <div style={{ padding: 0 }}>
            {recentCheckIns.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#8B949E' }}>No check-ins today.</div>
            ) : (
              recentCheckIns.map(ci => (
                <div key={ci.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img 
                      src={ci.member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(ci.member.name)}&background=30363D&color=fff`} 
                      alt={ci.member.name}
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{ci.member.name}</div>
                      <div style={{ color: '#8B949E', fontSize: 12 }}>{ci.membership.plan.name} Plan</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'white', fontSize: 14 }}>{new Date(ci.checkedInAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 600 }}>Verified ✓</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Operational Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>Current Crowd</h3>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                {selectedGym.crowdOverrideLevel ? selectedGym.crowdOverrideLevel.toUpperCase() : selectedGym.crowd.toUpperCase()}
              </span>
              <span style={{ color: '#8B949E', marginBottom: 4 }}>
                {selectedGym.crowdOverrideLevel ? '(Manual Override)' : '(Auto)'}
              </span>
            </div>
            
            <p style={{ color: '#8B949E', fontSize: 14, margin: '0 0 20px 0' }}>
              Capacity: {selectedGym.capacity ? `${selectedGym.capacity} max` : 'Not set'}
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Update</button>
            </div>
          </div>

          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>Open Scanner</button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>Edit Hours</button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>Manage Staff</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
