import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Pause, X } from 'lucide-react';
import { mockUser, plans } from '../../services/mockData';

export default function Membership() {
  const pct = (mockUser.visitsUsed / mockUser.visitsTotal) * 100;
  const [actionNotice, setActionNotice] = useState('');

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 900 }}>
      <h1 style={{ marginBottom: 'var(--sp-8)' }}>Membership</h1>

      {/* Current Plan */}
      <div style={{ background: 'var(--sg-charcoal)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-8)', marginBottom: 'var(--sp-8)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 20%, rgba(34,197,94,.12) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--sp-8)', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--sp-5)', alignItems: 'center' }}>
              <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>Current plan</span>
              <span className="badge badge-green">Active</span>
            </div>
            <h2 style={{ color: 'white', fontSize: 'var(--text-5xl)', fontWeight: 900, marginBottom: 4 }}>{mockUser.plan} Plan</h2>
            <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-lg)', marginBottom: 'var(--sp-6)' }}>Renews on {mockUser.renewalDate}</p>

            <div style={{ marginBottom: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>Visits used</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{mockUser.visitsUsed} / {mockUser.visitsTotal}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--sg-green)', borderRadius: 'var(--r-full)' }} />
              </div>
              <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
                {mockUser.visitsRemaining} visits remaining this month
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--sp-5)', background: 'rgba(255,255,255,.06)', borderRadius: 'var(--r-xl)', border: '1px solid rgba(255,255,255,.08)' }}>
              <p style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-xs)', margin: '0 0 4px' }}>Monthly price</p>
              <p style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: 0 }}>৳3,490</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px var(--sp-4)', background: 'rgba(34,197,94,.1)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(34,197,94,.2)' }}>
              <CreditCard size={16} color="var(--sg-green)" />
              <span style={{ color: 'var(--sg-silver)', fontSize: 'var(--text-sm)' }}>Payment successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan benefits */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <h3 style={{ marginBottom: 'var(--sp-5)' }}>Plan benefits</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-4)' }}>
          {plans.find(p => p.id === 'active')?.features.map(f => (
            <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--text-sm)' }}>
              <CheckCircle size={14} color="var(--sg-green)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      <div style={{ background: 'var(--sg-green-light)', border: '1.5px solid var(--sg-green-muted)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-8)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--sg-green-active)' }}>Unlock all premium gyms</p>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--sg-charcoal-light)' }}>Upgrade to Unlimited for access to Block 35 and other premium-tier gyms.</p>
        </div>
        <Link to="/member/membership#plan-options" className="btn btn-dark btn-sm" style={{ whiteSpace: 'nowrap', gap: 6 }}>Upgrade <ArrowRight size={14} /></Link>
      </div>

      {/* Billing history */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <h3 style={{ marginBottom: 'var(--sp-5)' }}>Billing history</h3>
        {[
          { date: '30 Jul 2026', desc: 'Active Plan — August', amount: '৳3,490', status: 'Paid' },
          { date: '30 Jun 2026', desc: 'Active Plan — July',   amount: '৳3,490', status: 'Paid' },
          { date: '30 May 2026', desc: 'Active Plan — June',   amount: '৳3,490', status: 'Paid' },
        ].map(b => (
          <div key={b.date} className="flex-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{b.desc}</p>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{b.date}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge badge-green">{b.status}</span>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{b.amount}</span>
            </div>
          </div>
        ))}
      </div>

      <div id="plan-options" className="card card-shadow" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
        <h3 style={{ marginBottom: 'var(--sp-5)' }}>Plan options</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
          {plans.map(plan => {
            const isCurrentPlan = plan.name === mockUser.plan;

            return (
              <div key={plan.id} style={{ border: `1.5px solid ${isCurrentPlan ? 'var(--sg-green)' : 'var(--border-subtle)'}`, borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', background: isCurrentPlan ? 'var(--sg-green-light)' : 'var(--bg-surface)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--sp-4)', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 'var(--text-xl)' }}>{plan.name}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{plan.gymTier}</p>
                  </div>
                  {isCurrentPlan && <span className="badge badge-green">Current</span>}
                </div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900, margin: '0 0 var(--sp-4)' }}>
                  ৳{plan.price.toLocaleString()}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--sp-5)' }}>
                  {plan.features.slice(0, 4).map(feature => (
                    <div key={feature} style={{ display: 'flex', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color="var(--sg-green)" style={{ flexShrink: 0 }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${isCurrentPlan ? 'btn-secondary' : 'btn-dark'} btn-full`}
                  onClick={() => setActionNotice(
                    isCurrentPlan
                      ? 'You are already on this plan.'
                      : `Plan switching UI is ready, but billing automation is not wired yet. Target plan: ${plan.name}.`
                  )}
                >
                  {isCurrentPlan ? 'Current Plan' : `Request ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {actionNotice && (
        <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-8)', border: '1px solid var(--sg-green-muted)', background: 'var(--sg-green-light)' }}>
          <p style={{ margin: 0, color: 'var(--sg-charcoal-light)', lineHeight: 1.7 }}>{actionNotice}</p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => setActionNotice('Pause requests are not connected to backend billing yet.') }><Pause size={15} /> Pause Membership</button>
        <button className="btn btn-secondary" style={{ gap: 6 }} onClick={() => setActionNotice('Payment method updates are not connected yet.') }><CreditCard size={15} /> Change Payment Method</button>
        <button className="btn btn-ghost" style={{ gap: 6, color: 'var(--status-error)' }} onClick={() => setActionNotice('Cancellation flow is not wired yet. This button now reports that limitation instead of doing nothing.') }><X size={15} /> Cancel Plan</button>
      </div>
    </div>
  );
}
