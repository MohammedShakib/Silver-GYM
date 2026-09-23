import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import FullScreenLoader from '../../components/FullScreenLoader';

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminApplications', { page, status }],
    queryFn: () => adminApi.getApplications({ page, status, limit: 20 })
  });

  const approveMutation = useMutation({
    mutationFn: (id) => adminApi.approveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminApplications']);
      alert('Application approved. Gym and Owner account created.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to approve application');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => adminApi.rejectApplication(id, 'Rejected by admin'),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminApplications']);
    }
  });

  if (isLoading) return <FullScreenLoader />;
  if (error) return <div className="alert alert-error">Failed to load applications.</div>;

  return (
    <div className="anim-fade">
      <div className="flex-between" style={{ marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Gym Applications</h1>
          <p className="text-muted">Review partner onboarding requests</p>
        </div>
        <select 
          className="input" 
          value={status} 
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ width: '200px' }}
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="card card-shadow dashboard-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Gym Name', 'Contact', 'Address', 'Applied', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.applications?.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{app.gymName}</td>
                <td style={{ padding: '12px' }}>
                  <div>{app.contactEmail}</div>
                  <div className="text-muted text-xs">{app.contactPhone}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div>{app.address}</div>
                  <div className="text-muted text-xs">{app.area}</div>
                </td>
                <td style={{ padding: '12px' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {app.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                          if (window.confirm('Approve this application? This will create a Gym and an Owner staff account.')) {
                            approveMutation.mutate(app.id);
                          }
                        }}
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (window.confirm('Reject this application?')) {
                            rejectMutation.mutate(app.id);
                          }
                        }}
                        disabled={rejectMutation.isPending}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {data?.applications?.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No applications found.
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
    </div>
  );
}
