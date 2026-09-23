import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkoutService } from '../../services/CheckoutService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const navigate = useNavigate();

  const [status, setStatus] = useState('VERIFYING'); // VERIFYING, SUCCESS, FAILED
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!paymentId) {
      navigate('/member');
      return;
    }

    const verify = async () => {
      try {
        const payment = await checkoutService.verifyPayment(paymentId);
        if (payment.status === 'PAID') {
          setStatus('SUCCESS');
          setMessage('Payment successful! Your membership is active.');
        } else if (payment.status === 'FAILED') {
          setStatus('FAILED');
          setMessage('Payment failed or was declined.');
        } else {
          // If still pending, we could poll. For simplicity, just say pending.
          setStatus('VERIFYING');
          setMessage('Payment is still processing. Please wait...');
          setTimeout(verify, 3000);
        }
      } catch (err) {
        setStatus('FAILED');
        setMessage(err.message || 'Verification failed');
      }
    };

    verify();
  }, [paymentId, navigate]);

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-16)', maxWidth: 600, textAlign: 'center' }}>
      <div className="card card-shadow" style={{ padding: 'var(--sp-12)' }}>
        {status === 'VERIFYING' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <Loader2 size={48} className="anim-spin" color="var(--sg-green)" />
            <h2 style={{ margin: 0 }}>{message}</h2>
          </div>
        )}
        
        {status === 'SUCCESS' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <CheckCircle size={64} color="var(--sg-green)" />
            <h2 style={{ margin: 0, color: 'var(--sg-green)' }}>{message}</h2>
            <Button onClick={() => navigate('/member')} style={{ marginTop: 'var(--sp-6)' }}>Go to Dashboard</Button>
          </div>
        )}

        {status === 'FAILED' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <XCircle size={64} color="var(--sg-red)" />
            <h2 style={{ margin: 0, color: 'var(--sg-red)' }}>{message}</h2>
            <Button onClick={() => navigate('/member')} style={{ marginTop: 'var(--sp-6)' }}>Return to Dashboard</Button>
          </div>
        )}
      </div>
    </div>
  );
}
