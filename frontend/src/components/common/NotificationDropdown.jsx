import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, CreditCard, Activity, Calendar, ShieldAlert, Settings, AlertCircle, Check } from 'lucide-react';
import { NotificationService } from '../../services/NotificationService';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'MEMBERSHIP': return <Calendar size={16} color="var(--text-secondary)" />;
    case 'PAYMENT': return <CreditCard size={16} color="var(--text-secondary)" />;
    case 'CHECKIN': return <Activity size={16} color="var(--sg-green)" />;
    case 'SECURITY': return <ShieldAlert size={16} color="var(--status-error)" />;
    default: return <Bell size={16} color="var(--text-secondary)" />;
  }
};

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await NotificationService.getNotifications(1, 10);
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
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

  const handleNotificationClick = (notif) => {
    if (!notif.readAt) {
      NotificationService.markAsRead(notif.id).catch(console.error);
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '10px',
        width: '360px',
        maxHeight: '480px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-lg)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', fontSize: 'var(--text-xs)', color: 'var(--sg-green)', cursor: 'pointer', fontWeight: 600 }}>
            Mark all read
          </button>
          <Link to="/member/profile" onClick={onClose} title="Settings" style={{ color: 'var(--text-secondary)' }}>
            <Settings size={14} />
          </Link>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: 0, background: 'var(--bg-base)' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={32} color="var(--border-subtle)" style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>You have no notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: notif.readAt ? 'transparent' : 'var(--sg-green-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  transition: 'background .2s ease'
                }}
              >
                <div style={{ 
                  width: 36, height: 36, borderRadius: '50%', 
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {getCategoryIcon(notif.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: notif.readAt ? 600 : 700, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                  {notif.actionLabel && (
                    <div style={{ marginTop: 8 }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--sg-green)' }}>
                        {notif.actionLabel} &rarr;
                      </span>
                    </div>
                  )}
                </div>
                {!notif.readAt && (
                  <button 
                    onClick={(e) => handleMarkAsRead(e, notif.id)}
                    title="Mark as read"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, height: 'fit-content' }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sg-green)' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', background: 'var(--bg-surface)' }}>
        <Link to="/member/notifications" onClick={onClose} style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          View all notifications
        </Link>
      </div>
    </div>
  );
}
