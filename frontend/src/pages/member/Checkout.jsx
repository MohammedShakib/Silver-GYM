import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { checkoutService } from '../../services/CheckoutService';
import { membershipService } from '../../services/MembershipService';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!planId) {
      navigate('/member');
      return;
    }

    const loadPlan = async () => {
      try {
        const plans = await membershipService.getPlans();
        const selectedPlan = plans.find(p => p.id === planId);
        if (!selectedPlan) throw new Error('Plan not found');
        setPlan(selectedPlan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlan();
  }, [planId, navigate]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const session = await checkoutService.createCheckoutSession(planId);
      // Redirect to the provider checkout URL
      window.location.href = session.checkoutUrl;
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ padding: 'var(--sp-12)', textAlign: 'center' }}>Loading checkout...</div>;
  if (error) return <div style={{ padding: 'var(--sp-12)', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 600 }}>
      <PageHeader
        title="Checkout"
        subtitle="Complete your payment to activate your membership."
      />

      <div className="card card-shadow" style={{ padding: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-6)', paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: '0 0 var(--sp-2)' }}>{plan.name} Plan</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{plan.accessTier} Access Level</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Monthly Price</span>
          <span style={{ fontWeight: 600 }}>৳{(plan.priceMonthly || plan.price).toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-8)', fontWeight: 800, fontSize: 'var(--text-xl)' }}>
          <span>Total Due</span>
          <span>৳{(plan.priceMonthly || plan.price).toLocaleString()}</span>
        </div>

        <Button 
          fullWidth 
          size="lg" 
          onClick={handleCheckout} 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
        <div style={{ textAlign: 'center', marginTop: 'var(--sp-4)' }}>
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
