import { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mockGyms } from '../../services/mockData';
import { GymCardCompact } from '../../components/gym/GymCards';

const FILTERS = ['Near Me', 'Open Now', 'Within 2 km', 'Low Crowd', 'Included In My Plan', '4.5+'];

const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const MAP_CENTER = [90.3994, 23.7928];
const USER_LOCATION = [90.3994, 23.7928];

const GYM_COORDINATES = {
  '1': { lng: 90.3668, lat: 23.8067, label: 'Iron House' },
  '2': { lng: 90.3651, lat: 23.8212, label: 'PowerFit' },
  '3': { lng: 90.4142, lat: 23.7942, label: 'Block 35' },
  '4': { lng: 90.4067, lat: 23.7957, label: 'Urban Strength' },
};

const GYM_PINS = mockGyms
  .filter(gym => GYM_COORDINATES[gym.id])
  .map(gym => ({
    id: gym.id,
    gym,
    label: GYM_COORDINATES[gym.id].label,
    coordinates: [GYM_COORDINATES[gym.id].lng, GYM_COORDINATES[gym.id].lat],
  }));

function getPopupHtml(gym) {
  const included = gym.plans.includes('Active') ? 'Included' : 'Upgrade';
  const badgeClass = gym.plans.includes('Active') ? 'sg-map-popup-badge-green' : 'sg-map-popup-badge-neutral';

  return `
    <div class="sg-map-popup-card">
      <img src="${gym.image}" alt="${gym.name}" class="sg-map-popup-image" />
      <p class="sg-map-popup-title">${gym.name}</p>
      <div class="sg-map-popup-meta">
        <span>${gym.distance} km • ${gym.crowd} crowd</span>
        <span class="sg-map-popup-badge ${badgeClass}">${included}</span>
      </div>
      <a href="/member/gym/${gym.id}" class="sg-map-popup-link">View Gym</a>
    </div>
  `;
}

function createMarkerElement(pin, onSelect, onHover, onLeave) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sg-map-marker';
  button.setAttribute('aria-label', pin.gym.name);
  button.innerHTML = `
    <span class="sg-map-marker-dot">SG</span>
    <span class="sg-map-marker-label">${pin.label}</span>
  `;

  button.addEventListener('click', event => {
    event.stopPropagation();
    onSelect(pin.id);
  });
  button.addEventListener('mouseenter', () => onHover(pin.id));
  button.addEventListener('mouseleave', () => onLeave());

  return button;
}

