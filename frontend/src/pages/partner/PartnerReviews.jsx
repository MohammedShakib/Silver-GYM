import { useState, useEffect } from 'react';
import { usePartnerGym } from '../../context/PartnerGymContext';
import { partnerApi } from '../../services/partnerApi';
import Skeleton from '../ui/Skeleton';
import { Star, MessageSquare } from 'lucide-react';

export default function PartnerReviews() {
  const { selectedGym, hasPermission } = usePartnerGym();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await partnerApi.getReviews(selectedGym.id);
        setReviews(res.reviews);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [selectedGym.id]);

  const handleReplySubmit = async (reviewId) => {
    try {
      const response = await partnerApi.respondToReview(selectedGym.id, reviewId, replyText[reviewId]);
      
      // Update local state
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, response } : r
      ));
      
      setReplyingTo(null);
    } catch (err) {
      alert('Failed to post reply');
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} color={i < rating ? '#eab308' : '#30363D'} fill={i < rating ? '#eab308' : 'transparent'} />
    ));
  };

  if (loading) return <Skeleton height={400} />;

  return (
    <div className="anim-fade" style={{ maxWidth: 800 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ color: 'white', margin: '0 0 8px 0', fontSize: 28 }}>Member Reviews</h1>
        <p style={{ color: '#8B949E', margin: 0, fontSize: 16 }}>Read and respond to feedback from Silver GYM members.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {reviews.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8B949E', background: '#161B22', borderRadius: 12, border: '1px solid #30363D' }}>
            No reviews yet.
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img 
                    src={review.member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.member.name)}&background=30363D&color=fff`} 
                    alt={review.member.name}
                    style={{ width: 48, height: 48, borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>{review.member.name}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div style={{ color: '#8B949E', fontSize: 12 }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <p style={{ color: 'white', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px 0' }}>
                {review.comment || 'No comment provided.'}
              </p>

              {/* Gym Response Section */}
              {review.response ? (
                <div style={{ background: 'rgba(34,197,94,0.05)', borderLeft: '4px solid #22c55e', padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MessageSquare size={16} color="#22c55e" />
                    <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>Response from Gym</span>
                    <span style={{ color: '#8B949E', fontSize: 12, marginLeft: 'auto' }}>
                      {new Date(review.response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'white', margin: 0, fontSize: 14, lineHeight: 1.5 }}>{review.response.response}</p>
                </div>
              ) : hasPermission(['OWNER', 'MANAGER']) ? (
                <div>
                  {replyingTo === review.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <textarea 
                        value={replyText[review.id] || ''}
                        onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                        placeholder="Write a public response..."
                        style={{ width: '100%', minHeight: 100, background: '#0D1117', border: '1px solid #30363D', borderRadius: 8, padding: 16, color: 'white', resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleReplySubmit(review.id)}>Post Reply</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => setReplyingTo(review.id)}>
                      Reply to member
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
