import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Pause, AlertTriangle, Download, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { mockUser, plans } from '../../services/mockData';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

export default function Membership() {
  const pct = Math.min(100, Math.round((mockUser.visitsUsed / mockUser.visitsTotal) * 100));
  const [actionNotice, setActionNotice] = useState('');
  const [downloading, setDownloading] = useState(null);

  const handleDownloadReceipt = (invoiceId) => {
    setDownloading(invoiceId);
    window.setTimeout(() => {
      setDownloading(null);
      setActionNotice(`Receipt for invoice ${invoiceId} downloaded.`);
    }, 900);
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
              <span className="badge badge-green" style={{ fontWeight: 800, fontSize: 10 }}>ACTIVE SUBSCRIPTION</span>
              <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)' }}>ID {mockUser.id}</span>
            </div>

            <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {mockUser.plan} Plan
            </h2>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-5)' }}>
              Next billing cycle renews on <strong style={{ color: 'white' }}>{mockUser.renewalDate}</strong>
            </p>

            {/* Visits Progress */}
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Visit Allowance</span>
                <span style={{ color: 'white', fontWeight: 800, fontSize: 'var(--text-sm)' }}>
                  {mockUser.visitsUsed} / {mockUser.visitsTotal} Visits Used
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sg-green)', borderRadius: 'var(--r-full)', transition: 'width .6s ease' }} />
              </div>
              <p style={{ color: 'var(--sg-green)', fontSize: 'var(--text-xs)', fontWeight: 700, margin: '6px 0 0' }}>
                {mockUser.visitsRemaining} visits remaining this billing period
              </p>
            </div>
          </div>

          {/* Pricing & Status Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--sp-5)', background: 'rgba(255,255,255,.05)', borderRadius: 'var(--r-xl)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ color: 'var(--sg-silver)', fontSize: 11, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Rate</p>
              <p style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: '0 0 4px' }}>৳3,490</p>
              <p style={{ color: 'var(--sg-silver)', fontSize: 11, margin: 0 }}>per month · auto-renews</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(32,200,99,.12)', borderRadius: 'var(--r-md)', border: '1px solid rgba(32,200,99,.25)' }}>
              <ShieldCheck size={16} color="var(--sg-green)" />
              <span style={{ color: 'white', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Payment method verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan benefits */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Included in your {mockUser.plan} Plan</h3>
          <span className="badge badge-green">Standard Partner Access</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-3)' }}>
          {plans.find(p => p.id === 'active')?.features.map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-sm)' }}>
              <CheckCircle size={15} color="var(--sg-green)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
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
        <a href="#plan-options" className="btn btn-dark btn-md" style={{ whiteSpace: 'nowrap', gap: 6 }}>
          <span>View Unlimited Plan</span> <ArrowRight size={14} />
        </a>
      </div>

      {/* Billing history table */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Billing history</h3>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Past monthly subscription invoices</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
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
              {[
                { id: 'INV-2026-08', date: '30 Jul 2026', desc: 'Active Plan — August 2026', amount: '৳3,490', status: 'Paid' },
                { id: 'INV-2026-07', date: '30 Jun 2026', desc: 'Active Plan — July 2026',   amount: '৳3,490', status: 'Paid' },
                { id: 'INV-2026-06', date: '30 May 2026', desc: 'Active Plan — June 2026',   amount: '৳3,490', status: 'Paid' },
              ].map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-sm)' }}>
                  <td style={{ padding: '14px 0' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{b.desc}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{b.id}</p>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{b.date}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--text-primary)' }}>{b.amount}</td>
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
            const isCurrentPlan = plan.name === mockUser.plan;
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
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{plan.gymTier}</p>
                    </div>
                    {isCurrentPlan && <span className="badge badge-green" style={{ fontWeight: 800, fontSize: 10 }}>Current Plan</span>}
                  </div>

                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: '0 0 var(--sp-4)', color: 'var(--text-primary)' }}>
                    ৳{plan.price.toLocaleString()} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)' }}>/ mo</span>
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--sp-6)' }}>
                    {plan.features.slice(0, 4).map(feature => (
                      <div key={feature} style={{ display: 'flex', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={14} color="var(--sg-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={isCurrentPlan ? 'secondary' : 'dark'}
                  fullWidth
                  onClick={() => setActionNotice(
                    isCurrentPlan
                      ? 'You are currently active on this plan.'
                      : `Plan change requested for ${plan.name} Plan (৳${plan.price.toLocaleString()}/mo). Confirmation notification generated.`
                  )}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
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
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="md"
            icon={Pause}
            onClick={() => setActionNotice('Pause request submitted. Your membership can be paused for up to 30 days per calendar year.')}
          >
            Pause Membership
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={CreditCard}
            onClick={() => setActionNotice('Payment method update interface opened. Supported: bKash, Rocket, Nagad, Visa, Mastercard.')}
          >
            Change Payment Method
          </Button>

          <div style={{ marginLeft: 'auto' }}>
            <Button
              variant="danger"
              size="md"
              icon={AlertTriangle}
              onClick={() => setActionNotice('To cancel your membership, please review the cycle end terms. Access will remain active until 30 August 2026.')}
            >
              Cancel Membership
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

