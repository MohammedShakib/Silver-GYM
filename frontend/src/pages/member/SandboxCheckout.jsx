import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { getApiHealth } from '../../services/api'; // using just to get the API_URL logic if needed

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3001/api/v1');

export default function SandboxCheckout() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const simulateWebhook = async (status) => {
    setIsProcessing(true);
    try {
      // Simulate the provider calling our webhook
      const providerTxnId = `demo_txn_${Date.now()}`;
      const payload = {
        paymentId,
        providerTransactionId: providerTxnId,
        status,
        amount: parseInt(amount, 10),
        currency
      };

      const res = await fetch(`${API_URL}/payments/webhooks/DEMO`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Webhook failed to process');
      }

      // Webhook succeeded, now redirect user to verification page
      navigate(`/member/payment/verify?paymentId=${paymentId}`);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)' }}>
      <div className="card card-shadow" style={{ padding: 'var(--sp-8)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--sp-2)' }}>Demo Payment Gateway</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-6)' }}>
          This is a simulated payment provider page.
        </p>

        <div style={{ background: 'var(--bg-surface)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', marginBottom: 'var(--sp-6)', border: '1px dashed var(--border-subtle)' }}>
          <p style={{ margin: '0 0 var(--sp-2)', fontSize: 'var(--text-sm)' }}>Amount to Pay</p>
          <h3 style={{ margin: 0, fontSize: 'var(--text-3xl)' }}>{currency} {amount}</h3>
        </div>

        {error && <p style={{ color: 'red', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <Button 
            fullWidth 
            onClick={() => simulateWebhook('SUCCESS')}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Simulate Success'}
          </Button>
          <Button 
            variant="danger" 
            fullWidth 
            onClick={() => simulateWebhook('FAILED')}
            disabled={isProcessing}
          >
            Simulate Failure
          </Button>
        </div>
      </div>
    </div>
  );
}
