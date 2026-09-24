import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../../components/ui/Skeleton';
import { UserPlus, Shield, Trash2, Mail, Copy } from 'lucide-react';

export default function PartnerStaff() {
  const { selectedGym, hasPermission } = usePartnerGym();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('RECEPTIONIST');
  const [inviteResult, setInviteResult] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getStaff(selectedGym.id);
        setStaff(res.staff);
      } catch (err) {
        console.error('Failed to load staff', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaff();
  }, [selectedGym.id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const result = await partnerApi.inviteStaff(selectedGym.id, inviteEmail, inviteRole);
      setInviteResult(result);
      setInviteEmail('');
      setShowInviteForm(false);
    } catch (err) {
      alert('Failed to send invitation');
      console.error(err);
    }
  };

  const handleRemove = async (staffId) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await partnerApi.removeStaff(selectedGym.id, staffId);
      setStaff(staff.filter(s => s.id !== staffId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove staff');
    }
  };

  if (loading) return <Skeleton height={400} />;

  return (
    <div className="anim-fade" style={{ maxWidth: 1000 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Staff Management</h1>
          <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Manage access for owners, managers, and receptionists.</p>
        </div>
        
        {hasPermission(['OWNER']) && (
          <button 
            className="btn btn-primary" 
            style={{ gap: 8 }}
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            <UserPlus size={18} /> Invite Staff
          </button>
        )}
      </header>

      {/* Invite Form / Result */}
      {showInviteForm && (
        <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ color: 'white', margin: '0 0 16px 0' }}>Invite New Staff</h3>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Email Address</label>
              <input 
                type="email" 
                required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '10px 16px', borderRadius: 8 }}
              />
            </div>
            <div style={{ width: 200 }}>
              <label style={{ display: 'block', color: '#8B949E', marginBottom: 8, fontSize: 14 }}>Role</label>
              <select 
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '10px 16px', borderRadius: 8 }}
              >
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Send Invite</button>
          </form>
        </div>
      )}

      {inviteResult && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: 12, padding: 20, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#22c55e', margin: '0 0 4px 0' }}>Invitation Created</h4>
            <p style={{ color: 'white', margin: 0, fontSize: 14 }}>
              In production, an email would be sent. For testing, share this link with {inviteResult.email}:
            </p>
            <div style={{ background: '#0D1117', padding: '8px 12px', borderRadius: 6, marginTop: 12, fontFamily: 'monospace', color: '#8B949E', display: 'flex', alignItems: 'center', gap: 12 }}>
              http://localhost:3000/partner/invite/{inviteResult.token}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:3000/partner/invite/${inviteResult.token}`);
                  alert('Copied to clipboard');
                }}
                style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setInviteResult(null)}>Close</button>
        </div>
      )}

      {/* Staff List */}
      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363D' }}>
              <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Staff Member</th>
              <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img 
                      src={s.member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.member.name)}&background=30363D&color=fff`} 
                      alt={s.member.name}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{s.member.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B949E', fontSize: 13, marginTop: 4 }}>
                        <Mail size={12} /> {s.member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={16} color={s.role === 'OWNER' ? '#f59e0b' : s.role === 'MANAGER' ? '#3b82f6' : '#8B949E'} />
                    <span style={{ color: 'white', fontSize: 14 }}>{s.role}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {s.active ? (
                    <span style={{ color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>Active</span>
                  ) : (
                    <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>Inactive</span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {hasPermission(['OWNER']) && (
                    <button 
                      onClick={() => handleRemove(s.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                      title="Remove Access"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
