import { Search, MapPin, QrCode, ArrowRight, Activity as ActivityIcon, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { mockUser, mockGyms, mockActivity } from '../../services/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import GymCard from '../../components/gym/GymCard';

export default function MemberHome() {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>Good evening, {mockUser.name.split(' ')[0]} 👋</h1>
        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>Where do you want to train today?</p>
      </div>

      {/* Search Bar */}
      <div className="search-input-wrapper" style={{ marginBottom: 'var(--space-8)' }}>
        <Search className="lucide" />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Search gyms, areas or facilities..." 
          style={{ height: '60px', fontSize: 'var(--font-size-lg)', boxShadow: 'var(--shadow-sm)' }}
          onFocus={() => navigate('/member/explore')}
        />
        <div style={{ position: 'absolute', right: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="neutral" style={{ padding: '8px 12px', fontSize: '14px', display: 'flex', gap: '4px', cursor: 'pointer' }}>
            <MapPin size={16} /> {mockUser.location}
          </Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
        {/* Pass Action Card */}
        <Card style={{ 
          background: 'linear-gradient(135deg, #1A1D20 0%, #2C3136 100%)', 
          color: 'white',
          padding: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Digital FitPass</span>
              <Badge variant="success" style={{ backgroundColor: 'rgba(25, 195, 106, 0.2)' }}>{mockUser.tier} Plan</Badge>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#868E96', marginBottom: '4px' }}>Member ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: '18px', letterSpacing: '2px' }}>{mockUser.id}</span>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#495057' }}></div>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#868E96', marginBottom: '4px' }}>Visits Used</span>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{mockUser.totalVisits - mockUser.visitsRemaining} <span style={{ color: '#868E96', fontSize: '14px' }}>/ {mockUser.totalVisits}</span></span>
              </div>
            </div>
          </div>
          <Link to="/member/pass">
            <Button variant="primary" size="lg" icon={QrCode} style={{ backgroundColor: 'white', color: 'var(--color-text-primary)' }}>
              Open My Pass
            </Button>
          </Link>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          
          {/* Smart Recommendation */}
          <section>
            <div className="flex-row-between" style={{ marginBottom: 'var(--space-4)' }}>
              <h2>Best match right now</h2>
            </div>
            <Card style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-6)', padding: 'var(--space-4)' }}>
              <div style={{ width: '160px', height: '160px', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={mockGyms[1].image} alt="Gym" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Badge variant="success">92% Match</Badge>
                  <span style={{ color: 'var(--color-status-success)', fontWeight: 600, fontSize: '14px' }}>Low Crowd</span>
                </div>
                <h3 style={{ marginBottom: '8px' }}>{mockGyms[1].name}</h3>
                <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Only {mockGyms[1].distance}km away. Has your preferred Strength equipment and is open until {mockGyms[1].closesAt}.
                </p>
                <div>
                  <Link to={`/member/gym/${mockGyms[1].id}`}><Button variant="secondary" size="sm">View Gym</Button></Link>
                </div>
              </div>
            </Card>
          </section>

          {/* Nearby Gyms */}
          <section>
            <div className="flex-row-between" style={{ marginBottom: 'var(--space-4)' }}>
              <h2>Nearby Gyms</h2>
              <Link to="/member/explore" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>See all <ArrowRight size={16} /></Link>
            </div>
            <div className="grid-cols-auto">
              {mockGyms.slice(0, 2).map(gym => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Weekly Progress */}
          <Card style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Weekly Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              {/* Fake Circular Progress */}
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid var(--color-bg-subtle)', borderTopColor: 'var(--color-brand-primary)', borderRightColor: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-45deg)' }}>
                <div style={{ transform: 'rotate(45deg)', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>4</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>/ 5 goal</span>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Current Streak</span>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: '#F59F00' }}>🔥 {mockUser.streak} days</span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Time Active</span>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>4h 35m</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card style={{ padding: 'var(--space-6)' }}>
            <div className="flex-row-between" style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '18px' }}>Recent Activity</h3>
              <Link to="/member/activity" style={{ fontSize: '14px', fontWeight: 600 }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockActivity.map((activity, index) => (
                <div key={activity.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                  {index !== mockActivity.length - 1 && (
                    <div style={{ position: 'absolute', left: '20px', top: '40px', bottom: '-16px', width: '2px', backgroundColor: 'var(--color-border-subtle)' }}></div>
                  )}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                    {activity.type === 'checkin' && <QrCode size={20} color="var(--color-brand-primary)" />}
                    {activity.type === 'workout' && <ActivityIcon size={20} color="var(--color-brand-primary)" />}
                    {activity.type === 'achievement' && <Star size={20} color="#F59F00" />}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '15px' }}>
                      {activity.type === 'checkin' && `Checked in at ${activity.gym}`}
                      {activity.type === 'workout' && `Workout completed at ${activity.gym}`}
                      {activity.type === 'achievement' && activity.title}
                    </p>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .container > div:nth-child(4) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
