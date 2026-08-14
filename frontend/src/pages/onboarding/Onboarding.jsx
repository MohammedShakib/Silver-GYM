import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, MapPin, Target, Clock, Star } from 'lucide-react';
import { plans } from '../../services/mockData';

const STEPS = [
  { num: 1, label: 'Location' },
  { num: 2, label: 'Goals' },
  { num: 3, label: 'Facilities' },
  { num: 4, label: 'Schedule' },
  { num: 5, label: 'Plan' },
];

const GOALS = ['Strength Training', 'Weight Loss', 'General Fitness', 'Cardio', 'Yoga & Mobility', 'Muscle Gain'];
const FACILITIES = ['AC', 'Locker', 'Shower', 'Parking', 'Trainer', 'Heavy Weights', 'Women Friendly', '24/7 Access', 'WiFi', 'Pool'];
const TIMES = ['Morning (5–9 AM)', 'Mid-morning (9 AM–12 PM)', 'Afternoon (12–5 PM)', 'Evening (5–9 PM)', 'Late Night (9 PM+)'];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [goals, setGoals] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [times, setTimes] = useState([]);
  const navigate = useNavigate();

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const activePlan = plans[1]; // Active is recommended

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--sp-8) var(--sp-4)' }}>
      {/* Progress */}
      <div style={{ width: '100%', maxWidth: 600, marginBottom: 'var(--sp-10)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, background: 'var(--sg-charcoal)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--sg-green)', fontWeight: 900, fontSize: 11 }}>SG</span>
            </div>
          </Link>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{step} of {STEPS.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map(s => (
            <div key={s.num} style={{ flex: 1, height: 4, borderRadius: 2, background: s.num <= step ? 'var(--sg-green)' : 'var(--bg-muted)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 600 }} className="anim-up">

        {/* Step 1 — Location */}
        {step === 1 && (
          <div>
            <MapPin size={32} color="var(--sg-green)" style={{ marginBottom: 'var(--sp-4)' }} />
            <h2 style={{ marginBottom: 8 }}>Where do you usually train?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>We'll find the best nearby gyms and suggest the right plan.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
              {['Home', 'Office', 'University', 'Current Location'].map(loc => (
                <button key={loc} type="button"
                  onClick={() => setLocation(loc)}
                  style={{
                    padding: 'var(--sp-5)', background: location === loc ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                    border: `2px solid ${location === loc ? 'var(--sg-green)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--r-xl)', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: 'var(--text-lg)',
                    transition: 'all .18s',
                  }}
                >
                  <MapPin size={20} color={location === loc ? 'var(--sg-green)' : 'var(--text-muted)'} />
                  {loc}
                  {location === loc && <CheckCircle size={18} color="var(--sg-green)" style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 'var(--sp-6)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Or search an area</label>
              <input type="text" className="input" placeholder="e.g. Mirpur 10, Gulshan..." onChange={e => setLocation(e.target.value)} />
            </div>
            <button className="btn btn-dark btn-lg btn-full" disabled={!location} onClick={() => setStep(2)}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Goals */}
        {step === 2 && (
          <div>
            <Target size={32} color="var(--sg-green)" style={{ marginBottom: 'var(--sp-4)' }} />
            <h2 style={{ marginBottom: 8 }}>What are your fitness goals?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>Select all that apply. We'll prioritize gyms that match.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
              {GOALS.map(g => (
                <button key={g} type="button" onClick={() => toggle(goals, setGoals, g)}
                  style={{
                    padding: '14px var(--sp-5)', background: goals.includes(g) ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                    border: `2px solid ${goals.includes(g) ? 'var(--sg-green)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--r-lg)', cursor: 'pointer', fontSize: 'var(--text-base)', fontWeight: 500, transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {goals.includes(g) && <CheckCircle size={15} color="var(--sg-green)" />}
                  {g}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-dark btn-lg" style={{ flex: 1 }} onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3 — Facilities */}
        {step === 3 && (
          <div>
            <h2 style={{ marginBottom: 8 }}>Preferred facilities</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>Select the facilities that matter most to you.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
              {FACILITIES.map(f => (
                <button key={f} type="button" onClick={() => toggle(facilities, setFacilities, f)}
                  className={`filter-chip ${facilities.includes(f) ? 'active' : ''}`}
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button className="btn btn-secondary btn-lg" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-dark btn-lg" style={{ flex: 1 }} onClick={() => setStep(4)}>Continue <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 4 — Schedule */}
        {step === 4 && (
          <div>
            <Clock size={32} color="var(--sg-green)" style={{ marginBottom: 'var(--sp-4)' }} />
            <h2 style={{ marginBottom: 8 }}>When do you prefer to train?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-8)' }}>We'll show crowd info relevant to your schedule.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
              {TIMES.map(t => (
                <button key={t} type="button" onClick={() => toggle(times, setTimes, t)}
                  style={{
                    padding: 'var(--sp-4) var(--sp-5)', background: times.includes(t) ? 'var(--sg-green-light)' : 'var(--bg-surface)',
                    border: `2px solid ${times.includes(t) ? 'var(--sg-green)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--r-lg)', cursor: 'pointer', textAlign: 'left', fontWeight: 500, fontSize: 'var(--text-base)', transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  {times.includes(t) && <CheckCircle size={16} color="var(--sg-green)" />}
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button className="btn btn-secondary btn-lg" onClick={() => setStep(3)}>Back</button>
              <button className="btn btn-dark btn-lg" style={{ flex: 1 }} onClick={() => setStep(5)}>See My Plan <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 5 — Recommended Plan + Activation */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
              <Star size={32} color="var(--sg-green)" style={{ margin: '0 auto var(--sp-4)' }} />
              <h2 style={{ marginBottom: 8 }}>Your recommended plan</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Based on your location, goals, and schedule.</p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '2px solid var(--sg-green)', borderRadius: 'var(--r-2xl)', overflow: 'hidden', marginBottom: 'var(--sp-6)', boxShadow: 'var(--shadow-green)' }}>
              <div style={{ background: 'var(--sg-green)', padding: 'var(--sp-4) var(--sp-6)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)' }}>RECOMMENDED FOR YOU</span>
              </div>
              <div style={{ padding: 'var(--sp-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>{activePlan.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{activePlan.gymTier}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', fontWeight: 900 }}>৳{activePlan.price.toLocaleString()}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>/mo</span>
                  </div>
                </div>
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {activePlan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
                      <CheckCircle size={13} color="var(--sg-green)" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="btn btn-primary btn-xl btn-full" style={{ marginBottom: 'var(--sp-4)' }} onClick={() => navigate('/member')}>
              Activate {activePlan.name} Plan <ArrowRight size={18} />
            </button>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setStep(4)}>Back</button>
              <button className="btn btn-ghost" onClick={() => navigate('/member')}>Compare Plans</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
