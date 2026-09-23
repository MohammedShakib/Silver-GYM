import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/adminApi';
import FullScreenLoader from '../../components/FullScreenLoader';

export default function AdminAuditLog() {
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminAudit', { page, entityType }],
    queryFn: () => adminApi.getAuditLogs({ page, entityType, limit: 30 })
  });

  if (isLoading) return <FullScreenLoader />;
  if (error) return <div className="alert alert-error">Failed to load audit logs.</div>;

  return (
    <div className="anim-fade">
      <div className="flex-between" style={{ marginBottom: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Audit Log</h1>
          <p className="text-muted">System-wide event tracking</p>
        </div>
        <select 
          className="input" 
          value={entityType} 
          onChange={e => { setEntityType(e.target.value); setPage(1); }}
          style={{ width: '200px' }}
        >
          <option value="">All Entities</option>
          <option value="MEMBER">Member</option>
          <option value="GYM">Gym</option>
          <option value="APPLICATION">Application</option>
          <option value="PLAN">Plan</option>
          <option value="SUPPORT_CASE">Support Case</option>
        </select>
      </div>

      <div className="card card-shadow dashboard-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Timestamp', 'Actor ID', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Metadata'].map(h => (
                <th key={h} style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.logs?.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>{log.actorUserId || 'SYSTEM'}</td>
                <td style={{ padding: '12px' }}>{log.actorRole || 'SYSTEM'}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>{log.action}</td>
                <td style={{ padding: '12px' }}>{log.entityType}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>{log.entityId}</td>
                <td style={{ padding: '12px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <code style={{ fontSize: '11px', background: 'var(--bg-subtle)', padding: '2px 4px', borderRadius: '4px' }}>
                    {JSON.stringify(log.metadata)}
                  </code>
                </td>
              </tr>
            ))}
            {data?.logs?.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: 'var(--sp-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No audit logs found.
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
