import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { mockGyms, mockUser } from '../../services/mockData';
import GymCard from '../../components/gym/GymCard';
import Badge from '../../components/ui/Badge';

export default function ExploreGyms() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Open Now', 'Within 2 km', 'Low Crowd', 'Included in My Plan', 'Rating 4.5+'];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-height))', overflow: 'hidden' }} className="explore-layout animate-fade-in">
      
      {/* Left Sidebar - List */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border-subtle)' }} className="explore-list-panel">
        
        {/* Search & Filters */}
        <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-subtle)', zIndex: 10 }}>
          <div className="search-input-wrapper" style={{ marginBottom: 'var(--space-4)' }}>
            <Search className="lucide" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Gym, area, landmark or facility" 
              style={{ borderRadius: 'var(--radius-lg)' }}
            />
            <div style={{ position: 'absolute', right: '12px' }}>
              <Badge variant="neutral" style={{ padding: '6px 10px', fontSize: '12px', display: 'flex', gap: '4px', cursor: 'pointer' }}>
                <MapPin size={14} /> {mockUser.location.split(',')[0]}
              </Badge>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }} className="hide-scrollbar">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: activeFilter === filter ? 'var(--color-brand-primary)' : 'var(--color-border-default)',
                  backgroundColor: activeFilter === filter ? 'var(--color-brand-primary-light)' : 'var(--color-bg-surface)',
                  color: activeFilter === filter ? 'var(--color-brand-primary-active)' : 'var(--color-text-secondary)',
                  fontSize: '14px',
                  fontWeight: activeFilter === filter ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
            <button style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-default)',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
              <SlidersHorizontal size={14} /> More Filters
            </button>
          </div>
          
          <div className="flex-row-between" style={{ marginTop: 'var(--space-4)', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            <span>Showing {mockGyms.length} gyms</span>
            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-primary)', fontWeight: 600, cursor: 'pointer' }}>
              Sort: Recommended <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Gym List */}
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {mockGyms.map(gym => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      </div>

      {/* Right Sidebar - Map */}
      <div style={{ width: '55%', position: 'relative', backgroundColor: '#E9ECEF' }} className="explore-map-panel">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCdCcHSyJ5meOw19OhgNsU7Sqn9zY8PLzeIDNQdb73Xn0YcGRxPnq42sCWcbhGZgkxjK57pR4bN09A8JDbhp3KCOofHBADyc70NyfmNFVkbekxeLrqSVMeHniv145NSLLh6uHuKE_elEFH5PGsZJX-JxAEl67_MYJO00LNrUunoVmLumn6cwMVLew0Nndd3uOsixIHORQRU65bT5OSSqs6x95UCkVKf1gKf-delCarR2IK3GsH2m1T" 
          alt="Map" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        {/* Mock Map Pins */}
        <div style={{ position: 'absolute', top: '30%', left: '40%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-brand-primary)', borderRadius: '50%', border: '3px solid white', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%' }}></div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '55%', left: '60%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '50%', border: '3px solid var(--color-brand-primary)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
            <span style={{ fontWeight: 800, color: 'var(--color-brand-primary)' }}>1</span>
          </div>
          {/* Mock selected state tooltip */}
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translate(-50%, -100%)', backgroundColor: 'white', padding: '12px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: '240px', zIndex: 11 }}>
            <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Iron House Fitness</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>0.7 km • Low Crowd</p>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="btn-icon" style={{ backgroundColor: 'white', border: 'none', boxShadow: 'var(--shadow-md)', width: '40px', height: '40px' }}>+</button>
          <button className="btn-icon" style={{ backgroundColor: 'white', border: 'none', boxShadow: 'var(--shadow-md)', width: '40px', height: '40px' }}>-</button>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 992px) {
          .explore-layout {
            flex-direction: column-reverse;
          }
          .explore-list-panel {
            width: 100% !important;
            height: 60%;
            border-right: none !important;
            border-top: 1px solid var(--color-border-subtle);
          }
          .explore-map-panel {
            width: 100% !important;
            height: 40%;
          }
        }
      `}</style>
    </div>
  );
}
