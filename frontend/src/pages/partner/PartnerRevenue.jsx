import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';
import { DollarSign, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function PartnerRevenue() {
  const { selectedGym } = usePartnerGym();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getRevenue(selectedGym.id);
        setData(res);
      } catch (err) {
        console.error('Failed to load revenue', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevenue();
  }, [selectedGym.id]);

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Failed to load revenue data.</div>;

  const { ratePerVisit, thisMonth, lastMonth } = data;

  const getTrend = (current, previous) => {
    if (previous === 0) return { pct: 100, isUp: true };
    const diff = current - previous;
    const pct = (diff / previous) * 100;
    return { pct: Math.abs(pct).toFixed(1), isUp: diff >= 0 };
  };

  const revenueTrend = getTrend(thisMonth.estimatedEarnings, lastMonth.estimatedEarnings);
  const visitTrend = getTrend(thisMonth.verifiedVisits, lastMonth.verifiedVisits);

  return (
    <div className="anim-fade" style={{ maxWidth: 1200 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Revenue Estimate</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Track your gym's estimated earnings based on verified Silver GYM member visits.</p>
      </header>

      <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 16, marginBottom: 32, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Info color="#3b82f6" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h4 style={{ color: '#bfdbfe', margin: '0 0 4px 0', fontSize: 14 }}>Estimated Earnings Only</h4>
          <p style={{ color: '#93c5fd', margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            These values represent estimated gross earnings based on your current access tier rate of <strong>৳{ratePerVisit} per visit</strong>. Final settlement statements are processed monthly and will be available in the Payouts tab (coming soon).
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
        
        {/* This Month Estimate */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 4px 0', fontWeight: 600 }}>This Month (Estimated)</h3>
              <div style={{ color: 'white', fontSize: 40, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={32} color="#f59e0b" />
                {thisMonth.estimatedEarnings.toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: revenueTrend.isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: revenueTrend.isUp ? '#22c55e' : '#ef4444', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
              {revenueTrend.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {revenueTrend.pct}%
            </div>
          </div>
          
          <div style={{ paddingTop: 16, borderTop: '1px solid #30363D', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8B949E', fontSize: 14 }}>Verified Visits</span>
            <span style={{ color: 'white', fontWeight: 600 }}>{thisMonth.verifiedVisits} visits</span>
          </div>
        </div>

        {/* Last Month Actuals */}
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24, opacity: 0.8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 4px 0', fontWeight: 600 }}>Last Month</h3>
              <div style={{ color: 'white', fontSize: 32, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={24} color="#8B949E" />
                {lastMonth.estimatedEarnings.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style={{ paddingTop: 16, borderTop: '1px solid #30363D', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8B949E', fontSize: 14 }}>Verified Visits</span>
            <span style={{ color: 'white', fontWeight: 600 }}>{lastMonth.verifiedVisits} visits</span>
          </div>
          <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8B949E', fontSize: 14 }}>Status</span>
            <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: 14 }}>Pending Settlement</span>
          </div>
        </div>

      </div>

    </div>
  );
}
