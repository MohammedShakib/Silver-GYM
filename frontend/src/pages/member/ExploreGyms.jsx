import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react';
import { mockGyms } from '../../services/mockData';
import { GymCardCompact } from '../../components/gym/GymCards';

const FILTERS = ['Near Me', 'Open Now', 'Within 2 km', 'Low Crowd', 'Included In My Plan', '4.5+'];

const GYM_PINS = [
  { id: '1', x: '38%', y: '55%', label: 'Iron House', gym: mockGyms[0] },
  { id: '2', x: '28%', y: '65%', label: 'PowerFit',   gym: mockGyms[1] },
  { id: '3', x: '70%', y: '30%', label: 'Block 35',   gym: mockGyms[2] },
  { id: '4', x: '62%', y: '42%', label: 'Urban Strength', gym: mockGyms[3] },
];

function MapPinComponent({ pin, active, onSelect }) {
  return (
    <div
      className="map-pin"
      style={{ left: pin.x, top: pin.y, zIndex: active ? 20 : 10 }}
      onClick={() => onSelect(pin.id)}
    >
      <div className={`map-pin-dot ${active ? 'active' : ''}`} style={{ width: 32, height: 32 }}>
        <span style={{ fontSize: 9, fontWeight: 900 }}>SG</span>
      </div>
      <div className="map-pin-label">{pin.label}</div>

      {/* Selected popup */}
      {active && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 12,
          background: 'white', borderRadius: 'var(--r-xl)', padding: 'var(--sp-4)', boxShadow: 'var(--shadow-xl)',
          width: 230, border: '1px solid var(--border-subtle)', zIndex: 30,
        }}>
          <img src={pin.gym.image} alt={pin.gym.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 'var(--r-lg)', marginBottom: 8 }} />
          <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{pin.gym.name}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pin.gym.distance} km · {pin.gym.crowd} crowd</span>
            <span className={`badge ${pin.gym.plans.includes('Active') ? 'badge-green' : 'badge-neutral'}`} style={{ fontSize: 9 }}>
              {pin.gym.plans.includes('Active') ? 'Included ✓' : 'Upgrade'}
            </span>
          </div>
          <a href={`/member/gym/${pin.gym.id}`} className="btn btn-dark btn-sm btn-full">View Gym</a>
        </div>
      )}
    </div>
  );
}

export default function ExploreGyms() {
  const [activeFilter, setActiveFilter] = useState('');
  const [hoveredGym, setHoveredGym] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  const handleSelectPin = (id) => {
    setSelectedPin(prev => prev === id ? null : id);
    setHoveredGym(id);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden' }} className="anim-fade">

      {/* ── Left panel ── */}
      <div style={{ width: '42%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>

        {/* Search header */}
        <div style={{ padding: 'var(--sp-5)', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <div className="input-group" style={{ position: 'relative', marginBottom: 'var(--sp-3)' }}>
            <Search size={16} className="input-icon" />
            <input type="text" className="input input-with-icon" style={{ borderRadius: 'var(--r-full)', fontSize: 'var(--text-sm)', padding: '.6rem 3rem' }} placeholder="Gym, area, landmark or facility" />
            <div className="input-icon-right" style={{ right: 12 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-full)', padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                <MapPin size={11} color="var(--sg-green)" /> Mirpur 10
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {FILTERS.map(f => (
              <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setActiveFilter(f === activeFilter ? '' : f)}>
                {f}
              </button>
            ))}
            <button className="filter-chip" style={{ fontSize: 12, gap: 4 }}>
              <SlidersHorizontal size={11} /> More
            </button>
          </div>

          <div className="flex-between" style={{ marginTop: 'var(--sp-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mockGyms.length} gyms near Mirpur 10</span>
            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}>
              Sort: Recommended <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Gym list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {mockGyms.map(gym => (
            <GymCardCompact
              key={gym.id}
              gym={gym}
              selected={hoveredGym === gym.id}
              onHover={() => { setHoveredGym(gym.id); setSelectedPin(gym.id); }}
              onLeave={() => setHoveredGym(null)}
            />
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div className="map-surface" style={{ width: '100%', height: '100%' }}>
          {/* Map image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW1VIhpQI3RKs-ZZyXPMMuVEhv9YntXyKw3h2VyD2cNRZ46cmKGRo3_f6nKp1oNZzTybULzbWdJBky6ksIyHwl1wfe6IVgCAwMLtS6EaqnQRMYJh_HDGisidQ1a4dQR1vJ8GlsGh2mxorJ0ppt-uDCq7W0kmWHwtZ1r5iJg6Yz_9cjl5Fp_-bh9Jim_ggGuoRk45ho2g8sHOq6Gzk68orIZ12r6SlwV4Ir5h0qEXhzrQQdpheasY6g"
            alt="Dhaka map"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .9 }}
          />

          {/* User pin */}
          <div className="user-pin" style={{ left: '42%', top: '60%' }} />

          {/* Gym pins */}
          {GYM_PINS.map(pin => (
            <MapPinComponent
              key={pin.id}
              pin={pin}
              active={selectedPin === pin.id}
              onSelect={handleSelectPin}
            />
          ))}

          {/* Map controls */}
          <div style={{ position: 'absolute', bottom: 24, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['+', '−'].map(c => (
              <button key={c} style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                {c}
              </button>
            ))}
            <button style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-md)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="var(--status-info)" />
            </button>
          </div>

          {/* Search this area chip */}
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <button style={{ background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-full)', padding: '8px 18px', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={13} /> Search this area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
