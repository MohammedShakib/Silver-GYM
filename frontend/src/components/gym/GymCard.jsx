import { MapPin, Star, Clock, Users, CheckCircle, Heart } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export default function GymCard({ gym }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/member/gym/${gym.id}`);
  };

  const getCrowdColor = (crowd) => {
    if (crowd === 'low') return 'var(--color-status-success)';
    if (crowd === 'moderate') return 'var(--color-status-warning)';
    return 'var(--color-status-error)';
  };

  return (
    <Card hoverable onClick={handleCardClick} className="gym-card animate-fade-in" style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: '180px' }}>
        <img 
          src={gym.image} 
          alt={gym.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <button 
          className="btn-icon"
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            background: 'rgba(255,255,255,0.9)',
            border: 'none'
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Toggle favorite
          }}
        >
          <Heart size={18} color="var(--color-text-secondary)" />
        </button>
        {gym.tier === 'Active' && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
            <Badge variant="success">Included in Plan</Badge>
          </div>
        )}
      </div>
      
      <div style={{ padding: 'var(--space-4)' }}>
        <div className="flex-row-between" style={{ marginBottom: 'var(--space-1)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {gym.name}
            {gym.verified && <CheckCircle size={16} color="var(--color-brand-primary)" fill="var(--color-brand-primary-light)" />}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <Star size={16} color="var(--color-status-warning)" fill="var(--color-status-warning)" />
            {gym.rating}
          </div>
        </div>
        
        <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>
          <MapPin size={14} />
          {gym.area} • {gym.distance} km • {gym.time} min
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
            <Clock size={16} color="var(--color-text-secondary)" />
            <span style={{ color: gym.status === 'open' ? 'var(--color-status-success)' : 'inherit', fontWeight: gym.status === 'open' ? '600' : 'normal' }}>
              {gym.status === 'open' ? 'Open now' : 'Closed'}
            </span>
            <span className="text-muted">until {gym.closesAt}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)' }}>
            <Users size={16} color={getCrowdColor(gym.crowd)} />
            <span style={{ color: getCrowdColor(gym.crowd), fontWeight: '500', textTransform: 'capitalize' }}>
              {gym.crowd} Crowd
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {gym.amenities.map(amenity => (
            <span key={amenity} style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
