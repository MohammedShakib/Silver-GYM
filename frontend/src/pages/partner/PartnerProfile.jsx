import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../../components/ui/Skeleton';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function PartnerProfile() {
  const { selectedGym, hasPermission } = usePartnerGym();
  const [profile, setProfile] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, trainersRes] = await Promise.all([
          partnerApi.getProfile(selectedGym.id),
          partnerApi.getTrainers(selectedGym.id)
        ]);
        setProfile(profileRes);
        setFormData({
          name: profileRes.name || '',
          description: profileRes.description || '',
          phone: profileRes.phone || '',
          email: profileRes.email || '',
          address: profileRes.address || '',
          capacity: profileRes.capacity || ''
        });
        setTrainers(trainersRes.trainers);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [selectedGym.id]);

  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();
    if (!hasPermission(['OWNER', 'MANAGER'])) return;
    
    setSaving(true);
    try {
      const capacity = formData.capacity ? parseInt(formData.capacity, 10) : null;
      await partnerApi.updateProfile(selectedGym.id, { ...formData, capacity });
      alert('Profile updated successfully');
    } catch (err) {
      alert('Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTrainer = async (trainerId) => {
    if (!hasPermission(['OWNER', 'MANAGER'])) return;
    if (!window.confirm('Remove this trainer?')) return;
    
    try {
      await partnerApi.deleteTrainer(selectedGym.id, trainerId);
      setTrainers(trainers.filter(t => t.id !== trainerId));
    } catch (err) {
      alert('Failed to remove trainer');
    }
  };

  if (loading) return <Skeleton height={400} />;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'trainers', label: 'Trainers' }
    // Amenities and Hours can be added in future iterations if required. 
  ];

  return (
    <div className="anim-fade" style={{ maxWidth: 800 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Gym Profile</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Manage how your gym appears to Silver GYM members.</p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #30363D', marginBottom: 32 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0 0 16px 0',
              color: activeTab === tab.id ? 'white' : '#8B949E',
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderBottom: activeTab === tab.id ? '2px solid #22c55e' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <form onSubmit={handleSaveBasicInfo} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
            <h3 style={{ color: 'white', margin: '0 0 24px 0' }}>General Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Gym Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8 }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', minHeight: 120, background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8, resize: 'vertical' }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Phone</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8 }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8 }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Full Address</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8 }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Max Capacity</label>
                <input 
                  type="number" 
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                  placeholder="e.g. 150"
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '12px 16px', borderRadius: 8 }}
                  disabled={!hasPermission(['OWNER', 'MANAGER'])}
                />
              </div>
            </div>
          </div>

          {hasPermission(['OWNER', 'MANAGER']) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ gap: 8 }}>
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      )}

      {activeTab === 'trainers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ color: 'white', margin: 0 }}>Active Trainers</h3>
            {hasPermission(['OWNER', 'MANAGER']) && (
              <button className="btn btn-primary btn-sm" style={{ gap: 8 }} onClick={() => alert('Add trainer modal would open here.')}>
                <Plus size={16} /> Add Trainer
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {trainers.map(trainer => (
              <div key={trainer.id} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                {hasPermission(['OWNER', 'MANAGER']) && (
                  <button 
                    onClick={() => handleRemoveTrainer(trainer.id)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#8B949E', cursor: 'pointer', padding: 4 }}
                    title="Remove Trainer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <img 
                  src={trainer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.name)}&background=30363D&color=fff`} 
                  alt={trainer.name}
                  style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16 }}
                />
                <h4 style={{ color: 'white', margin: '0 0 4px 0', fontSize: 18 }}>{trainer.name}</h4>
                <p style={{ color: '#22c55e', margin: '0 0 12px 0', fontSize: 14 }}>{trainer.specialty || 'General Trainer'}</p>
                <p style={{ color: '#8B949E', margin: 0, fontSize: 14 }}>{trainer.experienceYears} Years Experience</p>
              </div>
            ))}
            
            {trainers.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#8B949E', background: '#161B22', borderRadius: 12, border: '1px solid #30363D' }}>
                No trainers added yet.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
