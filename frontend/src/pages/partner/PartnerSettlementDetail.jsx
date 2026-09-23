import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';
import { ArrowLeft, CreditCard, AlertTriangle, Info } from 'lucide-react';

export default function PartnerSettlementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedGym } = usePartnerGym();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getSettlementDetail(selectedGym.id, id);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, selectedGym.id]);

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Settlement not found</div>;

  const formatMoney = (amount) => `৳${(amount / 100).toLocaleString()}`;

  return (
    <div className="anim-fade" style={{ maxWidth: 1000, color: 'white' }}>
      <button 
        onClick={() => navigate('/partner/revenue')} 
        style={{ background: 'transparent', border: 'none', color: '#8B949E', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: 0, marginBottom: 24 }}
      >
        <ArrowLeft size={16} /> Back to Revenue
      </button>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            Settlement Statement
            <span style={{ 
              padding: '4px 8px', 
              borderRadius: 12, 
              fontSize: 14, 
              background: data.status === 'PAID' ? 'rgba(34,197,94,0.1)' : data.status === 'APPROVED' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
              color: data.status === 'PAID' ? '#22c55e' : data.status === 'APPROVED' ? '#3b82f6' : '#f59e0b',
              verticalAlign: 'middle'
            }}>
              {data.status.replace('_', ' ')}
            </span>
          </h1>
          <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>
            Ref: {data.reference} | {new Date(data.periodStart).toLocaleDateString()} - {new Date(data.periodEnd).toLocaleDateString()}
          </p>
        </div>
      </header>

      {data.status === 'APPROVED' && (
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Info color="#3b82f6" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ color: '#bfdbfe', margin: '0 0 4px 0', fontSize: 14 }}>Approved for Payout</h4>
            <p style={{ color: '#93c5fd', margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              This settlement has been approved by Silver GYM. Payout processing will begin shortly according to your selected payout method.
            </p>
          </div>
        </div>
      )}

      {data.status === 'PAID' && data.payouts && data.payouts.length > 0 && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <CreditCard color="#22c55e" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ color: '#bbf7d0', margin: '0 0 4px 0', fontSize: 14 }}>Payout Completed</h4>
            <p style={{ color: '#86efac', margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              Transfer completed via <strong>{data.payouts[0].provider}</strong>. Ref: {data.payouts[0].providerTransferId}
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 8px 0', fontWeight: 500 }}>Gross Amount ({data.billableVisitCount} visits)</h3>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{formatMoney(data.grossAmount)}</div>
        </div>
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#8B949E', fontSize: 14, margin: '0 0 8px 0', fontWeight: 500 }}>Adjustments</h3>
          <div style={{ fontSize: 32, fontWeight: 700, color: data.positiveAdjustments - data.negativeAdjustments < 0 ? '#ef4444' : (data.positiveAdjustments - data.negativeAdjustments > 0 ? '#22c55e' : 'white') }}>
            {formatMoney(data.positiveAdjustments - data.negativeAdjustments)}
          </div>
          <div style={{ fontSize: 12, color: '#8B949E', marginTop: 4 }}>
            Credits: {formatMoney(data.positiveAdjustments)} / Debits: {formatMoney(data.negativeAdjustments)}
          </div>
        </div>
        <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#93c5fd', fontSize: 14, margin: '0 0 8px 0', fontWeight: 500 }}>Net Payable</h3>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#bfdbfe' }}>{formatMoney(data.netAmount)}</div>
        </div>
      </div>

      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: 16, borderBottom: '1px solid #30363D', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} color="#8B949E" />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Adjustments Details</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363D', color: '#8B949E', background: '#0D1117' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Reason</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.adjustments.map(adj => (
              <tr key={adj.id} style={{ borderBottom: '1px solid #30363D' }}>
                <td style={{ padding: '12px 16px' }}>{new Date(adj.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>{adj.reason}</td>
                <td style={{ padding: '12px 16px', color: adj.direction === 'CREDIT' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  {adj.direction === 'CREDIT' ? '+' : '-'}{formatMoney(adj.amount)}
                </td>
              </tr>
            ))}
            {data.adjustments.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 16, textAlign: 'center', color: '#8B949E' }}>No adjustments recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