export default function ExploreGyms() {
  const [activeFilter, setActiveFilter] = useState('');
  const [hoveredGym, setHoveredGym] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [sortLabel, setSortLabel] = useState('Recommended');
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const markerRefs = useRef({});

  const handleSelectPin = (id) => {
    setSelectedPin(prev => (prev === id ? null : id));
    setHoveredGym(id);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: MAP_CENTER,
      zoom: 12.2,
      pitch: 42,
      bearing: -14,
      attributionControl: false,
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 28,
      maxWidth: '240px',
      className: 'sg-map-popup',
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.scrollZoom.disable();

    let sceneReady = false;

    const setupMapScene = () => {
      if (sceneReady) {
        return;
      }

      sceneReady = true;
      const bounds = new maplibregl.LngLatBounds();

      GYM_PINS.forEach(pin => {
        const element = createMarkerElement(
          pin,
          handleSelectPin,
          id => setHoveredGym(id),
          () => setHoveredGym(null),
        );

        const marker = new maplibregl.Marker({
          element,
          anchor: 'bottom',
        })
          .setLngLat(pin.coordinates)
          .addTo(map);

        markerRefs.current[pin.id] = { marker, element, pin };
        bounds.extend(pin.coordinates);
      });

      const userElement = document.createElement('div');
      userElement.className = 'sg-map-user-marker';
      new maplibregl.Marker({ element: userElement })
        .setLngLat(USER_LOCATION)
        .addTo(map);

      bounds.extend(USER_LOCATION);
      map.fitBounds(bounds, {
        padding: { top: 120, right: 72, bottom: 72, left: 72 },
        duration: 0,
        maxZoom: 12.9,
      });
    };

    map.once('style.load', setupMapScene);
    map.once('load', setupMapScene);

    map.on('click', () => {
      setSelectedPin(null);
    });

    mapRef.current = map;
    popupRef.current = popup;

    return () => {
      popup.remove();
      Object.values(markerRefs.current).forEach(({ marker }) => marker.remove());
      markerRefs.current = {};
      map.remove();
      mapRef.current = null;
      popupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const activeId = selectedPin || hoveredGym;

    Object.entries(markerRefs.current).forEach(([id, entry]) => {
      entry.element.classList.toggle('is-active', activeId === id);
    });

    if (!selectedPin || !popupRef.current || !mapRef.current) {
      popupRef.current?.remove();
      return;
    }

    const activePin = GYM_PINS.find(pin => pin.id === selectedPin);
    if (!activePin) {
      popupRef.current.remove();
      return;
    }

    popupRef.current
      .setLngLat(activePin.coordinates)
      .setHTML(getPopupHtml(activePin.gym))
      .addTo(mapRef.current);

    mapRef.current.easeTo({
      center: activePin.coordinates,
      duration: 550,
      zoom: Math.max(mapRef.current.getZoom(), 12.7),
      offset: [0, 80],
    });
  }, [hoveredGym, selectedPin]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden' }} className="anim-fade">
      <div style={{ width: '42%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-base)' }}>
        <div style={{ padding: 'var(--sp-5)', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <div className="input-group" style={{ position: 'relative', marginBottom: 'var(--sp-3)' }}>
            <Search size={16} className="input-icon" />
            <input type="text" className="input input-with-icon" style={{ borderRadius: 'var(--r-full)', fontSize: 'var(--text-sm)', padding: '.6rem 3rem' }} placeholder="Gym, area, landmark or facility" />
            <div className="input-icon-right" style={{ right: 12 }}>
              <button onClick={() => setActiveFilter('Near Me')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--r-full)', padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
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
            <button className="filter-chip" style={{ fontSize: 12, gap: 4 }} onClick={() => setShowExtraFilters(current => !current)}>
              <SlidersHorizontal size={11} /> More
            </button>
          </div>

          {showExtraFilters && (
            <div style={{ display: 'flex', gap: 6, marginTop: 'var(--sp-3)', flexWrap: 'wrap' }}>
              {['Women Friendly', 'Pool', 'Trainer'].map(filter => (
                <button key={filter} className={`filter-chip ${activeFilter === filter ? 'active' : ''}`} style={{ fontSize: 12 }} onClick={() => setActiveFilter(filter)}>
                  {filter}
                </button>
              ))}
            </div>
          )}

          <div className="flex-between" style={{ marginTop: 'var(--sp-3)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mockGyms.length} gyms near Mirpur 10</span>
            <button
              onClick={() => setSortLabel(current => (current === 'Recommended' ? 'Closest' : 'Recommended'))}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              Sort: {sortLabel} <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {mockGyms.map(gym => (
            <GymCardCompact
              key={gym.id}
              gym={gym}
              selected={hoveredGym === gym.id || selectedPin === gym.id}
              onHover={() => {
                setHoveredGym(gym.id);
                setSelectedPin(gym.id);
              }}
              onLeave={() => setHoveredGym(null)}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div className="map-surface map-live-surface" style={{ width: '100%', height: '100%' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          <div style={{ position: 'absolute', bottom: 24, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['+', '-'].map(control => (
              <button
                key={control}
                onClick={() => {
                  if (!mapRef.current) {
                    return;
                  }

                  if (control === '+') {
                    mapRef.current.zoomIn({ duration: 250 });
                  } else {
                    mapRef.current.zoomOut({ duration: 250 });
                  }
                }}
                style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}
              >
                {control}
              </button>
            ))}
            <button
              onClick={() => {
                if (!mapRef.current) {
                  return;
                }

                mapRef.current.easeTo({
                  center: USER_LOCATION,
                  zoom: 12.6,
                  pitch: 42,
                  bearing: -14,
                  duration: 450,
                });
                setSelectedPin(null);
              }}
              style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-md)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <MapPin size={16} color="var(--status-info)" />
            </button>
          </div>

          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)' }}>
            <button
              onClick={() => {
                setActiveFilter('Near Me');
                setHoveredGym(mockGyms[0].id);
                setSelectedPin(mockGyms[0].id);
              }}
              style={{ background: 'white', border: '1px solid var(--border-default)', borderRadius: 'var(--r-full)', padding: '8px 18px', fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Search size={13} /> Search this area
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
