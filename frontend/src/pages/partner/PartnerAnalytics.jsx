import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';

export default function PartnerAnalytics() {
  const { selectedGym } = usePartnerGym();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getAnalytics(selectedGym.id, days);
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [selectedGym.id, days]);

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Failed to load analytics.</div>;

  const { peakHours, membershipMix, dailyVisits, totalVisitsPeriod } = data;

  // Max calculation for bar heights
  const maxPeak = Math.max(...peakHours, 1);
  const maxVisits = Math.max(...dailyVisits.map(d => d.count), 1);
  const totalMix = Object.values(membershipMix).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="anim-fade" style={{ maxWidth: 1200 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Gym Analytics</h1>
          <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Operational insights and visit trends</p>
        </div>
        <select 
          value={days} 
          onChange={e => setDays(Number(e.target.value))}
          style={{ background: '#21262D', color: 'white', border: '1px solid #30363D', padding: '10px 16px', borderRadius: 8 }}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* Total Visits Card */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 8px 0', fontWeight: 600 }}>Total Visits ({days} Days)</h3>
          <div style={{ color: 'white', fontSize: 36, fontWeight: 700 }}>{totalVisitsPeriod}</div>
          <div style={{ color: '#22c55e', fontSize: 14, fontWeight: 600, marginTop: 8 }}>+ Verified check-ins only</div>
        </div>

        {/* Member Mix Card */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 16px 0', fontWeight: 600 }}>Membership Mix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(membershipMix).map(([plan, count]) => (
              <div key={plan}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
                  <span style={{ color: 'white' }}>{plan}</span>
                  <span style={{ color: '#8B949E' }}>{Math.round((count / totalMix) * 100)}%</span>
                </div>
                <div style={{ height: 6, background: '#30363D', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#22c55e', width: `${(count / totalMix) * 100}%` }} />
                </div>
              </div>
            ))}
            {Object.keys(membershipMix).length === 0 && (
              <div style={{ color: '#8B949E', fontSize: 14 }}>No data available</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {/* Peak Hours Bar Chart */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'white', margin: '0 0 24px 0' }}>Peak Hours Overview</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200, paddingBottom: 24, borderBottom: '1px solid #30363D', overflowX: 'auto' }}>
            {peakHours.map((count, hour) => {
              const heightPct = (count / maxPeak) * 100;
              return (
                <div key={hour} style={{ flex: 1, minWidth: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ 
                      width: '80%', 
                      height: `${heightPct}%`, 
                      background: heightPct > 80 ? '#ef4444' : heightPct > 40 ? '#f59e0b' : '#3b82f6',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }} title={`${count} visits`} />
                  </div>
                  <span style={{ color: '#8B949E', fontSize: 10 }}>{hour}h</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Trend */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: 'white', margin: '0 0 24px 0' }}>Daily Visits Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200, paddingBottom: 24, borderBottom: '1px solid #30363D', overflowX: 'auto' }}>
            {dailyVisits.length === 0 ? (
              <div style={{ width: '100%', textAlign: 'center', color: '#8B949E', alignSelf: 'center' }}>No visits in this period</div>
            ) : (
              dailyVisits.map((d, i) => {
                const heightPct = (d.count / maxVisits) * 100;
                return (
                  <div key={d.date} style={{ flex: 1, minWidth: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ 
                        width: '100%', 
                        height: `${heightPct}%`, 
                        background: '#22c55e',
                        borderRadius: '2px 2px 0 0'
                      }} title={`${d.date}: ${d.count} visits`} />
                    </div>
                    {/* Only show every Nth date label to avoid crowding */}
                    <span style={{ color: '#8B949E', fontSize: 10, visibility: (dailyVisits.length > 14 && i % Math.ceil(dailyVisits.length / 10) !== 0) ? 'hidden' : 'visible' }}>
                      {d.date.split('-').slice(1).join('/')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
