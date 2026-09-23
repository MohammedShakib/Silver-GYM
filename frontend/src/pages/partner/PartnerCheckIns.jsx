import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';
import { Search, Filter, Download } from 'lucide-react';

export default function PartnerCheckIns() {
  const { selectedGym } = usePartnerGym();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchCheckIns = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getCheckIns(selectedGym.id, { page, limit: 50, status: statusFilter });
        setCheckIns(res.checkIns);
      } catch (err) {
        console.error('Failed to fetch check-ins', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckIns();
  }, [selectedGym.id, page, statusFilter]);

  return (
    <div className="anim-fade" style={{ maxWidth: 1200 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Check-In History</h1>
          <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Manage and view recent gym visits</p>
        </div>
        <button className="btn btn-secondary" style={{ gap: 8 }}>
          <Download size={16} /> Export CSV
        </button>
      </header>

      <div style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid #30363D', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={18} color="#8B949E" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search members..." 
              style={{ width: '100%', background: '#0D1117', border: '1px solid #30363D', borderRadius: 8, padding: '10px 16px 10px 44px', color: 'white', fontSize: 14 }}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ background: '#0D1117', border: '1px solid #30363D', color: 'white', padding: '10px 16px', borderRadius: 8, fontSize: 14 }}
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #30363D' }}>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Member</th>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Code</th>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Plan</th>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Method</th>
                <th style={{ padding: '16px 24px', color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: 24 }}><Skeleton height={200} /></td>
                </tr>
              ) : checkIns.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 40, textAlign: 'center', color: '#8B949E' }}>No check-ins found.</td>
                </tr>
              ) : (
                checkIns.map(ci => (
                  <tr key={ci.id} style={{ borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img 
                          src={ci.member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(ci.member.name)}&background=30363D&color=fff`} 
                          alt={ci.member.name}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ color: 'white', fontWeight: 500, fontSize: 14 }}>{ci.member.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#8B949E', fontSize: 14 }}>{ci.member.memberCode}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                        {ci.membership.plan.name}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'white', fontSize: 14 }}>
                      <div>{new Date(ci.checkedInAt).toLocaleDateString()}</div>
                      <div style={{ color: '#8B949E', fontSize: 12 }}>{new Date(ci.checkedInAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#8B949E', fontSize: 14 }}>{ci.method.replace('_', ' ')}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        color: ci.status === 'VERIFIED' ? '#22c55e' : ci.status === 'REJECTED' ? '#ef4444' : '#f59e0b', 
                        fontWeight: 600, fontSize: 14 
                      }}>
                        {ci.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #30363D' }}>
          <span style={{ color: '#8B949E', fontSize: 14 }}>Showing recent 50 check-ins</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <button className="btn btn-secondary btn-sm" disabled={checkIns.length < 50} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
