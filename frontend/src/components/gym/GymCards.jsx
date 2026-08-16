import { MapPin, Star, Clock, CheckCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedGyms } from '../../hooks/useSavedGyms';

const CROWD_COLORS = {
  low: { dot: 'crowd-low', label: 'Low Crowd', textColor: 'var(--status-success)' },
  moderate: { dot: 'crowd-moderate', label: 'Moderate', textColor: 'var(--status-warning)' },
  busy: { dot: 'crowd-busy', label: 'Busy', textColor: 'var(--status-error)' },
  full: { dot: 'crowd-full', label: 'Full', textColor: '#7C3AED' },
};

export function GymCardCompact({ gym, selected, onHover, onLeave }) {
  const navigate = useNavigate();
  const crowd = CROWD_COLORS[gym.crowd] || CROWD_COLORS.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);
  const { isSaved, toggleSavedGym } = useSavedGyms();
  const saved = isSaved(gym.id);

  return (
    <article
      onClick={() => navigate(`/member/gym/${gym.id}`)}
      onMouseEnter={() => onHover?.(gym.id)}
      onMouseLeave={() => onLeave?.()}
      style={{
        display: 'grid',
        gridTemplateColumns: '128px 1fr',
        gap: 'var(--sp-4)',
        padding: '14px 16px',
        minHeight: 136,
        background: selected ? '#F8FFF9' : 'var(--bg-surface)',
        border: `1.5px solid ${selected ? 'rgba(34, 197, 94, 0.72)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--r-xl)',
        cursor: 'pointer',
        transition: 'all .18s ease',
        position: 'relative',
        boxShadow: selected ? '0 12px 28px rgba(34, 197, 94, 0.08)' : 'none',
      }}
    >
      {selected ? (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 16,
            bottom: 16,
            width: 4,
            borderRadius: '0 999px 999px 0',
            background: 'var(--sg-green)',
          }}
        />
      ) : null}

      <div style={{ position: 'relative', height: 108, borderRadius: 'var(--r-lg)', overflow: 'hidden', flexShrink: 0 }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)' }}>
              {gym.name}
              {gym.verified && <CheckCircle size={13} color="var(--sg-green)" />}
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, margin: 0, flexWrap: 'wrap' }}>
              <span>{gym.area}</span>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {gym.distance} km
              </span>
              <span style={{ color: 'var(--border-default)' }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {gym.eta} min
              </span>
            </p>
          </div>

          <button
            onClick={event => {
              event.stopPropagation();
              toggleSavedGym(gym.id);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}
          >
            <Heart size={15} fill={saved ? 'var(--status-error)' : 'none'} color={saved ? 'var(--status-error)' : 'currentColor'} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700 }}>
            <Star size={11} fill="var(--status-warning)" color="var(--status-warning)" />
            <strong>{gym.rating}</strong> ({gym.reviewCount})
          </span>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <span style={{ fontSize: 'var(--text-xs)', color: gym.status === 'open' ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 700 }}>
            {gym.status === 'open' ? `Open until ${gym.closesAt}` : 'Closed'}
          </span>
          <span style={{ color: 'var(--border-default)' }}>·</span>
          <span style={{ fontSize: 'var(--text-xs)', color: crowd.textColor, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className={`crowd-dot ${crowd.dot}`} style={{ width: 6, height: 6 }} />
            {crowd.label}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {gym.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} style={{ fontSize: 11, background: 'var(--bg-muted)', color: 'var(--text-secondary)', padding: '2px 7px', borderRadius: 'var(--r-sm)' }}>
              {amenity}
            </span>
          ))}
          {gym.amenities.length > 3 ? (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 4px' }}>+{gym.amenities.length - 3}</span>
          ) : null}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--text-xs)',
            fontWeight: 800,
            color: included ? '#166534' : '#92400E',
            background: included ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.14)',
            borderRadius: '999px',
            padding: '5px 9px',
            width: 'fit-content',
          }}
        >
          <CheckCircle size={12} />
          {included ? 'Included in Active Plan' : 'Upgrade required'}
        </div>

        {selected ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={event => {
                event.stopPropagation();
                navigate(`/member/gym/${gym.id}`);
              }}
              className="btn btn-dark btn-sm"
              style={{ minWidth: 94 }}
            >
              View Gym
            </button>
            <button
              onClick={event => {
                event.stopPropagation();
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.address)}`, '_blank', 'noopener,noreferrer');
              }}
              className="btn btn-secondary btn-sm"
              style={{ minWidth: 94 }}
            >
              Directions
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function GymCardLarge({ gym }) {
  const navigate = useNavigate();
  const crowd = CROWD_COLORS[gym.crowd] || CROWD_COLORS.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);
  const { isSaved, toggleSavedGym } = useSavedGyms();
  const saved = isSaved(gym.id);

  return (
    <article
      onClick={() => navigate(`/member/gym/${gym.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ position: 'relative', height: 190 }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={event => {
            event.stopPropagation();
            toggleSavedGym(gym.id);
          }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Heart size={15} fill={saved ? 'var(--status-error)' : 'none'} color={saved ? 'var(--status-error)' : 'var(--text-secondary)'} />
        </button>
        {included ? (
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span className="badge badge-green">Included in Active ✓</span>
          </div>
        ) : null}
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
          {gym.amenities.slice(0, 3).map(amenity => (
            <span key={amenity} style={{ fontSize: 11, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: 'var(--r-sm)' }}>
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
