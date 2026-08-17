import { CheckCircle, Users, AlertCircle, Clock } from 'lucide-react';

const STATUS_CONFIGS = {
  // Crowd
  low: { label: 'Low Crowd', variant: 'green', dot: 'crowd-low' },
  moderate: { label: 'Moderate', variant: 'warning', dot: 'crowd-moderate' },
  busy: { label: 'Busy', variant: 'error', dot: 'crowd-busy' },
  full: { label: 'Full', variant: 'error', dot: 'crowd-full' },

  // Plan eligibility
  included: { label: 'Included in Active Plan', variant: 'green', icon: CheckCircle },
  upgrade: { label: 'Upgrade required', variant: 'warning', icon: AlertCircle },

  // Plan status
  active: { label: 'ACTIVE', variant: 'green' },
  current: { label: 'Current Plan', variant: 'green' },
  verified: { label: 'Verified Partner', variant: 'verified', icon: CheckCircle },
  open: { label: 'Open Now', variant: 'green', icon: Clock },
  closed: { label: 'Closed', variant: 'neutral', icon: Clock },
};

export default function StatusBadge({ status, label, className = '' }) {
  const config = STATUS_CONFIGS[status] || { label: status, variant: 'neutral' };
  const text = label || config.label;
  const Icon = config.icon;

  return (
    <span className={`badge badge-${config.variant} ${className}`.trim()}>
      {config.dot && <span className={`crowd-dot ${config.dot}`} style={{ width: 6, height: 6 }} />}
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      <span>{text}</span>
    </span>
  );
}

