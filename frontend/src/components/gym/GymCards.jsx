import { MapPin, Star, Clock, Users, CheckCircle, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CROWD_COLORS = {
  low:      { dot: 'crowd-low',      label: 'Low Crowd',      textColor: 'var(--status-success)' },
  moderate: { dot: 'crowd-moderate', label: 'Moderate',        textColor: 'var(--status-warning)' },
  busy:     { dot: 'crowd-busy',     label: 'Busy',            textColor: 'var(--status-error)' },
  full:     { dot: 'crowd-full',     label: 'Full',            textColor: '#7C3AED' },
};

export function GymCardCompact({ gym, selected, onHover, onLeave }) {
  const navigate = useNavigate();
  const crowd = CROWD_COLORS[gym.crowd] || CROWD_COLORS.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);

  return (
    <article
      onClick={() => navigate(`/member/gym/${gym.id}`)}
      onMouseEnter={() => onHover?.(gym.id)}
      onMouseLeave={() => onLeave?.()}
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 'var(--sp-4)',
        padding: 'var(--sp-4)',
        background: selected ? 'var(--sg-green-light)' : 'var(--bg-surface)',
        border: `1.5px solid ${selected ? 'var(--sg-green)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--r-xl)',
        cursor: 'pointer',
        transition: 'all .18s',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', height: 110, borderRadius: 'var(--r-lg)', overflow: 'hidden', flexShrink: 0 }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {included && (
          <div style={{ position: 'absolute', bottom: 6, left: 6 }}>
            <span className="badge badge-green" style={{ fontSize: 10 }}>Included ✓</span>
          </div>
        )}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
              {gym.name}
              {gym.verified && <CheckCircle size={13} color="var(--sg-green)" />}
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <MapPin size={12} /> {gym.area}
            </p>
          </div>
          <button
            onClick={e => e.stopPropagation()}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}
          >
            <Heart size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-secondary)' }}>
            <Star size={11} fill="var(--status-warning)" color="var(--status-warning)" />
            <strong>{gym.rating}</strong> ({gym.reviewCount})
          </span>
          <span style={{ color: 'var(--border-subtle)' }}>·</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {gym.distance} km · {gym.eta} min
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: gym.status === 'open' ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }}>
            {gym.status === 'open' ? `Open · until ${gym.closesAt}` : 'Closed'}
          </span>
          <span style={{ color: 'var(--border-subtle)' }}>·</span>
          <span style={{ fontSize: 'var(--text-xs)', color: crowd.textColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className={`crowd-dot ${crowd.dot}`} style={{ width: 6, height: 6 }} />
            {crowd.label}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {gym.amenities.slice(0, 3).map(a => (
            <span key={a} style={{ fontSize: 11, background: 'var(--bg-muted)', color: 'var(--text-secondary)', padding: '2px 7px', borderRadius: 'var(--r-sm)' }}>
              {a}
            </span>
          ))}
          {gym.amenities.length > 3 && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 4px' }}>+{gym.amenities.length - 3}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function GymCardLarge({ gym }) {
  const navigate = useNavigate();
  const crowd = CROWD_COLORS[gym.crowd] || CROWD_COLORS.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);

  return (
    <article
      onClick={() => navigate(`/member/gym/${gym.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ position: 'relative', height: 190 }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Heart size={15} color="var(--text-secondary)" />
        </button>
        {included && (
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span className="badge badge-green">Included in Active ✓</span>
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-2)' }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
              {gym.name}
              {gym.verified && <CheckCircle size={14} color="var(--sg-green)" />}
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} />{gym.area} · {gym.distance} km · {gym.eta} min
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
            <Star size={13} fill="var(--status-warning)" color="var(--status-warning)" />
            {gym.rating}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--sp-3)', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: gym.status === 'open' ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }}>
            <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
            {gym.status === 'open' ? `Open · ${gym.closesAt}` : 'Closed'}
          </span>
          <span style={{ color: crowd.textColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            <span className={`crowd-dot ${crowd.dot}`} style={{ width: 6, height: 6 }} />{crowd.label}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {gym.amenities.slice(0, 3).map(a => (
            <span key={a} style={{ fontSize: 11, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: 'var(--r-sm)' }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
