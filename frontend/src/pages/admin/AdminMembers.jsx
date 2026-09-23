import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import FullScreenLoader from '../../components/FullScreenLoader';

export default function AdminMembers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminMembers', { page, search }],
    queryFn: () => adminApi.getMembers({ page, search, limit: 20 })
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => adminApi.suspendMember(id, suspendReason),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMembers']);
      setSelectedMember(null);
      setSuspendReason('');
      alert('Member suspended successfully');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to suspend member');
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: (id) => adminApi.reactivateMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMembers']);
      alert('Member reactivated successfully');
    },
    onError: (err) => {
      alert('Failed to reactivate member');
    }
  });

  if (isLoading) return <FullScreenLoader />;
  if (error) return <div className="alert alert-error">Failed to load members.</div>;

  return (
    <div className="anim-fade">
      <div className="flex-between" style={{ marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Members</h1>
          <p className="text-muted">Manage platform users</p>
        </div>
        <input 
          type="search" 
          placeholder="Search by name, email, code..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <div className="card card-shadow dashboard-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Code', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.members?.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{member.memberCode}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{member.name}</td>
                <td style={{ padding: '12px' }}>{member.email}</td>
                <td style={{ padding: '12px' }}>{member.role}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${member.status.toLowerCase()}`}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{new Date(member.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  {member.status === 'ACTIVE' ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedMember(member)}>Suspend</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => reactivateMutation.mutate(member.id)} disabled={reactivateMutation.isPending}>Reactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {data?.members?.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex-between" style={{ padding: 'var(--sp-4)', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {data?.page} of {data?.totalPages || 1}</span>
          <button className="btn btn-secondary btn-sm" disabled={page >= (data?.totalPages || 1)} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>

      {/* Suspend Modal (Basic implementation) */}
      {selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: 400, padding: 'var(--sp-6)' }}>
            <h3 style={{ marginBottom: 'var(--sp-4)' }}>Suspend {selectedMember.name}?</h3>
            <p className="text-muted" style={{ marginBottom: 'var(--sp-4)' }}>This will prevent the user from logging in or checking in.</p>
            <div className="form-group">
              <label className="label">Reason (Required for audit log)</label>
              <textarea 
                className="input" 
                rows="3" 
                value={suspendReason} 
                onChange={e => setSuspendReason(e.target.value)}
                placeholder="e.g., Violation of TOS..."
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end', marginTop: 'var(--sp-5)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedMember(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--status-error)' }} onClick={() => suspendMutation.mutate(selectedMember.id)} disabled={!suspendReason.trim() || suspendMutation.isPending}>
                {suspendMutation.isPending ? 'Suspending...' : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
