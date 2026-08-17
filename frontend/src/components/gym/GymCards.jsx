import { MapPin, Star, Clock, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedGyms } from '../../hooks/useSavedGyms';
import { openDirections } from '../../utils/browserActions';

const CROWD_CONFIG = {
  low: { dot: 'crowd-low', label: 'Low Crowd', textColor: 'var(--status-success)' },
  moderate: { dot: 'crowd-moderate', label: 'Moderate Crowd', textColor: 'var(--status-warning)' },
  busy: { dot: 'crowd-busy', label: 'Busy Crowd', textColor: 'var(--status-error)' },
  full: { dot: 'crowd-full', label: 'Full', textColor: 'var(--status-error)' },
};

export function GymCardCompact({ gym, selected, hovered, onSelect, onHover, onLeave }) {
  const navigate = useNavigate();
  const crowd = CROWD_CONFIG[gym.crowd] || CROWD_CONFIG.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);
  const { isSaved, toggleSavedGym } = useSavedGyms();
  const saved = isSaved(gym.id);

  return (
    <article
      onClick={() => onSelect?.(gym.id)}
      onMouseEnter={() => onHover?.(gym.id)}
      onMouseLeave={() => onLeave?.()}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(gym.id);
        }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 'var(--sp-4)',
        padding: '12px 14px',
        minHeight: 136,
        background: selected ? '#F8FFF9' : hovered ? 'var(--bg-subtle)' : 'var(--bg-surface)',
        border: selected
          ? '2px solid var(--sg-green)'
          : hovered
          ? '1.5px solid var(--border-default)'
          : '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-lg)',
        cursor: 'pointer',
        transition: 'all .18s ease',
        position: 'relative',
        boxShadow: selected ? '0 8px 24px rgba(32, 200, 99, 0.12)' : hovered ? 'var(--shadow-sm)' : 'none',
        transform: hovered && !selected ? 'translateY(-1px)' : 'none',
      }}
    >
      {selected && (
        <span
          style={{
            position: 'absolute',
            left: -2,
            top: 10,
            bottom: 10,
            width: 4,
            borderRadius: '0 4px 4px 0',
            background: 'var(--sg-green)',
          }}
        />
      )}

      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 110, borderRadius: 'var(--r-md)', overflow: 'hidden', flexShrink: 0 }}>
        <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Content */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Title row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5, margin: 0 }}>
              <span>{gym.name}</span>
              {gym.verified && <CheckCircle size={13} color="var(--sg-green)" fill="var(--sg-green-light)" />}
            </h4>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedGym(gym.id);
              }}
              title={saved ? 'Remove from saved' : 'Save gym'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)' }}
            >
              <Heart size={15} fill={saved ? 'var(--status-error)' : 'none'} color={saved ? 'var(--status-error)' : 'var(--text-muted)'} />
            </button>
          </div>

          {/* Area, Distance, ETA */}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, margin: '0 0 6px', flexWrap: 'wrap' }}>
            <span>{gym.area}</span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span>{gym.distance} km</span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span>{gym.eta} min</span>
          </p>

          {/* Rating, Open status, Crowd */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700, color: 'var(--text-primary)' }}>
              <Star size={11} fill="var(--status-warning)" color="var(--status-warning)" />
              {gym.rating} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({gym.reviewCount})</span>
            </span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span style={{ fontSize: 'var(--text-xs)', color: gym.status === 'open' ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600 }}>
              {gym.status === 'open' ? `Open until ${gym.closesAt}` : 'Closed'}
            </span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span style={{ fontSize: 'var(--text-xs)', color: crowd.textColor, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className={`crowd-dot ${crowd.dot}`} style={{ width: 6, height: 6 }} />
              {crowd.label}
            </span>
          </div>

          {/* Amenities tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {gym.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} style={{ fontSize: 10, background: 'var(--bg-muted)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: 'var(--r-sm)', fontWeight: 500 }}>
                {amenity}
              </span>
            ))}
            {gym.amenities.length > 3 && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '2px 4px' }}>+{gym.amenities.length - 3}</span>
            )}
          </div>
        </div>

        {/* Footer: Plan Badge + Selected Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span
            className={`badge ${included ? 'badge-green' : 'badge-warning'}`}
            style={{ fontSize: 10, fontWeight: 700 }}
          >
            {included ? '✓ Included in Plan' : 'Upgrade required'}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/member/gym/${gym.id}`);
            }}
            className="btn btn-dark btn-sm"
            style={{ padding: '0.25rem 0.65rem', fontSize: 11, borderRadius: 'var(--r-sm)' }}
          >
            View Gym
          </button>
        </div>
      </div>
    </article>
  );
}

export function GymCardLarge({ gym }) {
  const navigate = useNavigate();
  const crowd = CROWD_CONFIG[gym.crowd] || CROWD_CONFIG.low;
  const userPlan = 'Active';
  const included = gym.plans.includes(userPlan);
  const { isSaved, toggleSavedGym } = useSavedGyms();
  const saved = isSaved(gym.id);

  return (
    <article
      onClick={() => navigate(`/member/gym/${gym.id}`)}
      className="card card-hover"
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image header */}
      <div style={{ position: 'relative', height: 180, width: '100%', overflow: 'hidden' }}>
        <img
          src={gym.image}
          alt={gym.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s ease' }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedGym(gym.id);
          }}
          title={saved ? 'Remove from saved' : 'Save gym'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Heart size={15} fill={saved ? 'var(--status-error)' : 'none'} color={saved ? 'var(--status-error)' : 'var(--text-secondary)'} />
        </button>

        {included ? (
          <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <span className="badge badge-green" style={{ fontWeight: 700, fontSize: 10 }}>
              Included in Active ✓
            </span>
          </div>
        ) : null}
      </div>

      {/* Card Body */}
      <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Name & Rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)', margin: 0 }}>
              <span>{gym.name}</span>
              {gym.verified && <CheckCircle size={13} color="var(--sg-green)" fill="var(--sg-green-light)" />}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              <Star size={12} fill="var(--status-warning)" color="var(--status-warning)" />
              <span>{gym.rating}</span>
            </div>
          </div>

          {/* Area & Distance */}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 var(--sp-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} color="var(--sg-green)" />
            <span>{gym.area} · {gym.distance} km · {gym.eta} min</span>
          </p>

          {/* Open & Crowd Meta */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--sp-3)', fontSize: 'var(--text-xs)' }}>
            <span style={{ color: gym.status === 'open' ? 'var(--status-success)' : 'var(--status-error)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} />
              <span>{gym.status === 'open' ? `Open · ${gym.closesAt}` : 'Closed'}</span>
            </span>
            <span style={{ color: crowd.textColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className={`crowd-dot ${crowd.dot}`} style={{ width: 6, height: 6 }} />
              <span>{crowd.label}</span>
            </span>
          </div>

          {/* Amenities */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--sp-4)' }}>
            {gym.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} style={{ fontSize: 11, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 7px', borderRadius: 'var(--r-sm)', fontWeight: 500 }}>
                {amenity}
              </span>
            ))}
            {gym.amenities.length > 3 && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 4px' }}>+{gym.amenities.length - 3}</span>
            )}
          </div>
        </div>

        {/* Action button */}
        <div style={{ paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--sg-green)', fontWeight: 700 }}>
            View details & equipment
          </span>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--sg-green)' }}>
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default GymCardLarge;

