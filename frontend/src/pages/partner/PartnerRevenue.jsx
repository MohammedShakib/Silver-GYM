import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';

export default function PartnerRevenue() {
  const { selectedGym } = usePartnerGym();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [revenueRes, settlementsRes] = await Promise.all([
          partnerApi.getRevenue(selectedGym.id),
          partnerApi.getSettlements(selectedGym.id)
        ]);
        setData(revenueRes);
        setSettlements(settlementsRes.settlements);
      } catch (err) {
        console.error('Failed to load revenue', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedGym.id]);

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Failed to load revenue data.</div>;

  const { thisMonth } = data;
  const formatMoney = (amount) => `৳${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  return (
    <div className="anim-fade" style={{ maxWidth: 1200 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Revenue & Settlements</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Track your ongoing earnings and view official payout settlements.</p>
      </header>

      {/* Current Month Estimated */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 16px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} /> Current Month Estimate
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <div style={{ color: 'white', fontSize: 48, fontWeight: 700 }}>
              {formatMoney(thisMonth.estimatedEarnings)}
            </div>
            <div style={{ color: '#8B949E', fontSize: 14, marginTop: 8 }}>
              Based on {thisMonth.verifiedVisits} verified visits this month. Rate: {formatMoney(data.ratePerVisit)}/visit.
            </div>
          </div>
        </div>
      </div>

      {/* Official Settlements */}
      <h2 style={{ color: 'white', fontSize: 20, marginBottom: 16 }}>Official Settlements</h2>
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363D', color: '#8B949E', background: '#0D1117' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Period</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Reference</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Net Payable</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map(s => (
              <tr 
                key={s.id} 
                style={{ borderBottom: '1px solid #30363D', cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => navigate(`/partner/revenue/${s.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#21262D'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px' }}>{new Date(s.periodStart).toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
                <td style={{ padding: '16px', fontFamily: 'monospace' }}>{s.reference}</td>
                <td style={{ padding: '16px', fontWeight: 600 }}>{formatMoney(s.netAmount / 100)}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: 12, 
                    fontSize: 12, 
                    fontWeight: 600,
                    background: s.status === 'PAID' ? 'rgba(34,197,94,0.1)' : s.status === 'APPROVED' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                    color: s.status === 'PAID' ? '#22c55e' : s.status === 'APPROVED' ? '#3b82f6' : '#f59e0b'
                  }}>
                    {s.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
            {settlements.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#8B949E' }}>
                  No official settlements available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
