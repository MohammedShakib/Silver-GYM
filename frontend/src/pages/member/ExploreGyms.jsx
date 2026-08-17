import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, ChevronDown, Check, LocateFixed, Navigation, Star, Map, List, RotateCcw } from 'lucide-react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mockGyms } from '../../services/mockData';
import { GymCardCompact } from '../../components/gym/GymCards';
import EmptyState from '../../components/ui/EmptyState';

const PRIMARY_FILTERS = ['Near Me', 'Open Now', 'Within 2 km', 'Low Crowd', 'Included In My Plan', '4.5+'];
const EXTRA_FILTERS = ['Women Friendly', 'Pool', 'Trainer'];
const SORT_OPTIONS = ['Recommended', 'Nearest', 'Highest Rated', 'Least Crowded'];

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
    included: gym.plans.includes('Active'),
  }));

const CROWD_ORDER = { low: 0, moderate: 1, busy: 2, full: 3 };

function distanceBetween(pointA, pointB) {
  const dx = pointA[0] - pointB[0];
  const dy = pointA[1] - pointB[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function createMarkerElement(pin, onSelect, onHover, onLeave) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `sg-map-marker ${pin.included ? 'is-included' : 'is-upgrade'}`;
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

function getNearestVisibleGym(center, visiblePins) {
  if (!visiblePins.length) {
    return null;
  }

  return visiblePins.reduce((closest, pin) => {
    if (!closest) {
      return pin;
    }

    return distanceBetween(center, pin.coordinates) < distanceBetween(center, closest.coordinates) ? pin : closest;
  }, null);
}

export default function ExploreGyms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter');

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState(initialFilter ? [initialFilter] : ['Near Me']);
  const [hoveredGym, setHoveredGym] = useState(null);
  const [selectedPin, setSelectedPin] = useState(mockGyms[0]?.id ?? null);
  const [sortLabel, setSortLabel] = useState('Recommended');
  const [showExtraFilters, setShowExtraFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [previewAnchor, setPreviewAnchor] = useState(null);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const userMarkerRef = useRef(null);
  const cardRefs = useRef({});
  const lastSearchedCenterRef = useRef(MAP_CENTER);
  const dragMovedRef = useRef(false);

  const toggleFilter = (filter) => {
    setActiveFilters(current => (
      current.includes(filter)
        ? current.filter(item => item !== filter)
        : [...current, filter]
    ));
  };


  const query = searchQuery.trim().toLowerCase();
  let filteredGyms = mockGyms.filter(gym => {
    const matchesSearch = !query || [gym.name, gym.area, gym.address, ...gym.amenities]
      .join(' ')
      .toLowerCase()
      .includes(query);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilters.includes('Open Now') && gym.status !== 'open') {
      return false;
    }

    if (activeFilters.includes('Within 2 km') && gym.distance > 2) {
      return false;
    }

    if (activeFilters.includes('Low Crowd') && gym.crowd !== 'low') {
      return false;
    }

    if (activeFilters.includes('Included In My Plan') && !gym.plans.includes('Active')) {
      return false;
    }

    if (activeFilters.includes('4.5+') && gym.rating < 4.5) {
      return false;
    }

    if (activeFilters.includes('Women Friendly') && !gym.amenities.includes('Women Friendly')) {
      return false;
    }

    if (activeFilters.includes('Pool') && !gym.amenities.includes('Pool')) {
      return false;
    }

    if (activeFilters.includes('Trainer') && !gym.amenities.includes('Trainer')) {
      return false;
    }

    return true;
  });

  filteredGyms = filteredGyms.sort((left, right) => {
    if (sortLabel === 'Nearest') {
      return left.distance - right.distance;
    }

    if (sortLabel === 'Highest Rated') {
      return right.rating - left.rating || left.distance - right.distance;
    }

    if (sortLabel === 'Least Crowded') {
      return CROWD_ORDER[left.crowd] - CROWD_ORDER[right.crowd] || left.distance - right.distance;
    }

    const leftIncluded = left.plans.includes('Active') ? 1 : 0;
    const rightIncluded = right.plans.includes('Active') ? 1 : 0;
    return rightIncluded - leftIncluded || left.distance - right.distance || right.rating - left.rating;
  });

  const visiblePins = GYM_PINS.filter(pin => filteredGyms.some(gym => gym.id === pin.id));
  const selectedGym = filteredGyms.find(gym => gym.id === selectedPin) || null;
  const selectedMapPin = visiblePins.find(pin => pin.id === selectedPin) || null;
  const extraFilterCount = activeFilters.filter(filter => EXTRA_FILTERS.includes(filter)).length;

  const resultPrimaryCopy = searchQuery || activeFilters.length > 1
    ? `${filteredGyms.length} gyms match your filters`
    : `${filteredGyms.length} gyms near Mirpur 10`;
  const resultSecondaryCopy = searchQuery || activeFilters.length > 1 ? 'Near Mirpur 10' : '';

  useEffect(() => {
    if (!filteredGyms.length) {
      setSelectedPin(null);
      return;
    }

    if (!filteredGyms.some(gym => gym.id === selectedPin)) {
      setSelectedPin(filteredGyms[0].id);
    }
  }, [filteredGyms, selectedPin]);

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

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.scrollZoom.disable();

    const updateSearchAreaState = () => {
      const currentCenter = map.getCenter().toArray();
      setShowSearchArea(distanceBetween(currentCenter, lastSearchedCenterRef.current) > 0.015);
    };

    const updatePreviewAnchor = () => {
      if (!selectedMapPin || !mapContainerRef.current) {
        setPreviewAnchor(null);
        return;
      }

      const point = map.project(selectedMapPin.coordinates);
      const width = mapContainerRef.current.clientWidth;
      const height = mapContainerRef.current.clientHeight;
      const safeX = Math.max(170, Math.min(width - 170, point.x));
      const placeBelow = point.y < 190;
      const safeY = Math.max(88, Math.min(height - 72, point.y));
      setPreviewAnchor({ x: safeX, y: safeY, placeBelow });
    };

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
          id => setSelectedPin(id),
          id => setHoveredGym(id),
          () => setHoveredGym(null),
        );

        const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
          .setLngLat(pin.coordinates)
          .addTo(map);

        markerRefs.current[pin.id] = { marker, element, pin };
        bounds.extend(pin.coordinates);
      });

      const userElement = document.createElement('div');
      userElement.className = 'sg-map-user-marker';
      userMarkerRef.current = new maplibregl.Marker({ element: userElement })
        .setLngLat(USER_LOCATION)
        .addTo(map);

      bounds.extend(USER_LOCATION);
      map.fitBounds(bounds, {
        padding: { top: 90, right: 92, bottom: 72, left: 92 },
        duration: 0,
        maxZoom: 12.8,
      });
      lastSearchedCenterRef.current = map.getCenter().toArray();
      setShowSearchArea(false);
      updatePreviewAnchor();
    };

    map.once('style.load', setupMapScene);
    map.once('load', setupMapScene);
    map.on('move', updatePreviewAnchor);
    map.on('zoom', updatePreviewAnchor);
    map.on('dragstart', () => {
      dragMovedRef.current = true;
    });
    map.on('moveend', () => {
      updatePreviewAnchor();
      if (dragMovedRef.current) {
        updateSearchAreaState();
      }
      dragMovedRef.current = false;
    });
    map.on('click', () => {
      setSelectedPin(null);
      setHoveredGym(null);
    });

    mapRef.current = map;

    return () => {
      Object.values(markerRefs.current).forEach(({ marker }) => marker.remove());
      markerRefs.current = {};
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [selectedMapPin]);

  useEffect(() => {
    const visibleIds = new Set(visiblePins.map(pin => pin.id));
    Object.entries(markerRefs.current).forEach(([id, entry]) => {
      entry.element.style.display = visibleIds.has(id) ? '' : 'none';
    });
  }, [visiblePins]);

  useEffect(() => {
    Object.entries(markerRefs.current).forEach(([id, entry]) => {
      entry.element.classList.toggle('is-selected', selectedPin === id);
      entry.element.classList.toggle('is-hovered', hoveredGym === id);
    });

    if (selectedPin) {
      const selectedNode = cardRefs.current[selectedPin];
      selectedNode?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

      if (mapRef.current && selectedMapPin) {
        mapRef.current.easeTo({
          center: selectedMapPin.coordinates,
          duration: 500,
          zoom: Math.max(mapRef.current.getZoom(), 12.7),
          offset: [0, 52],
        });
      }
    }
  }, [hoveredGym, selectedPin, selectedMapPin]);

  useEffect(() => {
    if (!mapRef.current || !selectedMapPin || !mapContainerRef.current) {
      setPreviewAnchor(null);
      return;
    }

    const point = mapRef.current.project(selectedMapPin.coordinates);
    const width = mapContainerRef.current.clientWidth;
    const height = mapContainerRef.current.clientHeight;
    setPreviewAnchor({
      x: Math.max(170, Math.min(width - 170, point.x)),
      y: Math.max(88, Math.min(height - 72, point.y)),
      placeBelow: point.y < 190,
    });
  }, [selectedMapPin]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--header-h))', overflow: 'hidden', position: 'relative' }} className="anim-fade explore-container">
      
      {/* Mobile Toggle Floating Bar (below 768px) */}
      <div className="show-mobile" style={{
        position: 'absolute',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        background: 'var(--sg-charcoal)',
        borderRadius: 'var(--r-full)',
        padding: '4px 6px',
        display: 'flex',
        gap: 4,
        boxShadow: '0 8px 24px rgba(16,23,34,0.3)',
      }}>
        <button
          type="button"
          onClick={() => setMobileTab('list')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--r-full)',
            border: 'none',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            cursor: 'pointer',
            background: mobileTab === 'list' ? 'var(--sg-green)' : 'transparent',
            color: mobileTab === 'list' ? 'white' : 'var(--sg-silver)',
            transition: 'all .15s',
          }}
        >
          <List size={13} strokeWidth={2.4} /> List ({filteredGyms.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--r-full)',
            border: 'none',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            cursor: 'pointer',
            background: mobileTab === 'map' ? 'var(--sg-green)' : 'transparent',
            color: mobileTab === 'map' ? 'white' : 'var(--sg-silver)',
            transition: 'all .15s',
          }}
        >
          <Map size={13} strokeWidth={2.4} /> Map
        </button>
      </div>

      {/* Left List Panel */}
      <div
        className={`explore-list-panel ${mobileTab === 'map' ? 'hide-mobile' : ''}`}
        style={{
          width: '38%',
          minWidth: 380,
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-base)',
          height: '100%',
        }}
      >
        {/* Compact Header & Filter Section */}
        <div style={{ padding: '14px 18px 12px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          <div className="input-group" style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={16} className="input-icon" color="var(--text-muted)" />
            <input
              type="text"
              className="input input-with-icon"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              style={{ borderRadius: 'var(--r-full)', fontSize: 'var(--text-sm)', padding: '.65rem 1rem .65rem 2.6rem', height: 44 }}
              placeholder="Gym, area, landmark or facility"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {PRIMARY_FILTERS.map(filter => {
              const active = activeFilters.includes(filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    height: 32,
                    padding: '0 11px',
                    borderRadius: 'var(--r-full)',
                    border: `1.5px solid ${active ? 'var(--sg-green)' : 'var(--border-default)'}`,
                    background: active ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                    color: active ? 'var(--sg-green-active)' : 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all .15s ease',
                  }}
                >
                  {active && <Check size={11} strokeWidth={3} />}
                  {filter}
                </button>
              );
            })}
            <button
              onClick={() => setShowExtraFilters(current => !current)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 32,
                padding: '0 11px',
                borderRadius: 'var(--r-full)',
                border: `1.5px solid ${showExtraFilters || extraFilterCount ? 'var(--sg-green)' : 'var(--border-default)'}`,
                background: showExtraFilters || extraFilterCount ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                color: showExtraFilters || extraFilterCount ? 'var(--sg-green-active)' : 'var(--text-secondary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <SlidersHorizontal size={11} />
              {extraFilterCount ? `More (${extraFilterCount})` : 'More'}
            </button>
          </div>

          {showExtraFilters && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {EXTRA_FILTERS.map(filter => {
                const active = activeFilters.includes(filter);
                return (
                  <button
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      height: 30,
                      padding: '0 10px',
                      borderRadius: 'var(--r-full)',
                      border: `1.5px solid ${active ? 'var(--sg-green)' : 'var(--border-default)'}`,
                      background: active ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                      color: active ? 'var(--sg-green-active)' : 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {active && <Check size={10} strokeWidth={3} />}
                    {filter}
                  </button>
                );
              })}
            </div>
          )}

          {/* Results Summary & Sorting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, minHeight: 28 }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 700 }}>
                {resultPrimaryCopy}
              </div>
              {resultSecondaryCopy ? (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{resultSecondaryCopy}</div>
              ) : null}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortMenu(current => !current)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  height: 28,
                  padding: '0 10px',
                  borderRadius: 'var(--r-full)',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {sortLabel} <ChevronDown size={11} />
              </button>

              {showSortMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 170, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-lg)', padding: 4, zIndex: 20 }}>
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortLabel(option);
                        setShowSortMenu(false);
                      }}
                      style={{
                        width: '100%',
                        minHeight: 32,
                        borderRadius: 'var(--r-sm)',
                        border: 'none',
                        background: sortLabel === option ? 'var(--sg-green-light)' : 'transparent',
                        color: sortLabel === option ? 'var(--sg-green-active)' : 'var(--text-secondary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: sortLabel === option ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{option}</span>
                      {sortLabel === option ? <Check size={12} strokeWidth={2.5} /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredGyms.length === 0 ? (
            <EmptyState
              icon={RotateCcw}
              title="No partner gyms found"
              description="Try adjusting your search terms, area, or clearing some of the active filter chips."
              actionLabel="Reset Filters"
              onAction={() => {
                setSearchQuery('');
                setActiveFilters(['Near Me']);
              }}
            />
          ) : (
            filteredGyms.map(gym => (
              <div
                key={gym.id}
                ref={node => {
                  cardRefs.current[gym.id] = node;
                }}
              >
                <GymCardCompact
                  gym={gym}
                  selected={selectedPin === gym.id || hoveredGym === gym.id}
                  onHover={() => setHoveredGym(gym.id)}
                  onLeave={() => setHoveredGym(null)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Map Panel */}
      <div
        className={`explore-map-panel ${mobileTab === 'list' ? 'hide-mobile' : ''}`}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '100%' }}
      >
        <div className="map-surface map-live-surface" style={{ width: '100%', height: '100%' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {showSearchArea && (
            <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 8 }}>
              <button
                onClick={() => {
                  if (!mapRef.current) {
                    return;
                  }

                  lastSearchedCenterRef.current = mapRef.current.getCenter().toArray();
                  setShowSearchArea(false);
                  const nearest = getNearestVisibleGym(lastSearchedCenterRef.current, visiblePins);
                  if (nearest) {
                    setSelectedPin(nearest.id);
                  }
                }}
                style={{ background: 'white', border: '1px solid var(--border-default)', borderRadius: 999, padding: '10px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 10px 26px rgba(15, 23, 42, 0.12)', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Search size={14} /> Search this area
              </button>
            </div>
          )}

          {selectedGym && previewAnchor && (
            <div
              style={{
                position: 'absolute',
                left: previewAnchor.x,
                top: previewAnchor.placeBelow ? previewAnchor.y + 18 : previewAnchor.y - 176,
                transform: 'translateX(-50%)',
                zIndex: 7,
              }}
            >
              <div
                style={{
                  width: 320,
                  background: 'white',
                  borderRadius: 22,
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 22px 48px rgba(15, 23, 42, 0.18)',
                  padding: 12,
                  display: 'grid',
                  gridTemplateColumns: '96px 1fr',
                  gap: 12,
                }}
              >
                <img src={selectedGym.image} alt={selectedGym.name} style={{ width: 96, height: 96, borderRadius: 16, objectFit: 'cover' }} />
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{selectedGym.name}</h4>
                      <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748B' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Star size={11} fill="#F59E0B" color="#F59E0B" /> {selectedGym.rating}
                        </span>
                        <span>{selectedGym.distance} km</span>
                        <span>{selectedGym.eta} min</span>
                      </div>
                    </div>
                    <span className={selectedGym.plans.includes('Active') ? 'badge badge-green' : 'badge badge-warning'}>
                      {selectedGym.plans.includes('Active') ? 'Included' : 'Upgrade'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, fontSize: 11 }}>
                    <span style={{ color: selectedGym.status === 'open' ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                      {selectedGym.status === 'open' ? `Open until ${selectedGym.closesAt}` : 'Closed'}
                    </span>
                    <span style={{ color: '#CBD5E1' }}>·</span>
                    <span style={{ color: selectedGym.crowd === 'low' ? '#16A34A' : selectedGym.crowd === 'moderate' ? '#D97706' : '#DC2626', fontWeight: 700 }}>
                      {selectedGym.crowd === 'low' ? 'Low crowd' : selectedGym.crowd}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate(`/member/gym/${selectedGym.id}`)} className="btn btn-dark btn-sm" style={{ flex: 1 }}>
                      View Gym
                    </button>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedGym.address)}`, '_blank', 'noopener,noreferrer')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Navigation size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: previewAnchor.placeBelow ? -18 : '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0,
                }}
              >
                <div style={{ width: 2, height: 16, background: 'rgba(34, 197, 94, 0.65)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--sg-green)', border: '2px solid white', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.28)' }} />
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', right: 18, bottom: 22, zIndex: 8 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.96)', border: '1px solid rgba(226, 232, 240, 0.95)', borderRadius: 18, boxShadow: '0 16px 30px rgba(15, 23, 42, 0.14)', padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['+', '-'].map(control => (
                <button
                  key={control}
                  onClick={() => {
                    if (!mapRef.current) {
                      return;
                    }

                    if (control === '+') {
                      mapRef.current.zoomIn({ duration: 220 });
                    } else {
                      mapRef.current.zoomOut({ duration: 220 });
                    }
                  }}
                  style={{ width: 44, height: 44, background: 'white', border: '1px solid var(--border-default)', borderRadius: 14, fontWeight: 800, fontSize: 18, cursor: 'pointer', color: 'var(--text-primary)' }}
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
                    duration: 420,
                  });
                  setSelectedPin(filteredGyms[0]?.id ?? null);
                  setHoveredGym(null);
                }}
                style={{ width: 44, height: 44, background: 'white', border: '1px solid var(--border-default)', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LocateFixed size={18} color="#2563EB" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
