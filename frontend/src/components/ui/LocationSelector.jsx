import React, { useContext, useState } from 'react';
import { LocationContext } from '../../context/LocationContext';
import { MapPin, LocateFixed, ChevronDown, Check } from 'lucide-react';

const PREDEFINED_AREAS = [
  { label: 'Mirpur 10', area: 'Mirpur 10', latitude: 23.8052, longitude: 90.3696 },
  { label: 'Mirpur 12', area: 'Mirpur 12', latitude: 23.8211, longitude: 90.3665 },
  { label: 'Gulshan 2', area: 'Gulshan 2', latitude: 23.7915, longitude: 90.4132 },
  { label: 'Banani', area: 'Banani', latitude: 23.7940, longitude: 90.4043 },
];

export default function LocationSelector() {
  const { location, requestBrowserLocation, setManualLocation, isLocating } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectArea = (area) => {
    setManualLocation({ ...area, source: 'area' });
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    requestBrowserLocation();
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--r-md)',
          cursor: 'pointer'
        }}
      >
        <MapPin size={16} />
        <span>{isLocating ? 'Locating...' : location.label}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '4px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-md)',
          width: '240px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '4px'
        }}>
          <button 
            onClick={handleCurrentLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-primary)'
            }}
          >
            <LocateFixed size={16} /> Use Current Location
          </button>
          
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
          
          <div style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Areas
          </div>
          
          {PREDEFINED_AREAS.map(area => (
            <button
              key={area.label}
              onClick={() => handleSelectArea(area)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <span>{area.label}</span>
              {location.label === area.label && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
