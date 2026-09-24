import { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import Skeleton from '../../components/ui/Skeleton';

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPayouts({});
      setPayouts(res.payouts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmManual = async (id) => {
    const providerTransferId = window.prompt('Enter external provider transfer reference (e.g. Bank Trx ID, bKash Trx ID):');
    if (!providerTransferId) return;

    try {
      await adminApi.confirmManualPayout(id, providerTransferId);
      fetchPayouts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm payout');
    }
  };

  const formatMoney = (amount) => `৳${(amount / 100).toLocaleString()}`;

  return (
    <div className="anim-fade">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 24 }}>Payouts</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 14 }}>Manage and track manual money transfers to gym partners.</p>
      </div>

      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? <Skeleton height={400} /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363D', color: '#8B949E', background: '#0D1117' }}>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Reference</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Gym</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Provider</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #30363D' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{p.reference}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.gym?.name}</td>
                  <td style={{ padding: '12px 16px' }}>{p.provider}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{formatMoney(p.amount)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 12, 
                      fontSize: 12, 
                      fontWeight: 600,
                      background: p.status === 'PAID' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                      color: p.status === 'PAID' ? '#22c55e' : '#f59e0b'
                    }}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.status === 'PROCESSING' && p.provider === 'MANUAL' && (
                      <button 
                        onClick={() => handleConfirmManual(p.id)}
                        style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                      >
                        Confirm Transfer
                      </button>
                    )}
                    {p.status === 'PAID' && (
                      <span style={{ color: '#8B949E', fontSize: 12 }}>Ref: {p.providerTransferId}</span>
                    )}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#8B949E' }}>
                    No payouts found.
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
