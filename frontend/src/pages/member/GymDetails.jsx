import { useParams, Link } from 'react-router-dom';
import { Share, Heart, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { mockGyms, mockUser } from '../../services/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function GymDetails() {
  const { id } = useParams();
  const gym = mockGyms.find(g => g.id === id) || mockGyms[0]; // fallback for demo

  return (
    <div className="container animate-fade-in" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-12)' }}>
      
      {/* Header */}
      <div className="flex-row-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {gym.verified && <Badge variant="success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Verified FitPass Partner</Badge>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <span style={{ color: '#F59F00' }}>★</span> {gym.rating} <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '14px' }}>({gym.reviews} reviews)</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', marginBottom: '4px' }}>{gym.name}</h1>
          <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-lg)', margin: 0 }}>
            <MapPin size={18} /> {gym.area}, Dhaka • {gym.distance} km away • {gym.time} min travel
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="secondary" icon={Share}>Share</Button>
          <Button variant="secondary" icon={Heart}>Save</Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="gym-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '200px 200px', gap: 'var(--space-2)', borderRadius: '24px', overflow: 'hidden', marginBottom: 'var(--space-8)' }}>
        <img src={gym.image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover', gridRow: '1 / 3' }} />
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWUnns9yEyi_0oKfvYG7Uf1FPB5CSm8_fOUfADE1h8jUV2AXTcEPmxVvrqX0I-1huoYfWwCcYeuCxRPEdUbfG5site_oOLbwXXqaJwZqWpLQw4aeWB2MKxTTY2TI04LjRTikp2vqL1DuPzTML9LuEnDPRLGu9vWktEn3DjQhRuWtEez_cDKU6iwIJqbTJJzW8tyA2t8dy2VRU5r5W7XqFtF1UQTnHPiCo87MZwtEoGTg1_UnbexyAd" alt="Cardio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9sSfMJY7KKbM-MHfEWhelNHV9kuy3WF8dFG6DlDVR7C0a0rah28rkLCVU0mmlZniVa4hTis88woP0n228QLl2VpqB6OCmsmab8SwVkPadz-TE7qNkRdV2MHsEzrC4_sEqFu5oJ5bsAAq7ClRY0PRmfT_sjlaIUAwxb5sswoMszOT8wtltrZEx9BUan5xOQcWXVjFZ_-p8mLhwR0fDqcfCRMYZcCNEaocHJJVJCJK03xHW8K9LQj7p" alt="Weights" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'relative', gridColumn: '2 / 4', gridRow: '2 / 3' }}>
           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIpddF4yUHZkFFyDdyDNd619WlsAaGzjuHYo94Ng5eSAKfP1qimg9ipOQAcmDL0xOmr_VX8Jl2DMaBC7hh5CPRIx57naZ1yBTCQFKEujG0sExT8c_ZnDdDW8lV_5OgjL-wU59xXlhnTJe_gNsB6Ku0rnPRJhGhYJ_c9SexPx-0TlWN6yCXWxY1zaygmPyk9Xm98dmrRN8Tz22xp7efliHSRfUuqYBAq1ITCDjunkA1yP1I-jiZigDm" alt="More" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '18px', cursor: 'pointer' }}>
             View all photos
           </div>
        </div>
      </div>

      <div className="gym-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-10)' }}>
        {/* Left Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          
          <section>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>About the Gym</h2>
            <p style={{ fontSize: '17px', lineHeight: 1.6 }}>
              Experience fitness at its peak at {gym.name}. Located in the heart of {gym.area}, this premium facility is designed for serious training with high-performance machines, free-weight zones, functional training areas, and a clean workout environment.
            </p>
          </section>

          <section>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
              {gym.amenities.concat(['Shower', 'Parking', 'Personal Trainer', 'Wi-Fi']).map(amenity => (
                <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px' }}>
                  <div style={{ color: 'var(--color-brand-primary)' }}><CheckCircle size={20} /></div>
                  <span style={{ fontWeight: 500 }}>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Crowd Level</h2>
            <Card style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-8)' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--color-status-success)' }}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Low Crowd right now</h3>
                  <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Usually quiet at this time.</p>
                </div>
              </div>

              {/* Mock Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '4px' }}>
                {[30, 20, 10, 20, 50, 80, 90, 70, 40, 20].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${h}%`, 
                      backgroundColor: h > 75 ? 'var(--color-status-error)' : h > 45 ? 'var(--color-status-warning)' : 'var(--color-status-success)',
                      borderRadius: '4px 4px 0 0',
                      opacity: i === 4 ? 1 : 0.4 // highlight "now"
                    }}></div>
                    {i % 2 === 0 && <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{i+6}am</span>}
                  </div>
                ))}
              </div>
            </Card>
          </section>

        </div>

        {/* Right Sticky Content */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-6))', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Access Card */}
            <Card style={{ padding: 'var(--space-6)', border: '2px solid var(--color-border-subtle)' }}>
              <h2 style={{ fontSize: '22px', marginBottom: '24px' }}>Access with FitPass</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div className="flex-row-between">
                  <span className="text-muted">Your plan</span>
                  <span style={{ fontWeight: 600 }}>{mockUser.tier}</span>
                </div>
                <div className="flex-row-between">
                  <span className="text-muted">Status</span>
                  <Badge variant="success" style={{ backgroundColor: 'var(--color-brand-primary)', color: 'white' }}>Included ✓</Badge>
                </div>
                <div className="flex-row-between">
                  <span className="text-muted">Visits remaining</span>
                  <span style={{ fontWeight: 600 }}>{mockUser.visitsRemaining} this month</span>
                </div>
                <div className="flex-row-between">
                  <span className="text-muted">Current crowd</span>
                  <span style={{ color: 'var(--color-status-success)', fontWeight: 600 }}>Low</span>
                </div>
              </div>

              <Link to={`/member/check-in/${gym.id}`}>
                <Button variant="primary" size="lg" fullWidth style={{ marginBottom: '12px' }}>Check In Now</Button>
              </Link>
              <Button variant="secondary" fullWidth icon={Navigation}>Get Directions</Button>
            </Card>

            {/* Location Card */}
            <Card style={{ padding: 0 }}>
              <div style={{ height: '160px', backgroundColor: '#E9ECEF' }}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCdCcHSyJ5meOw19OhgNsU7Sqn9zY8PLzeIDNQdb73Xn0YcGRxPnq42sCWcbhGZgkxjK57pR4bN09A8JDbhp3KCOofHBADyc70NyfmNFVkbekxeLrqSVMeHniv145NSLLh6uHuKE_elEFH5PGsZJX-JxAEl67_MYJO00LNrUunoVmLumn6cwMVLew0Nndd3uOsixIHORQRU65bT5OSSqs6x95UCkVKf1gKf-delCarR2IK3GsH2m1T" 
                  alt="Map" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <h4 style={{ marginBottom: '4px' }}>{gym.name}</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Level 4, Rahman Plaza, {gym.area} Circle, Dhaka</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .gym-details-grid { grid-template-columns: 1fr !important; }
          .gym-gallery { grid-template-columns: 1fr !important; grid-template-rows: 240px 120px 120px !important; }
          .gym-gallery > img:first-child { grid-row: 1 / 2 !important; grid-column: 1 / 2 !important; }
          .gym-gallery > img:nth-child(2) { grid-row: 2 / 3 !important; grid-column: 1 / 2 !important; }
          .gym-gallery > img:nth-child(3) { display: none; }
          .gym-gallery > div { grid-row: 3 / 4 !important; grid-column: 1 / 2 !important; }
        }
      `}</style>
    </div>
  );
}
