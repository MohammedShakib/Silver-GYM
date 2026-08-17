import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
  CheckCircle,
  Plus,
  Compass,
  Clock,
  Dumbbell,
  Shield,
  Phone,
  Mail,
  Edit2,
  Check,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import bkashLogo from '../../assets/payment-logos/bkash.svg';
import mastercardLogo from '../../assets/payment-logos/mastercard.svg';
import nagadLogo from '../../assets/payment-logos/nagad.svg';
import rocketLogo from '../../assets/payment-logos/rocket.svg';
import visaLogo from '../../assets/payment-logos/visa.svg';
import { mockUser } from '../../services/mockData';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

const paymentBrandLogos = {
  bkash: {
    src: bkashLogo,
    shellStyle: { width: 54, background: '#FFFFFF' },
    imageStyle: { width: 42 },
  },
  visa: {
    src: visaLogo,
    shellStyle: { width: 54, background: '#FFFFFF' },
    imageStyle: { width: 40 },
  },
  rocket: {
    src: rocketLogo,
    shellStyle: { width: 54, background: '#FFFFFF' },
    imageStyle: { width: 42 },
  },
  nagad: {
    src: nagadLogo,
    shellStyle: { width: 54, background: '#FFFFFF' },
    imageStyle: { width: 42 },
  },
  mastercard: {
    src: mastercardLogo,
    shellStyle: { width: 58, background: '#FFFFFF' },
    imageStyle: { width: 48 },
  },
};

