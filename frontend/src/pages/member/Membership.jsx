import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Pause, AlertTriangle, Download, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { useCurrentMember } from '../../hooks/useCurrentMember';
import { useMembership } from '../../hooks/useMembership';
import { membershipService } from '../../services/MembershipService';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

export default function Membership() {
  const { member: mockUser, isLoading: memberLoading } = useCurrentMember();
  const { membership, plans, isLoading: memLoading, refetch } = useMembership();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await membershipService.getInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
      } finally {
        setInvoicesLoading(false);
      }
    };
    if (mockUser) fetchInvoices();
  }, [mockUser]);

  if (memberLoading || memLoading) return <div style={{ padding: 'var(--sp-12)', textAlign: 'center' }}><Loader2 className="anim-spin" /> Loading membership...</div>;
  if (!mockUser || !membership) return <div>Membership not found. Please activate one.</div>;

  const pct = Math.min(100, Math.round((membership.visitsUsed / membership.plan.visitLimit) * 100)) || 0;

  const handleDownloadReceipt = (invoiceId) => {
    setDownloading(invoiceId);
    window.setTimeout(() => {
      setDownloading(null);
      setActionNotice(`Receipt for invoice ${invoiceId} downloaded.`);
    }, 900);
  };

  const handlePause = async () => {
    setIsProcessing(true);
    try {
      await membershipService.pauseMembership();
      setActionNotice('Membership paused successfully.');
      refetch();
    } catch (e) {
      setActionNotice('Failed to pause membership.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await membershipService.cancelMembership();
      setActionNotice(`Membership set to cancel on ${new Date(membership.cycleEndsAt).toLocaleDateString()}.`);
      refetch();
    } catch (e) {
      setActionNotice('Failed to cancel membership.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 1040 }}>
      {/* Header */}
      <PageHeader
        title="Membership"
        subtitle="Manage your plan, visits, billing invoices, and gym network access tiers."
      />

      {/* Current Plan Hero Card */}
      <div
        className="pass-card"
        style={{
          borderRadius: 'var(--r-2xl)',
          padding: 'var(--sp-8)',
          marginBottom: 'var(--sp-8)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #101722 0%, #171D26 65%, #101722 100%)',
          border: '1px solid rgba(255,255,255,.08)',
          boxShadow: '0 16px 36px rgba(16,23,34,0.35)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--sp-8)', alignItems: 'center' }} className="membership-hero-grid">
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--sp-3)', alignItems: 'center' }}>
              <span className={`badge ${membership.status === 'ACTIVE' ? 'badge-green' : 'badge-dark'}`} style={{ fontWeight: 800, fontSize: 10 }}>
                {membership.status} SUBSCRIPTION
              </span>
              {!membership.autoRenew && <span className="badge badge-dark" style={{ fontWeight: 800, fontSize: 10 }}>CANCELS AT PERIOD END</span>}
              <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)' }}>ID {mockUser.memberCode}</span>
            </div>

            <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {membership.plan.name} Plan
            </h2>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-5)' }}>
              Next billing cycle renews on <strong style={{ color: 'white' }}>{new Date(membership.renewsAt).toLocaleDateString()}</strong>
            </p>

            {/* Visits Progress */}
            {membership.plan.visitLimit !== null && (
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Visit Allowance</span>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 'var(--text-sm)' }}>
                    {membership.visitsUsed} / {membership.plan.visitLimit} Visits Used
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sg-green)', borderRadius: 'var(--r-full)', transition: 'width .6s ease' }} />
                </div>
                <p style={{ color: 'var(--sg-green)', fontSize: 'var(--text-xs)', fontWeight: 700, margin: '6px 0 0' }}>
                  {membership.visitsRemaining} visits remaining this billing period
                </p>
              </div>
            )}
          </div>

          {/* Pricing & Status Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--sp-5)', background: 'rgba(255,255,255,.05)', borderRadius: 'var(--r-xl)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ color: 'var(--sg-silver)', fontSize: 11, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Rate</p>
              <p style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: '0 0 4px' }}>৳{membership.plan.priceMonthly}</p>
              <p style={{ color: 'var(--sg-silver)', fontSize: 11, margin: 0 }}>per month {membership.autoRenew && '· auto-renews'}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(32,200,99,.12)', borderRadius: 'var(--r-md)', border: '1px solid rgba(32,200,99,.25)' }}>
              <ShieldCheck size={16} color="var(--sg-green)" />
              <span style={{ color: 'white', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Payment method verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      {membership.plan.id !== 'unlimited' && (
        <div
          style={{
            background: 'var(--sg-green-light)',
            border: '1.5px solid rgba(32,200,99,0.4)',
            borderRadius: 'var(--r-xl)',
            padding: 'var(--sp-5) var(--sp-6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--sp-8)',
            flexWrap: 'wrap',
            gap: 'var(--sp-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--sg-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 800, color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>
                Unlock all premium gyms across Dhaka
              </p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Upgrade to Unlimited to access premium partner locations like Block 35 with zero visit restrictions.
              </p>
            </div>
          </div>
          <Button variant="dark" size="md" onClick={() => navigate('/member/checkout?planId=unlimited')}>
            <span>Upgrade to Unlimited</span> <ArrowRight size={14} />
          </Button>
        </div>
      )}

      {/* Billing history table */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Billing history</h3>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Past monthly subscription invoices</p>
          </div>
        </div>

        <div className="responsive-table-wrap" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '10px 0', fontWeight: 700 }}>Invoice / Plan</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>Amount</th>
                <th style={{ padding: '10px 0', fontWeight: 700, textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoicesLoading ? (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}><Loader2 className="anim-spin" size={24} /></td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No invoices found.</td></tr>
              ) : invoices.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{b.payment?.plan?.name || 'Subscription'} Plan</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{b.invoiceNumber}</p>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{new Date(b.issuedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--text-primary)' }}>৳{b.amount}</td>
                  <td style={{ padding: '14px 0', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(b.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ gap: 4, fontSize: 'var(--text-xs)' }}
                    >
                      {downloading === b.id ? (
                        <span className="anim-spin" style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                      ) : (
                        <Download size={12} />
                      )}
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Options Grid */}
      <div id="plan-options" className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Silver GYM Plan Options</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Compare tiers or change your subscription level</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-5)' }}>
          {plans.map(plan => {
            const isCurrentPlan = plan.id === membership.plan.id;
            const isUnlimited = plan.id === 'unlimited';

            return (
              <div
                key={plan.id}
                style={{
                  border: `2px solid ${isCurrentPlan ? 'var(--sg-green)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--r-xl)',
                  padding: 'var(--sp-6)',
                  background: isCurrentPlan ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {isUnlimited && !isCurrentPlan && (
                  <div style={{ position: 'absolute', top: -10, right: 16 }}>
                    <span className="badge badge-dark" style={{ fontSize: 10, fontWeight: 800 }}>MOST POPULAR</span>
                  </div>
                )}

                <div>
                  <div className="flex-between" style={{ marginBottom: 'var(--sp-3)', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>{plan.name}</p>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{plan.accessTier} Access</p>
                    </div>
                    {isCurrentPlan && <span className="badge badge-green" style={{ fontWeight: 800, fontSize: 10 }}>Current Plan</span>}
                  </div>

                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: '0 0 var(--sp-4)', color: 'var(--text-primary)' }}>
                    ৳{plan.priceMonthly.toLocaleString()} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)' }}>/ mo</span>
                  </p>
                </div>

                <Button
                  variant={isCurrentPlan ? 'secondary' : 'dark'}
                  fullWidth
                  disabled={isCurrentPlan}
                  onClick={() => navigate(`/member/checkout?planId=${plan.id}`)}
                >
                  {isCurrentPlan ? 'Current Plan' : `Change to ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {actionNotice && (
        <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-8)', border: '1px solid var(--sg-green-muted)', background: 'var(--sg-green-light)' }}>
          <p style={{ margin: 0, color: 'var(--sg-green-active)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>✓ {actionNotice}</p>
        </div>
      )}

      {/* Membership Settings / Administrative Actions */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 var(--sp-4)', color: 'var(--text-primary)' }}>Membership Settings</h3>
        <div className="membership-settings-row" style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="md"
            icon={Pause}
            onClick={handlePause}
            disabled={isProcessing || membership.status === 'PAUSED'}
          >
            {membership.status === 'PAUSED' ? 'Membership is Paused' : 'Pause Membership'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={CreditCard}
            onClick={() => setActionNotice('Payment method update interface opened.')}
          >
            Change Payment Method
          </Button>

          <div style={{ marginLeft: 'auto' }}>
            <Button
              variant="danger"
              size="md"
              icon={AlertTriangle}
              onClick={handleCancel}
              disabled={isProcessing || !membership.autoRenew}
            >
              {!membership.autoRenew ? 'Will Cancel Automatically' : 'Cancel Membership'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
