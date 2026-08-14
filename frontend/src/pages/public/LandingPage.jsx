import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Shield,
  Dumbbell,
  QrCode,
  Activity,
  Flame,
  Building2,
  Compass,
  Award,
  Sparkles,
  Check,
  Navigation,
  Search,
} from 'lucide-react';
import { GYM_IMAGES, mockGyms, AREAS, ownerData } from '../../services/mockData';
import heroPhoneMockup from '../../assets/landing/silver-gym-hero-phone-mockup.webp';

const SHOW_LEGACY_HERO_VISUAL = false;

export default function LandingPage() {
  const [selectedArea, setSelectedArea] = useState('Mirpur');

  const featuredGyms = mockGyms.slice(0, 3);

  // Area data lookup
  const currentAreaInfo = AREAS.find(a => a.name === selectedArea) || AREAS[0];

  const areaGymSample = {
    Mirpur: [
      { name: 'Iron House Fitness', tier: 'Essential + Active', rating: 4.8, crowd: 'Low', dist: '0.7 km' },
      { name: 'PowerFit Mirpur', tier: 'Active + Unlimited', rating: 4.6, crowd: 'Low', dist: '0.9 km' },
      { name: 'Fitness Plus Mirpur 2', tier: 'Essential', rating: 4.5, crowd: 'Moderate', dist: '1.4 km' },
    ],
    Uttara: [
      { name: 'Apex Fitness Sector 4', tier: 'Active + Unlimited', rating: 4.9, crowd: 'Low', dist: '1.2 km' },
      { name: 'PowerZone Uttara 11', tier: 'Essential + Active', rating: 4.7, crowd: 'Moderate', dist: '2.0 km' },
      { name: 'Iron Core Sector 7', tier: 'Active', rating: 4.6, crowd: 'Low', dist: '2.5 km' },
    ],
    Gulshan: [
      { name: 'Block 35 Fitness', tier: 'Unlimited Premium', rating: 4.9, crowd: 'Moderate', dist: '0.8 km' },
      { name: 'Gulshan Club Fitness', tier: 'Unlimited Premium', rating: 4.8, crowd: 'Low', dist: '1.5 km' },
      { name: 'Elite Performance G-1', tier: 'Active + Unlimited', rating: 4.7, crowd: 'Moderate', dist: '2.1 km' },
    ],
    Banani: [
      { name: 'Urban Strength Banani', tier: 'Active + Unlimited', rating: 4.7, crowd: 'Busy', dist: '0.5 km' },
      { name: 'Road 11 Fitness Hub', tier: 'Essential + Active', rating: 4.6, crowd: 'Moderate', dist: '1.1 km' },
      { name: 'Banani DOHS Gym', tier: 'Active', rating: 4.8, crowd: 'Low', dist: '1.8 km' },
    ],
    Bashundhara: [
      { name: 'Block D Fitness Club', tier: 'Active + Unlimited', rating: 4.8, crowd: 'Low', dist: '1.0 km' },
      { name: 'Evergreen Gym R/A', tier: 'Essential + Active', rating: 4.6, crowd: 'Moderate', dist: '1.6 km' },
      { name: 'Titan Strength Zone', tier: 'Unlimited', rating: 4.9, crowd: 'Low', dist: '2.2 km' },
    ],
    Dhanmondi: [
      { name: 'Dhanmondi 27 Fitness', tier: 'Active + Unlimited', rating: 4.8, crowd: 'Moderate', dist: '0.9 km' },
      { name: 'Pulse Gym Road 8', tier: 'Essential + Active', rating: 4.7, crowd: 'Low', dist: '1.4 km' },
      { name: 'Lakeside Fitness Club', tier: 'Active', rating: 4.5, crowd: 'Moderate', dist: '2.0 km' },
    ],
    Badda: [
      { name: 'Progoti Strength Badda', tier: 'Essential', rating: 4.5, crowd: 'Low', dist: '0.8 km' },
      { name: 'Link Road Power Gym', tier: 'Essential + Active', rating: 4.6, crowd: 'Moderate', dist: '1.3 km' },
    ],
    Mohammadpur: [
      { name: 'Ring Road Fitness Hub', tier: 'Active + Unlimited', rating: 4.7, crowd: 'Low', dist: '1.1 km' },
      { name: 'Japan Garden City Gym', tier: 'Essential + Active', rating: 4.6, crowd: 'Moderate', dist: '1.5 km' },
    ],
  };

  const crowdColors = {
    low: { bg: 'rgba(34, 197, 94, 0.12)', text: '#16A34A', border: 'rgba(34, 197, 94, 0.3)' },
    moderate: { bg: 'rgba(245, 158, 11, 0.12)', text: '#D97706', border: 'rgba(245, 158, 11, 0.3)' },
    busy: { bg: 'rgba(239, 68, 68, 0.12)', text: '#DC2626', border: 'rgba(239, 68, 68, 0.3)' },
  };

  return (
    <div className="landing-page anim-fade" style={{ color: 'var(--text-primary)' }}>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. HERO SECTION (Expanded, 740px+ Height, Layered Interactive Composition)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: '760px',
          background: 'radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.08) 0%, transparent 45%), radial-gradient(circle at 10% 85%, rgba(15, 23, 42, 0.04) 0%, transparent 50%), linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          paddingTop: 'var(--sp-12)',
          paddingBottom: 'var(--sp-16)',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '44% 56%',
              gap: 'var(--sp-12)',
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            {/* Left Content Column */}
            <div style={{ maxWidth: '560px', position: 'relative', zIndex: 3 }}>
              {/* Eyebrow badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  padding: '6px 14px',
                  borderRadius: 'var(--r-full)',
                  marginBottom: 'var(--sp-6)',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sg-green)', boxShadow: '0 0 8px var(--sg-green)' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sg-green-active)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Dhaka's Unified Fitness Pass
                </span>
              </div>

              {/* Main Headline (64-70px bold) */}
              <h1
                className="hero-title"
                style={{
                  fontSize: 'clamp(3rem, 4.2vw, 4.35rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.026em',
                  lineHeight: 1.08,
                  marginBottom: 'var(--sp-6)',
                  color: '#0F172A',
                }}
              >
                <span style={{ display: 'block' }}>One</span>
                <span style={{ display: 'block' }}>membership.</span>
                <span className="hero-title-nowrap" style={{ display: 'block', whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                      marginRight: '0.12em',
                    }}
                  >
                    Every gym
                  </span>
                  you
                </span>
                <span style={{ display: 'block' }}>need.</span>
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '1.15rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: 'var(--sp-8)',
                  maxWidth: '490px',
                }}
              >
                Unlock 120+ verified partner gyms across Dhaka with one digital Silver GYM membership. Train near home in Mirpur, near work in Banani, or on weekends in Gulshan.
              </p>

              {/* Primary & Secondary CTAs */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: 'var(--sp-8)' }}>
                <Link
                  to="/member/explore"
                  className="btn btn-primary btn-lg"
                  style={{
                  padding: '0.9rem 1.85rem',
                  fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 'var(--r-lg)',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Find Gyms Near You
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/#plans"
                  className="btn btn-secondary btn-lg"
                  style={{
                    padding: '0.9rem 1.65rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                  borderRadius: 'var(--r-lg)',
                  background: 'white',
                  border: '1.5px solid #CBD5E1',
                    color: '#1E293B',
                  }}
                >
                  Compare Plans
                </Link>
              </div>

              {/* Trust Indicators */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  paddingTop: 'var(--sp-4)',
                  borderTop: '1px solid #E2E8F0',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>4.8 / 5</span>
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>(2,400+ reviews)</span>
                </div>
                <span style={{ width: 4, height: 4, background: '#CBD5E1', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
                  <strong style={{ color: '#0F172A' }}>100%</strong> Digital Pass
                </span>
                <span style={{ width: 4, height: 4, background: '#CBD5E1', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
                  No Long-Term Contracts
                </span>
              </div>
            </div>

            {/* Right Layered Interactive Visual Composition */}
            <div style={{ position: 'relative', height: '580px', width: '100%', isolation: 'isolate' }} className="hero-visual-col">
              <div
                style={{
                  position: 'absolute',
                  inset: '-24% -14% -18% -18%',
                  zIndex: 0,
                  background:
                    'radial-gradient(circle at 52% 48%, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.07) 36%, transparent 72%)',
                  filter: 'blur(42px)',
                  pointerEvents: 'none',
                }}
              />
              <img
                src={heroPhoneMockup}
                alt="Silver GYM mobile app preview"
                style={{
                  position: 'absolute',
                  inset: '-74px -42px -80px -18px',
                  zIndex: 1,
                  width: 'calc(100% + 74px)',
                  height: 'calc(100% + 154px)',
                  objectFit: 'contain',
                  objectPosition: '58% 52%',
                  opacity: 1,
                  filter: 'drop-shadow(0 30px 36px rgba(15, 23, 42, 0.22))',
                  pointerEvents: 'none',
                }}
              />
              {SHOW_LEGACY_HERO_VISUAL && (
              <>
              {/* Main Base Card: Interactive Dhaka Map Simulation */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: '#0F172A',
                  boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Map imagery with modern overlay */}
                <img
                  src={GYM_IMAGES.hero}
                  alt="Dhaka Fitness Network Map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.88,
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                />

                {/* Map Grid & Road Overlay Effect */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.05) 50%, rgba(15, 23, 42, 0.5) 100%)',
                  }}
                />

                {/* Top Left Floating Search Pill */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 14px',
                    borderRadius: 'var(--r-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    zIndex: 5,
                  }}
                >
                  <Search size={14} color="#16A34A" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                    Dhaka · 124 Gyms Live
                  </span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                </div>

                {/* Interactive Map Pins with tooltips */}
                {/* Pin 1: Mirpur Active Pin */}
                <div style={{ position: 'absolute', left: '38%', top: '48%', zIndex: 10 }}>
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'rgba(34, 197, 94, 0.3)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#16A34A',
                        border: '3px solid white',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 900,
                        fontSize: 12,
                      }}
                    >
                      SG
                    </div>
                  </div>
                </div>

                {/* Pin 2: Banani */}
                <div style={{ position: 'absolute', left: '66%', top: '34%', zIndex: 8 }}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 14,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                    Banani · Urban Strength
                  </div>
                </div>

                {/* Pin 3: Gulshan */}
                <div style={{ position: 'absolute', left: '74%', top: '56%', zIndex: 8 }}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 14,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6' }} />
                    Gulshan · Block 35
                  </div>
                </div>

                {/* Pin 4: Uttara */}
                <div style={{ position: 'absolute', left: '50%', top: '16%', zIndex: 8 }}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 14,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                    Uttara · Apex Gym
                  </div>
                </div>
              </div>

              {/* Layer 1: Floating Selected Gym Card (Bottom Left / Center) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 18,
                  left: 18,
                  right: 18,
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.9)',
                  display: 'grid',
                  gridTemplateColumns: '74px 1fr auto',
                  gap: 14,
                  alignItems: 'center',
                  zIndex: 20,
                }}
              >
                <div style={{ position: 'relative', width: 74, height: 74, borderRadius: 12, overflow: 'hidden' }}>
                  <img
                    src={mockGyms[0].image}
                    alt="Iron House Fitness"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      background: '#16A34A',
                      color: 'white',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: 4,
                    }}
                  >
                    OPEN
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                      Iron House Fitness
                    </span>
                    <CheckCircle2 size={15} color="#16A34A" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginLeft: 4 }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" /> 4.8
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: '#64748B', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} color="#16A34A" /> Mirpur 10 · 0.7 km (8 min)
                    </span>
                    <span>•</span>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>
                      ● Low Crowd (28%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#15803D',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Check size={11} /> Included in Active Plan
                    </span>
                  </div>
                </div>

                <Link
                  to={`/member/gym/${mockGyms[0].id}`}
                  style={{
                    padding: '8px 14px',
                    background: '#0F172A',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  View Gym <ChevronRight size={14} />
                </Link>
              </div>

              {/* Layer 2: Floating Silver GYM Digital Pass Mockup (Top Right) */}
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  right: -16,
                  width: '230px',
                  background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '18px',
                  padding: '16px',
                  boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  zIndex: 25,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                      Silver GYM Digital Pass
                    </span>
                    <p style={{ margin: '2px 0 0', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
                      Alex Rahman
                    </p>
                  </div>
                  <span
                    style={{
                      background: '#16A34A',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 12,
                      letterSpacing: '0.04em',
                    }}
                  >
                    ACTIVE
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Plan: <strong style={{ color: 'white' }}>Active Pass</strong></div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#22C55E' }}>SG-2048-DA</div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94A3B8', marginBottom: 4 }}>
                    <span>Monthly Visits</span>
                    <strong style={{ color: 'white' }}>12 / 15 Used</strong>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '80%', background: '#22C55E', borderRadius: 2 }} />
                  </div>
                </div>

                {/* QR preview thumbnail */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 28, height: 28, background: 'white', borderRadius: 5, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={22} color="#0F172A" />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94A3B8', lineHeight: 1.3 }}>
                    Dynamic QR Ready<br />
                    <span style={{ color: '#22C55E', fontWeight: 600 }}>Tap to Check In</span>
                  </div>
                </div>
              </div>

              {/* Layer 3: Floating Status Toast Pill (Middle Left) */}
              <div
                style={{
                  position: 'absolute',
                  top: '36%',
                  left: -14,
                  background: 'white',
                  borderRadius: '14px',
                  padding: '9px 14px',
                  boxShadow: '0 12px 25px -4px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  zIndex: 22,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={16} color="#16A34A" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                    Access Granted
                  </p>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748B' }}>
                    Scan QR at gym reception
                  </p>
                </div>
              </div>
              </>
              )}
            </div>
          </div>
        </div>

        {/* Responsive CSS for Hero */}
        <style>{`
          @media (max-width: 960px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
            }
            .hero-visual-col {
              height: 480px !important;
            }
          }
          @media (max-width: 600px) {
            .hero-title {
              font-size: clamp(2.35rem, 14vw, 3.1rem) !important;
              line-height: 1.08 !important;
            }
            .hero-title-nowrap {
              white-space: normal !important;
            }
            .hero-visual-col {
              display: none !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          2. COMPACT PREMIUM TRUST STRIP (Consistent silver/slate background)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
          padding: 'var(--sp-8) 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--sp-4)',
              alignItems: 'center',
            }}
            className="trust-strip-grid"
          >
            {[
              { number: '120+', label: 'Partner Gyms', desc: 'Verified facilities across Dhaka', icon: Building2, color: '#16A34A' },
              { number: '10,000+', label: 'Monthly Check-ins', desc: 'Active & satisfied members', icon: Activity, color: '#3B82F6' },
              { number: '8+ Areas', label: 'Dhaka Coverage', desc: 'Mirpur, Banani, Gulshan & more', icon: MapPin, color: '#8B5CF6' },
              { number: '4.8 ★', label: 'Member Rating', desc: 'Over 2,400+ authentic reviews', icon: Star, color: '#F59E0B' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 20px',
                    borderRight: i < 3 ? '1px solid #E2E8F0' : 'none',
                  }}
                  className="trust-stat-item"
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={25} color={stat.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.7rem',
                        fontWeight: 900,
                        color: '#0F172A',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {stat.number}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {stat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .trust-strip-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 1.5rem !important;
            }
            .trust-stat-item {
              border-right: none !important;
            }
          }
          @media (max-width: 480px) {
            .trust-strip-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          3. HOW SILVER GYM WORKS (Rich Product Visuals for 4 Steps)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{ padding: 'var(--sp-24) 0', background: '#FAFAF9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '4px 12px',
                borderRadius: 'var(--r-full)',
                color: 'var(--sg-green-active)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--sp-3)',
              }}
            >
              <Sparkles size={13} /> Product Workflow
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A' }}>
              Your pass. A simpler way to train.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '560px', margin: '0.5rem auto 0' }}>
              No tedious paper forms, no lock-in contracts per gym. Start training across Dhaka in 4 frictionless steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--sp-6)',
            }}
            className="how-steps-grid"
          >
            {/* Step 1: Choose Plan */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Step Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: 8 }}>
                  STEP 01
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>Flexible Visits</span>
              </div>

              {/* Mini Visual Preview: Plan selector */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: 'var(--sp-5)',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>Active Plan</span>
                  <span style={{ background: '#22C55E', color: 'white', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>POPULAR</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: 6 }}>
                  ৳3,490 <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>/month</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={12} color="#16A34A" /> 15 visits · 120+ Gyms
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                Choose Your Plan
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55 }}>
                Select Essential, Active, or Unlimited depending on your weekly schedule. Cancel or pause anytime.
              </p>
            </div>

            {/* Step 2: Find Gym */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: 8 }}>
                  STEP 02
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6' }}>Live Map Radar</span>
              </div>

              {/* Mini Visual: Map Search Radar */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #334155',
                  marginBottom: 'var(--sp-5)',
                  minHeight: '140px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#94A3B8' }}>
                  <Compass size={13} color="#22C55E" /> Nearby Mirpur (8 Gyms)
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'white' }}>Iron House Fitness</div>
                  <div style={{ fontSize: '0.68rem', color: '#22C55E', fontWeight: 600 }}>0.7 km · Low crowd · Open</div>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Filtering by your current GPS location</div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                Find a Gym Nearby
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55 }}>
                Filter gyms by area, live crowd density, travel time, or equipment like power racks, saunas, and pools.
              </p>
            </div>

            {/* Step 3: Scan / Show Pass */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: 8 }}>
                  STEP 03
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B5CF6' }}>30s QR Pass</span>
              </div>

              {/* Mini Visual: QR scan */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2F6 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: 'var(--sp-5)',
                  minHeight: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <div style={{ width: 62, height: 62, background: 'white', borderRadius: 8, padding: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={50} color="#0F172A" />
                </div>
                <div>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#15803D', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>
                    VERIFIED
                  </span>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>Instant Entry</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Refreshes live</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                Scan or Show Pass
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55 }}>
                Show your dynamic Silver GYM digital pass at the front desk. The reception scans and you are inside in 5 seconds.
              </p>
            </div>

            {/* Step 4: Workout Anywhere */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', background: '#0F172A', padding: '3px 10px', borderRadius: 8 }}>
                  STEP 04
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>Total Freedom</span>
              </div>

              {/* Mini Visual: Multi-area badges */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #162C22 100%)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #1F3A2B',
                  marginBottom: 'var(--sp-5)',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(34, 197, 94, 0.25)', color: '#4ADE80', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                    ✓ Mirpur
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                    ✓ Banani
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
                    ✓ Gulshan
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'white', marginTop: 4 }}>
                  Zero New Contracts
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                  All 120+ gym doors open to you
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                Workout Anywhere
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.55 }}>
                Switch locations whenever your daily schedule changes. Your single Silver GYM membership travels with you.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .how-steps-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .how-steps-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          4. CITY COVERAGE (Interactive Area Selector + Highlighted Dhaka Map)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section id="areas" style={{ padding: 'var(--sp-24) 0', background: 'white', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '48% 52%', gap: 'var(--sp-12)', alignItems: 'center' }} className="coverage-grid">
            {/* Left side: Interactive Area list */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '4px 12px',
                  borderRadius: 'var(--r-full)',
                  color: 'var(--sg-green-active)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 'var(--sp-3)',
                }}
              >
                <MapPin size={13} /> Dhaka City Coverage
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A', marginBottom: 'var(--sp-4)' }}>
                Train wherever<br />Dhaka takes you.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.65, marginBottom: 'var(--sp-6)' }}>
                Silver GYM partner facilities are strategically positioned across 8+ major hubs. Select an area below to inspect partner density and featured gyms:
              </p>

              {/* Area buttons grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: 'var(--sp-8)' }}>
                {AREAS.map(area => {
                  const isSelected = selectedArea === area.name;
                  return (
                    <button
                      key={area.name}
                      onClick={() => setSelectedArea(area.name)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: isSelected ? 'rgba(34, 197, 94, 0.08)' : '#F8FAFC',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #16A34A' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: isSelected ? '#16A34A' : '#94A3B8',
                          }}
                        />
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? '#0F172A' : '#334155' }}>
                          {area.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: isSelected ? '#16A34A' : '#64748B',
                          background: isSelected ? 'white' : 'transparent',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {area.gyms} gyms
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/member/explore" className="btn btn-dark btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Explore All {selectedArea} Gyms <ArrowRight size={16} />
                </Link>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Total: <strong>124 gyms active today</strong>
                </span>
              </div>
            </div>

            {/* Right side: Interactive Dhaka Coverage Map */}
            <div
              style={{
                position: 'relative',
                height: '520px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.15)',
                border: '1px solid #CBD5E1',
                background: '#0F172A',
              }}
            >
              <img
                src={GYM_IMAGES.hero}
                alt="Dhaka Coverage Map"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />

              {/* Area Highlight Overlay Banner */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  right: 16,
                  background: 'rgba(15, 23, 42, 0.92)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#22C55E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Selected Zone
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
                    {selectedArea} Hub
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: '#16A34A',
                      color: 'white',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    {currentAreaInfo?.gyms || 20} Partner Gyms
                  </span>
                </div>
              </div>

              {/* Sample Gyms in Selected Area Floating Card (Bottom) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                  zIndex: 10,
                }}
              >
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                  Top Partner Gyms in {selectedArea}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(areaGymSample[selectedArea] || areaGymSample['Mirpur']).slice(0, 3).map((g, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 8px',
                        background: '#F8FAFC',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{g.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem' }}>
                        <span style={{ color: '#64748B' }}>{g.dist}</span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>★ {g.rating}</span>
                        <span style={{ background: '#E2E8F0', padding: '1px 6px', borderRadius: 4, color: '#334155', fontWeight: 600 }}>
                          {g.tier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .coverage-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          5. FEATURED GYMS (Airbnb / ClassPass Marketplace Listing Style)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-12)' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '4px 12px',
                  borderRadius: 'var(--r-full)',
                  color: 'var(--sg-green-active)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 'var(--sp-3)',
                }}
              >
                <Dumbbell size={13} /> Verified Facilities
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A' }}>
                Discover your next workout spot
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#64748B', marginTop: '0.35rem' }}>
                Every gym is inspected for clean equipment, certified trainers, and smooth QR check-in.
              </p>
            </div>
            <Link
              to="/member/explore"
              className="btn btn-secondary hide-mobile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 700,
                padding: '0.75rem 1.4rem',
                borderRadius: '12px',
                background: 'white',
              }}
            >
              Browse All 120+ Gyms <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--sp-8)',
            }}
            className="featured-gyms-grid"
          >
            {featuredGyms.map(gym => {
              const crowd = crowdColors[gym.crowd] || crowdColors.low;
              return (
                <div
                  key={gym.id}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  className="card-hover"
                >
                  {/* Gym Photo Banner */}
                  <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={gym.image}
                      alt={gym.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                      <span
                        style={{
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: 'white',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '4px 9px',
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Shield size={12} color="#22C55E" /> Verified
                      </span>
                    </div>

                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <div
                        style={{
                          background: 'white',
                          padding: '4px 9px',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          color: '#0F172A',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Star size={13} fill="#F59E0B" color="#F59E0B" /> {gym.rating}
                        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 500 }}>({gym.reviewCount})</span>
                      </div>
                    </div>

                    {/* Bottom Plan Inclusion Badge */}
                    <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                      <span
                        style={{
                          background: '#16A34A',
                          color: 'white',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: 6,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        Included in Active & Unlimited
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {gym.name}
                      </h3>
                    </div>

                    {/* Distance & Travel time */}
                    <p style={{ fontSize: '0.86rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
                      <MapPin size={14} color="#16A34A" /> {gym.area} · <strong>{gym.distance} km</strong> ({gym.eta} min travel)
                    </p>

                    {/* Live Crowd & Open status */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: '#F8FAFC',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0',
                        marginBottom: 'var(--sp-4)',
                        fontSize: '0.78rem',
                      }}
                    >
                      <span style={{ color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> Open · Closes {gym.closesAt}
                      </span>
                      <span
                        style={{
                          background: crowd.bg,
                          color: crowd.text,
                          border: `1px solid ${crowd.border}`,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                        }}
                      >
                        ● {gym.crowd.charAt(0).toUpperCase() + gym.crowd.slice(1)} Crowd ({gym.crowdPct}%)
                      </span>
                    </div>

                    {/* Amenity tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-6)' }}>
                      {gym.amenities.slice(0, 4).map(a => (
                        <span
                          key={a}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: '#F1F5F9',
                            color: '#475569',
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {a}
                        </span>
                      ))}
                      {gym.amenities.length > 4 && (
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', padding: '3px 4px' }}>
                          +{gym.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 'auto' }}>
                      <Link
                        to={`/member/gym/${gym.id}`}
                        className="btn btn-secondary btn-full"
                        style={{
                          fontWeight: 700,
                          borderRadius: 10,
                          background: '#0F172A',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        View Gym Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .featured-gyms-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          6. "YOUR MEMBERSHIP MOVES WITH YOU" (Lifestyle Narrative Route Timeline)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: 'var(--sp-24) 0',
          background: '#0F172A',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '4px 14px',
              borderRadius: 'var(--r-full)',
              color: '#4ADE80',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--sp-3)',
            }}
          >
            <Navigation size={13} /> The Silver GYM Lifestyle
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.025em', marginBottom: 'var(--sp-4)' }}>
            Train across Dhaka without switching plans.
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto var(--sp-16)' }}>
            <strong style={{ color: '#22C55E' }}>Three neighborhoods. One digital pass. Zero duplicate fees.</strong><br />
            Train wherever your day takes you across Dhaka without paying double.
          </p>

          {/* Connected Timeline Route Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--sp-8)',
              position: 'relative',
            }}
            className="lifestyle-grid"
          >
            {[
              {
                time: '7:00 AM',
                phase: 'Morning · Near Home',
                location: 'Mirpur 10',
                gym: 'Iron House Fitness',
                activity: 'Heavy Strength & Functional Training',
                perk: 'Included in Active Pass',
                image: GYM_IMAGES.ironHouse,
                badgeColor: '#16A34A',
              },
              {
                time: '6:30 PM',
                phase: 'After Work · Near Office',
                location: 'Banani Road 11',
                gym: 'Urban Strength',
                activity: 'HIIT, Cardio & De-stress Session',
                perk: 'Same Membership Pass',
                image: GYM_IMAGES.urbanFit,
                badgeColor: '#3B82F6',
              },
              {
                time: '10:00 AM',
                phase: 'Weekend · Leisure & Spa',
                location: 'Gulshan 2',
                gym: 'Block 35 Fitness',
                activity: 'Pool, Sauna & Full Recovery',
                perk: 'No Extra Registration',
                image: GYM_IMAGES.block35,
                badgeColor: '#8B5CF6',
              },
            ].map((scene) => (
              <div
                key={scene.gym}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image Header with Time Badge */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={scene.image}
                    alt={scene.gym}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#22C55E',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    {scene.time}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: 'rgba(0,0,0,0.6)',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {scene.phase}
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: 'var(--sp-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
                    {scene.gym}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8', fontSize: '0.85rem', marginBottom: 12 }}>
                    <MapPin size={13} color="#22C55E" /> {scene.location}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: 16 }}>
                    {scene.activity}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#4ADE80',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <CheckCircle2 size={14} /> {scene.perk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .lifestyle-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          7. NEW SECTION: MISSING MEMBER EXPERIENCE PREVIEW (Product UI Proof)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: '#FAFAF9', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '4px 12px',
                borderRadius: 'var(--r-full)',
                color: 'var(--sg-green-active)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--sp-3)',
              }}
            >
              <Activity size={13} /> Member App Experience
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A' }}>
              Know more before every workout.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Designed for speed on any mobile phone or browser. Instant check-ins, live crowd checks, and workout streak logging.
            </p>
          </div>

          {/* 4 Feature cards showing real product previews */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--sp-6)',
            }}
            className="experience-grid"
          >
            {/* Card 1: Nearby Radar */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                <MapPin size={22} color="#16A34A" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Nearby Gym Radar
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
                See exact distance, travel ETA in Dhaka traffic, and open hours before you leave home or office.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                Live GPS sorting active
              </div>
            </div>

            {/* Card 2: 30s Dynamic QR Check-in */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                <QrCode size={22} color="#3B82F6" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Instant QR Check-in
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
                Zero waiting at reception. Show your rotating QR code or scan the front desk scanner for 1-tap admission.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} />
                Refreshes every 30 seconds
              </div>
            </div>

            {/* Card 3: Live Crowd Monitor */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                <Users size={22} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Live Crowd Meter
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
                Know when bench presses and squat racks are free. Real-time low, moderate, and busy occupancy tags.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} />
                Updated every 5 minutes
              </div>
            </div>

            {/* Card 4: Streaks & Visit Counter */}
            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-6)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
                <Flame size={22} color="#EF4444" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                Activity & Streaks
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, marginBottom: 12 }}>
                Automatically logs workout dates, duration, gyms visited, and unlocks consistency achievement badges.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={12} />
                Earn monthly rewards
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .experience-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .experience-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          8. PRICING SECTION (Elevated Active Card, Structured Rows, High Clarity)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section id="plans" style={{ padding: 'var(--sp-24) 0', background: 'white', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '4px 12px',
                borderRadius: 'var(--r-full)',
                color: 'var(--sg-green-active)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--sp-3)',
              }}
            >
              <Shield size={13} /> Transparent Memberships
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A' }}>
              Flexible plans for every training rhythm
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '520px', margin: '0.5rem auto 0' }}>
              No admission fees. No long-term lock-in. Upgrade, downgrade, or pause anytime in 1 tap.
            </p>
          </div>

          {/* Pricing Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--sp-8)',
              alignItems: 'center',
              maxWidth: '1240px',
              margin: '0 auto',
            }}
            className="pricing-grid"
          >
            {/* 1. Essential Plan */}
            <div
              style={{
                background: 'white',
                borderRadius: '22px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: 'var(--sp-6)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Casual & Students
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 12px' }}>
                  Essential
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                    ৳1,990
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#64748B' }}>/month</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                  Ideal for 2 workouts per week near home.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> <strong>8 Visits</strong> / month
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> Essential Tier Gyms
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> Instant QR Check-in
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> Basic Activity Tracking
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#94A3B8' }}>
                    <span style={{ width: 17, height: 17, border: '1.5px solid #CBD5E1', borderRadius: '50%', display: 'inline-block' }} /> Premium Gyms (Gulshan/Banani)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#94A3B8' }}>
                    <span style={{ width: 17, height: 17, border: '1.5px solid #CBD5E1', borderRadius: '50%', display: 'inline-block' }} /> Membership Freeze
                  </li>
                </ul>
              </div>

              <Link to="/join" className="btn btn-secondary btn-full btn-lg" style={{ fontWeight: 700, borderRadius: 12 }}>
                Get Essential Pass
              </Link>
            </div>

            {/* 2. Active Plan (ELEVATED 10%, RECOMMENDED, MOST POPULAR) */}
            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                border: '2.5px solid #16A34A',
                padding: 'var(--sp-12) var(--sp-8) var(--sp-10)',
                boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: 'scale(1.05)',
                zIndex: 10,
              }}
            >
              {/* Most popular badge */}
              <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#16A34A',
                    color: 'white',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    padding: '7px 18px',
                    borderRadius: 'var(--r-full)',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                    letterSpacing: '0.06em',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ★ MOST POPULAR CHOICE
                </span>
              </div>

              <div style={{ marginBottom: 'var(--sp-6)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Best For Regular Fitness
                </span>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 12px' }}>
                  Active Pass
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                    ৳3,490
                  </span>
                  <span style={{ fontSize: '1rem', color: '#64748B' }}>/month</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: 4 }}>
                  Train ~4 days/week across home & office locations.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#16A34A" /> <strong>15 Visits</strong> / month
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#16A34A" /> Essential + Active Tier Gyms
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A' }}>
                    <CheckCircle2 size={18} color="#16A34A" /> Instant QR & Pass Scanner
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A' }}>
                    <CheckCircle2 size={18} color="#16A34A" /> Full Streak & Habit Analytics
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A' }}>
                    <CheckCircle2 size={18} color="#16A34A" /> Plan Freeze (1x / year free)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: '#0F172A' }}>
                    <CheckCircle2 size={18} color="#16A34A" /> Priority WhatsApp Support
                  </li>
                </ul>
              </div>

              <Link
                to="/join"
                className="btn btn-primary btn-full btn-lg"
                style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  borderRadius: 14,
                  boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                  padding: '0.9rem',
                }}
              >
                Join with Active Pass <ArrowRight size={18} />
              </Link>
            </div>

            {/* 3. Unlimited Plan */}
            <div
              style={{
                background: 'white',
                borderRadius: '22px',
                border: '1px solid #E2E8F0',
                padding: 'var(--sp-8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: 'var(--sp-6)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  All-Access & Premium
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 12px' }}>
                  Unlimited
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                    ৳5,990
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#64748B' }}>/month</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                  Unrestricted access to all 120+ premium facilities.
                </p>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 'var(--sp-6)', marginBottom: 'var(--sp-8)' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> <strong>Unlimited Visits</strong> (Daily)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> All Tiers (Essential, Active, Premium)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> Pool & Sauna Access Included
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> Unlimited Free Plan Freezes
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> 1 Guest Pass / month
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#334155' }}>
                    <CheckCircle2 size={17} color="#16A34A" /> 24/7 VIP Concierge Support
                  </li>
                </ul>
              </div>

              <Link to="/join" className="btn btn-secondary btn-full btn-lg" style={{ fontWeight: 700, borderRadius: 12 }}>
                Get Unlimited Pass
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .pricing-grid {
              grid-template-columns: 1fr !important;
              max-width: 480px !important;
            }
            .pricing-grid > div:nth-child(2) {
              transform: none !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          9. GYM OWNER CTA (Expanded Layout with Mini Owner Dashboard Preview)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: '28px',
              padding: 'var(--sp-16) var(--sp-12)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'var(--sp-12)',
              alignItems: 'center',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            className="owner-cta-grid"
          >
            {/* Left Copy */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(34, 197, 94, 0.15)',
                  padding: '4px 12px',
                  borderRadius: 'var(--r-full)',
                  color: '#4ADE80',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 'var(--sp-4)',
                }}
              >
                <Building2 size={13} /> Partner Network
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.2vw, 2.75rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.025em', marginBottom: 'var(--sp-5)' }}>
                Grow your gym with Silver GYM.
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '1.1rem', lineHeight: 1.65, marginBottom: 'var(--sp-8)' }}>
                Monetize empty off-peak hours, acquire high-value members without ad spend, and receive guaranteed monthly payouts via automated digital check-ins.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
                {[
                  'Fill 11 AM – 4 PM off-peak capacity',
                  '100% verified QR check-ins',
                  'Guaranteed monthly bKash/Bank payout',
                  'Free partner management dashboard',
                  'Zero POS hardware or setup costs',
                  'Keep 100% of your private members',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E2E8F0', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/for-gyms"
                  className="btn btn-primary btn-lg"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                  }}
                >
                  Become a Partner Gym <ArrowRight size={16} />
                </Link>
                <Link
                  to="/partner"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    color: 'white',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Partner Login
                </Link>
              </div>
            </div>

            {/* Right Mini Owner Dashboard Preview */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: 'var(--sp-6)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                color: 'white',
              }}
            >
              {/* Dashboard Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'var(--sp-4)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Partner Dashboard
                  </span>
                  <p style={{ margin: '2px 0 0', fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>
                    Iron House Fitness
                  </p>
                </div>
                <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6 }}>
                  ● LIVE
                </span>
              </div>

              {/* 2x2 Metric Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: 'var(--sp-5)' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Check-ins Today</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', marginTop: 2 }}>
                    {ownerData.todayCheckins} <span style={{ fontSize: '0.7rem', color: '#22C55E', fontWeight: 700 }}>+18%</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 12, padding: '10px 14px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Est. Payout (Aug)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#22C55E', marginTop: 2 }}>
                    ৳42,600
                  </div>
                </div>
              </div>

              {/* Peak Hour Occupancy Bar Preview */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: '12px', marginBottom: 'var(--sp-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: 6 }}>
                  <span>Off-Peak Utilization (11 AM – 4 PM)</span>
                  <strong style={{ color: '#22C55E' }}>76% filled</strong>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '76%', background: 'linear-gradient(90deg, #16A34A, #22C55E)', borderRadius: 3 }} />
                </div>
              </div>

              {/* Live Visitor Feed */}
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                Recent Verified Check-ins
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ownerData.recentCheckins.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 8,
                      fontSize: '0.78rem',
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: 600 }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem' }}>
                      <span style={{ color: '#94A3B8' }}>{item.time}</span>
                      <span style={{ background: '#16A34A', color: 'white', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.65rem' }}>
                        APPROVED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .owner-cta-grid {
              grid-template-columns: 1fr !important;
              padding: 2.5rem 1.5rem !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          10. TESTIMONIALS (3 High-Impact Real Stories: 2 Members, 1 Gym Owner)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'var(--sp-24) 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-16)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '4px 12px',
                borderRadius: 'var(--r-full)',
                color: 'var(--sg-green-active)',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--sp-3)',
              }}
            >
              <Star size={13} /> Verified Reviews
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#0F172A' }}>
              Real members. Real workouts.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '540px', margin: '0.5rem auto 0' }}>
              See why over 10,000 Dhaka fitness enthusiasts rely on Silver GYM every single week.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--sp-8)',
            }}
            className="testimonials-grid"
          >
            {[
              {
                name: 'Tanvir Ahmed',
                title: 'Software Engineer',
                location: 'Mirpur & Gulshan',
                plan: 'Active Pass',
                quote: 'I live in Mirpur 10 and work in Gulshan 2. Before Silver GYM, I had to pay for two gym memberships or skip workouts because of traffic. Now I just train near wherever I am. One pass, zero excuses.',
                rating: 5,
                verified: 'Verified Member',
              },
              {
                name: 'Nadia Chowdhury',
                title: 'University Student',
                location: 'Banani & Uttara',
                plan: 'Essential Pass',
                quote: 'As a student, traditional gyms demanded 6-month contracts with hefty admission fees. With Silver GYM, I have the flexibility to pause during exams and train near both home and campus on a student budget.',
                rating: 5,
                verified: 'Verified Member',
              },
              {
                name: 'Imran Kabir',
                title: 'Managing Director',
                location: 'Iron House Fitness · Mirpur',
                plan: 'Partner Gym Owner',
                quote: 'Silver GYM solved our biggest headache: dead capacity during 11 AM to 4 PM. We now get 30+ verified visitors daily without spending on marketing, and payouts arrive punctually every single month.',
                rating: 5,
                verified: 'Verified Gym Partner',
              },
            ].map(t => (
              <div
                key={t.name}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: 'var(--sp-8)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                }}
              >
                {/* Rating Stars & Plan Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span
                    style={{
                      background: t.plan === 'Partner Gym Owner' ? '#0F172A' : 'rgba(34, 197, 94, 0.15)',
                      color: t.plan === 'Partner Gym Owner' ? 'white' : '#15803D',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {t.plan}
                  </span>
                </div>

                {/* Quote */}
                <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 'var(--sp-6)', flex: 1, fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 'var(--sp-4)', borderTop: '1px solid #E2E8F0' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: '#0F172A',
                      color: '#22C55E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {t.name}
                      <CheckCircle2 size={14} color="#16A34A" />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      {t.title} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .testimonials-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          11. FINAL CTA (Full-Width Conversion with Subtle Silver→Green Glow)
          ══════════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: 'var(--sp-24) 0',
          background: 'linear-gradient(135deg, #0F172A 0%, #12271D 50%, #080B10 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '4px 14px',
              borderRadius: 'var(--r-full)',
              color: '#4ADE80',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--sp-4)',
            }}
          >
            <Sparkles size={14} /> Start Training Today
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 'var(--sp-5)',
            }}
          >
            Ready to train anywhere in <span style={{ color: '#22C55E' }}>Dhaka</span>?
          </h2>

          <p
            style={{
              fontSize: '1.2rem',
              color: '#CBD5E1',
              maxWidth: '580px',
              margin: '0 auto var(--sp-8)',
              lineHeight: 1.6,
            }}
          >
            Join 10,000+ members already moving freely between 120+ top fitness facilities across the capital.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--sp-10)' }}>
            <Link
              to="/join"
              className="btn btn-primary btn-xl"
              style={{
                padding: '1rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                borderRadius: '14px',
                boxShadow: '0 6px 25px rgba(34, 197, 94, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Start Your Silver GYM Pass <ArrowRight size={18} />
            </Link>
            <Link
              to="/member/explore"
              className="btn btn-secondary btn-xl"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              Explore Gym Locations
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.75rem',
              flexWrap: 'wrap',
              fontSize: '0.88rem',
              color: '#94A3B8',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#22C55E" /> No long-term contracts
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#22C55E" /> 120+ Partner Gyms
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#22C55E" /> Instant Digital Access
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#22C55E" /> Pause or cancel anytime
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
