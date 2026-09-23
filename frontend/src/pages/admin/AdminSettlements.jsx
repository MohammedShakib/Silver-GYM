import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../services/adminApi';
import Skeleton from '../../ui/Skeleton';
import { FileText, Plus, CheckCircle, Search } from 'lucide-react';

export default function AdminSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettlements();
  }, [statusFilter]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSettlements({ status: statusFilter });
      setSettlements(res.settlements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const gymId = prompt('Enter Gym ID to generate for:');
    if (!gymId) return;

    // Hardcode generating for current month for demo purposes
    const now = new Date();
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    setGenerating(true);
    try {
      await adminApi.generateSettlement({
        gymId,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
      });
      fetchSettlements();
    } catch (err) {
      alert(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const formatMoney = (amount) => `৳${(amount / 100).toLocaleString()}`;

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 24 }}>Settlements</h1>
          <p style={{ color: '#8B949E', margin: 0, fontSize: 14 }}>Manage partner gym financial settlements and payout preparations.</p>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: generating ? 'not-allowed' : 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} />
          {generating ? 'Generating...' : 'Generate New'}
        </button>
      </div>

      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #30363D', display: 'flex', gap: 16 }}>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', background: '#0D1117', color: 'white', border: '1px solid #30363D', borderRadius: 6, outline: 'none' }}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="CALCULATED">Calculated</option>
            <option value="APPROVED">Approved</option>
            <option value="PAYOUT_PENDING">Payout Pending</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        {loading ? <Skeleton height={400} /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363D', color: '#8B949E', background: '#0D1117' }}>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Reference</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Gym</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Period</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Visits</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Net Amount</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(s => (
                <tr 
                  key={s.id} 
                  style={{ borderBottom: '1px solid #30363D', cursor: 'pointer', transition: 'background 0.2s' }}
                  onClick={() => navigate(`/admin/settlements/${s.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#21262D'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{s.reference}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.gym?.name || 'Unknown Gym'}</td>
                  <td style={{ padding: '12px 16px' }}>{new Date(s.periodStart).toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 16px' }}>{s.billableVisitCount}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatMoney(s.netAmount)}</td>
                  <td style={{ padding: '12px 16px' }}>
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
                  <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#8B949E' }}>
                    No settlements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