function PaymentBrandLogo({ type }) {
  const logo = paymentBrandLogos[type];

  if (!logo) {
    return null;
  }

  const shellStyle = {
    width: 54,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    padding: '4px 6px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
  };

  return (
    <div style={{ ...shellStyle, ...logo.shellStyle }}>
      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: logo.imageStyle.width,
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [feedbackNotice, setFeedbackNotice] = useState('');

  // Editable personal info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: mockUser.name,
    email: 'alex.rahman@example.com',
    phone: '+880 1712-345678',
    emergencyContact: 'Fatima Rahman (+880 1819-876543)',
  });

  // Saved locations state
  const [savedLocations, setSavedLocations] = useState([
    { id: 'loc-1', label: 'Home', address: 'Mirpur 10, Section 6, Dhaka', isDefault: true },
    { id: 'loc-2', label: 'Office', address: 'Road 11, Block D, Banani, Dhaka', isDefault: false },
  ]);

  // Preferences state
  const [preferredTimes, setPreferredTimes] = useState(['Morning (6 AM - 10 AM)', 'Evening (6 PM - 9 PM)']);
  const [trainingFocus, setTrainingFocus] = useState(['Strength & Heavy Weights', 'Cardio & Conditioning']);
  const [amenityPreferences, setAmenityPreferences] = useState(['Air Conditioning', 'Free Weights Area', 'Showers & Lockers']);

  // Notifications state
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    renewalAlerts: true,
    crowdAlerts: true,
    emailReceipts: true,
  });

  const toggleLocationDefault = (id) => {
    setSavedLocations(prev =>
      prev.map(loc => ({
        ...loc,
        isDefault: loc.id === id,
      }))
    );
    setFeedbackNotice('Default training location updated.');
  };

  const togglePreference = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveInfo = (e) => {
    e?.preventDefault();
    setIsEditingInfo(false);
    setFeedbackNotice('Personal information updated successfully.');
  };

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 1100 }}>
      
      {/* Header & Member Card */}
      <div className="card card-shadow" style={{ padding: 'var(--sp-6) var(--sp-8)', marginBottom: 'var(--sp-8)', background: 'linear-gradient(to right, var(--bg-surface), var(--bg-subtle))' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-6)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--sg-green)',
                boxShadow: '0 8px 20px rgba(32,200,99,0.2)',
              }}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--sg-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              <Check size={13} strokeWidth={3} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ fontWeight: 800 }}>ACTIVE SUBSCRIBER</span>
              <span className="badge badge-neutral" style={{ fontWeight: 700 }}>ID {mockUser.id}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, margin: '0 0 4px', color: 'var(--text-primary)' }}>
              {personalInfo.name}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span>{mockUser.plan} Plan</span>
              <span>•</span>
              <span>Member since {mockUser.memberSince}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} color="var(--sg-green)" /> {mockUser.location}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <Link to="/member/pass" className="btn btn-dark btn-md" style={{ gap: 6 }}>
              <QrCode size={16} /> My Pass
            </Link>
            <Link to="/member/membership" className="btn btn-secondary btn-md">
              Plan & Billing
            </Link>
          </div>
        </div>
      </div>

      {feedbackNotice && (
        <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-6)', border: '1px solid var(--sg-green-muted)', background: 'var(--sg-green-light)' }}>
          <p style={{ margin: 0, color: 'var(--sg-green-active)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>✓ {feedbackNotice}</p>
        </div>
      )}

      {/* Main 2-Column Split: Preferences on Left (65%), Account Security on Right (35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: 'var(--sp-6)', alignItems: 'start' }} className="profile-grid">
        
        {/* LEFT COLUMN: Personal Info, Saved Locations, Fitness Preferences, Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          
          {/* 1. Personal Information */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-5)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Personal Information</h2>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Used for identification at partner gyms and digital check-ins</p>
              </div>
              <Button
                variant={isEditingInfo ? 'primary' : 'secondary'}
                size="sm"
                icon={isEditingInfo ? Check : Edit2}
                onClick={() => {
                  if (isEditingInfo) handleSaveInfo();
                  else setIsEditingInfo(true);
                }}
              >
                {isEditingInfo ? 'Save Changes' : 'Edit Info'}
              </Button>
            </div>

            {isEditingInfo ? (
              <form onSubmit={handleSaveInfo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>Email Address</label>
                  <input
                    type="email"
                    className="input"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4, color: 'var(--text-secondary)' }}>Emergency Contact</label>
                  <input
                    type="text"
                    className="input"
                    value={personalInfo.emergencyContact}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, emergencyContact: e.target.value })}
                  />
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{personalInfo.name}</p>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{personalInfo.email}</p>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{personalInfo.phone}</p>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Emergency Contact</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{personalInfo.emergencyContact}</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Saved Training Locations */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Saved Training Locations</h2>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Fast-track discovery and distance calculations to partner gyms</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              {savedLocations.map(loc => (
                <div
                  key={loc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    border: loc.isDefault ? '1.5px solid var(--sg-green)' : '1px solid var(--border-subtle)',
                    background: loc.isDefault ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: loc.isDefault ? 'var(--sg-green)' : 'var(--bg-subtle)', color: loc.isDefault ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{loc.label}</strong>
                        {loc.isDefault && <span className="badge badge-green" style={{ fontSize: 9, fontWeight: 800 }}>PRIMARY</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{loc.address}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {!loc.isDefault && (
                      <button
                        type="button"
                        onClick={() => toggleLocationDefault(loc.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11 }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate(`/member/explore?q=${encodeURIComponent(loc.label === 'Home' ? 'Mirpur' : 'Banani')}`)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11, color: 'var(--sg-green)', fontWeight: 700, gap: 4 }}
                    >
                      <Compass size={13} /> Explore Nearby
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setFeedbackNotice('Location addition modal opened. You can save up to 5 favorite training zones.')}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6, width: 'fit-content' }}
            >
              <Plus size={14} /> Add Another Location
            </button>
          </div>

          {/* 3. Fitness & Workout Preferences */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Fitness & Gym Preferences</h2>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Used to prioritize Best Match gym recommendations on your Home screen</p>
            </div>

            {/* Preferred Times */}
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
                Preferred Workout Times
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Early Morning (6 AM - 9 AM)', 'Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 9 PM)', 'Night (9 PM - 12 AM)'].map(time => {
                  const active = preferredTimes.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => togglePreference(time, preferredTimes, setPreferredTimes)}
                      className={`filter-chip ${active ? 'active' : ''}`}
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Training Focus */}
            <div style={{ marginBottom: 'var(--sp-5)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
                Training Focus
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Strength & Heavy Weights', 'Cardio & Conditioning', 'HIIT & Functional', 'CrossFit & Olympic', 'Calisthenics', 'Yoga & Mobility'].map(focus => {
                  const active = trainingFocus.includes(focus);
                  return (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => togglePreference(focus, trainingFocus, setTrainingFocus)}
                      className={`filter-chip ${active ? 'active' : ''}`}
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                      {focus}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenity Priorities */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
                Must-Have Partner Amenities
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Air Conditioning', 'Free Weights Area', 'Showers & Lockers', 'Steam / Sauna', 'Swimming Pool', 'Certified Trainers', 'Parking Space'].map(amenity => {
                  const active = amenityPreferences.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => togglePreference(amenity, amenityPreferences, setAmenityPreferences)}
                      className={`filter-chip ${active ? 'active' : ''}`}
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {active && <Check size={12} strokeWidth={3} />}
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Notification Preferences */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-6)' }}>
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: '0 0 2px', color: 'var(--text-primary)' }}>Notification Preferences</h2>
              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Control workout alerts, crowd insights, and billing reminders</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[
                { key: 'workoutReminders', label: 'Workout reminders & streak milestones', desc: 'Get motivated reminders on your chosen training days.' },
                { key: 'crowdAlerts', label: 'Low crowd alerts at nearby partner gyms', desc: 'Notifies you when your favorite gyms are quiet.' },
                { key: 'renewalAlerts', label: 'Monthly subscription & visit count alerts', desc: 'Sent 3 days prior to your monthly auto-renewal.' },
                { key: 'emailReceipts', label: 'Email payment invoices & check-in summaries', desc: 'Sent to alex.rahman@example.com after each billing event.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', gap: 16 }}>
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>{label}</strong>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification(key)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 'var(--r-full)',
                      background: notifications[key] ? 'var(--sg-green)' : 'var(--bg-muted)',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background .2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: 3,
                        left: notifications[key] ? 23 : 3,
                        transition: 'left .2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Account Status, Security, Payment, Support, Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          
          {/* Subscription Overview Quick Card */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)', background: 'linear-gradient(145deg, #101722 0%, #171D26 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: 10, fontWeight: 800 }}>ACTIVE PLAN</span>
                <h3 style={{ margin: '6px 0 2px', fontSize: 'var(--text-lg)', fontWeight: 900, color: 'white' }}>{mockUser.plan} Subscription</h3>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--sg-silver)' }}>Renews {mockUser.renewalDate}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'white' }}>৳3,490</span>
            </div>

            <div style={{ margin: 'var(--sp-3) 0', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex-between" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--sg-silver)' }}>Visits Remaining</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'white' }}>{mockUser.visitsRemaining} of {mockUser.visitsTotal}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--r-full)' }}>
                <div style={{ height: '100%', width: '80%', background: 'var(--sg-green)', borderRadius: 'var(--r-full)' }} />
              </div>
            </div>

            <Link to="/member/membership" className="btn btn-secondary btn-sm btn-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              Manage Subscription →
            </Link>
          </div>

          {/* Security & Login */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 var(--sp-3)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} color="var(--sg-green)" /> Security & Login
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                onClick={() => setFeedbackNotice('Password change link sent to alex.rahman@example.com.')}
                className="btn btn-secondary btn-sm btn-full"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Change Password</span>
                <ChevronRight size={14} color="var(--text-muted)" />
              </button>

              <button
                type="button"
                onClick={() => setFeedbackNotice('Two-factor SMS authentication is already enabled for +880 1712-345678.')}
                className="btn btn-secondary btn-sm btn-full"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Two-Factor Authentication</span>
                <span className="badge badge-green" style={{ fontSize: 9 }}>ENABLED</span>
              </button>
            </div>

            <p style={{ margin: 'var(--sp-3) 0 0', fontSize: 11, color: 'var(--text-muted)' }}>
              Last login: Today at 09:42 AM from Dhaka, Bangladesh
            </p>
          </div>

          {/* Payment Methods */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 var(--sp-3)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} color="var(--sg-green)" /> Payment Methods
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--sp-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PaymentBrandLogo type="bkash" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>bKash Wallet</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>+880 1712-***678</p>
                  </div>
                </div>
                <span className="badge badge-green" style={{ fontSize: 9 }}>PRIMARY</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PaymentBrandLogo type="visa" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Visa Card</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>**** 4242</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Backup</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PaymentBrandLogo type="rocket" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Rocket Wallet</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>+880 1911-***452</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Saved</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PaymentBrandLogo type="nagad" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Nagad Wallet</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>+880 1815-***241</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Available</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--r-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PaymentBrandLogo type="mastercard" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Mastercard</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>**** 8804</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Available</span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => setFeedbackNotice('Add payment method sheet opened (supports bKash, Rocket, Nagad, Visa, Mastercard).')}
            >
              + Add New Method
            </Button>
          </div>

          {/* Help & Legal */}
          <div className="card card-shadow" style={{ padding: 'var(--sp-5)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 var(--sp-3)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle size={16} color="var(--sg-green)" /> Help & Support
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--text-xs)' }}>
              <button
                type="button"
                onClick={() => setFeedbackNotice('Silver GYM Concierge support hotline: +880 9612-000000 (9 AM - 9 PM daily).')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
              >
                Member Concierge Support
              </button>
              <button
                type="button"
                onClick={() => setFeedbackNotice('FAQ documentation opened.')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
              >
                Frequently Asked Questions
              </button>
              <button
                type="button"
                onClick={() => setFeedbackNotice('Silver GYM partner network terms & fair usage policy.')}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
              >
                Terms of Service & Partner Rules
              </button>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="danger"
            size="md"
            icon={LogOut}
            fullWidth
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of Silver GYM?')) {
                navigate('/');
              }
            }}
          >
            Log Out of Silver GYM
          </Button>
        </div>
      </div>
    </div>
  );
}


