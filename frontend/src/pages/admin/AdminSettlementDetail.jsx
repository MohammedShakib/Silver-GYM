import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../../services/adminApi';
import Skeleton from '../../ui/Skeleton';
import { ArrowLeft, Check, Plus, AlertTriangle, CreditCard } from 'lucide-react';

export default function AdminSettlementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettlementDetail(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this settlement? This action cannot be undone.')) return;
    setProcessing(true);
    try {
      await adminApi.approveSettlement(id);
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddAdjustment = async () => {
    const direction = window.prompt('Enter direction (CREDIT or DEBIT):', 'CREDIT');
    if (!direction || !['CREDIT', 'DEBIT'].includes(direction)) return alert('Invalid direction');
    
    const amountStr = window.prompt('Enter amount (in BDT, will be converted to paisa):', '500');
    if (!amountStr) return;
    const amount = parseInt(amountStr) * 100;
    if (isNaN(amount) || amount <= 0) return alert('Invalid amount');

    const reason = window.prompt('Enter reason for adjustment:');
    if (!reason) return alert('Reason is required');

    setProcessing(true);
    try {
      await adminApi.addSettlementAdjustment(id, {
        type: 'MANUAL_CORRECTION',
        direction,
        amount,
        reason
      });
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Adjustment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleInitiatePayout = async () => {
    if (!window.confirm('Initiate payout for this settlement?')) return;
    setProcessing(true);
    try {
      await adminApi.initiatePayout(id);
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Skeleton height={400} />;
  if (!data) return <div style={{ color: 'white' }}>Settlement not found</div>;

  const formatMoney = (amount) => `৳${(amount / 100).toLocaleString()}`;

  return (
    <div className="anim-fade" style={{ maxWidth: 1000, color: 'white' }}>
      <button 
        onClick={() => navigate('/admin/settlements')} 
        style={{ background: 'transparent', border: 'none', color: '#8B949E', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: 0, marginBottom: 24 }}
      >
        <ArrowLeft size={16} /> Back to Settlements
      </button>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            Settlement {data.reference}
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
            {data.gym?.name} | {new Date(data.periodStart).toLocaleDateString()} - {new Date(data.periodEnd).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {data.status === 'CALCULATED' && (
            <>
              <button 
                onClick={handleAddAdjustment} 
                disabled={processing}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#0D1117', border: '1px solid #30363D', color: 'white', borderRadius: 8, cursor: processing ? 'not-allowed' : 'pointer' }}
              >
                <Plus size={16} /> Add Adjustment
              </button>
              <button 
                onClick={handleApprove} 
                disabled={processing}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, cursor: processing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
              >
                <Check size={18} /> Approve Settlement
              </button>
            </>
          )}

          {data.status === 'APPROVED' && (
            <button 
              onClick={handleInitiatePayout} 
              disabled={processing}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: processing ? 'not-allowed' : 'pointer', fontWeight: 600 }}
            >
              <CreditCard size={18} /> Initiate Payout
            </button>
          )}
        </div>
      </header>

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
            +{formatMoney(data.positiveAdjustments)} / -{formatMoney(data.negativeAdjustments)}
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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Adjustments</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363D', color: '#8B949E', background: '#0D1117' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Reason</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.adjustments.map(adj => (
              <tr key={adj.id} style={{ borderBottom: '1px solid #30363D' }}>
                <td style={{ padding: '12px 16px' }}>{new Date(adj.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px 16px' }}>{adj.type}</td>
                <td style={{ padding: '12px 16px' }}>{adj.reason}</td>
                <td style={{ padding: '12px 16px', color: adj.direction === 'CREDIT' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  {adj.direction === 'CREDIT' ? '+' : '-'}{formatMoney(adj.amount)}
                </td>
              </tr>
            ))}
            {data.adjustments.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#8B949E' }}>No adjustments recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
