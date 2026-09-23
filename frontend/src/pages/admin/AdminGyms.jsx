import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import FullScreenLoader from '../../components/FullScreenLoader';

export default function AdminGyms() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminGyms', { page, search }],
    queryFn: () => adminApi.getGyms({ page, search, limit: 20 })
  });

  const toggleVerification = useMutation({
    mutationFn: ({ id, verified }) => adminApi.updateGymVerification(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminGyms']);
    }
  });

  const updateTier = useMutation({
    mutationFn: ({ id, accessTier }) => adminApi.updateGymAccessTier(id, accessTier),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminGyms']);
    }
  });

  if (isLoading) return <FullScreenLoader />;
  if (error) return <div className="alert alert-error">Failed to load gyms.</div>;

  return (
    <div className="anim-fade">
      <div className="flex-between" style={{ marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Partner Gyms</h1>
          <p className="text-muted">Manage gym listings and access tiers</p>
        </div>
        <input 
          type="search" 
          placeholder="Search by name, slug, area..."
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
              {['Name', 'Area', 'Status', 'Verified', 'Tier', 'Joined'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.gyms?.map((gym) => (
              <tr key={gym.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{gym.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{gym.area || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${gym.status.toLowerCase()}`}>
                    {gym.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    className={`btn btn-sm ${gym.verified ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleVerification.mutate({ id: gym.id, verified: !gym.verified })}
                    disabled={toggleVerification.isPending}
                  >
                    {gym.verified ? 'Verified' : 'Verify'}
                  </button>
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    className="input" 
                    value={gym.accessTier}
                    onChange={(e) => updateTier.mutate({ id: gym.id, accessTier: e.target.value })}
                    disabled={updateTier.isPending}
                    style={{ padding: '4px 8px', height: 'auto' }}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>{new Date(gym.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {data?.gyms?.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No gyms found.
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
