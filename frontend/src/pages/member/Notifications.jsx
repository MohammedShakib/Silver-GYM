import { useState, useEffect } from 'react';
import { Bell, CreditCard, Activity, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { NotificationService } from '../../services/NotificationService';
import { formatDistanceToNow } from 'date-fns';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'MEMBERSHIP': return <Calendar size={20} color="var(--text-secondary)" />;
    case 'PAYMENT': return <CreditCard size={20} color="var(--text-secondary)" />;
    case 'CHECKIN': return <Activity size={20} color="var(--sg-green)" />;
    case 'SECURITY': return <ShieldAlert size={20} color="var(--status-error)" />;
    case 'SUPPORT': return <CheckCircle2 size={20} color="var(--text-secondary)" />;
    default: return <Bell size={20} color="var(--text-secondary)" />;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNotifications(1);
  }, [filter]);

  const fetchNotifications = async (pageNum) => {
    try {
      setLoading(pageNum === 1);
      const data = await NotificationService.getNotifications(pageNum, 20);
      let newNotifs = data.notifications || [];
      if (filter === 'UNREAD') {
        newNotifs = newNotifs.filter(n => !n.readAt);
      }
      
      if (pageNum === 1) {
        setNotifications(newNotifs);
      } else {
        setNotifications(prev => [...prev, ...newNotifs]);
      }
      
      setHasMore(data.meta && pageNum < data.meta.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container anim-fade" style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 800 }}>
      <div className="flex-between" style={{ marginBottom: 'var(--sp-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>Notifications</h1>
        <button 
          onClick={handleMarkAllRead}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--sg-green)' }}
        >
          Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
        <button
          onClick={() => setFilter('ALL')}
          className={`filter-chip ${filter === 'ALL' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`filter-chip ${filter === 'UNREAD' ? 'active' : ''}`}
        >
          Unread
        </button>
      </div>

      <div className="card card-shadow" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 'var(--sp-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 'var(--sp-16) var(--sp-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={48} color="var(--border-subtle)" style={{ marginBottom: 'var(--sp-4)' }} />
            <p style={{ margin: 0, fontSize: 'var(--text-base)' }}>You have no {filter === 'UNREAD' ? 'unread ' : ''}notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((notif, idx) => (
              <div 
                key={notif.id}
                style={{
                  padding: 'var(--sp-5)',
                  borderBottom: idx < notifications.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: notif.readAt ? 'transparent' : 'var(--sg-green-light)',
                  display: 'flex',
                  gap: 'var(--sp-4)',
                  transition: 'background .2s ease'
                }}
              >
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', 
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {getCategoryIcon(notif.category)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: notif.readAt ? 600 : 700, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {notif.actionLabel ? (
                      <a href={notif.actionUrl} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--sg-green)', textDecoration: 'none' }}>
                        {notif.actionLabel} &rarr;
                      </a>
                    ) : <div />}
                    
                    {!notif.readAt && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: 'var(--sp-6)' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => fetchNotifications(page + 1)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
