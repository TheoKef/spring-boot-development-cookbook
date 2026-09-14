import React, { useState } from 'react';
import { 
  Package, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function OrdersList({ orders, onCancelOrder, loading, onShopNow }) {
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleCancel = async (order) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${order.orderNumber}?\nFull amount of ₹${order.totalAmount} will be immediately refunded to your wallet.`)) {
      return;
    }

    try {
      setCancellingOrderId(order.orderId);
      setFeedback(null);
      await onCancelOrder(order.orderId);
      setFeedback({
        type: 'success',
        text: `Order #${order.orderNumber} cancelled! ₹${order.totalAmount} refunded to your wallet.`
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Title & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
            My Order History & Refunds
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Manage your orders. You can cancel any confirmed order anytime for an instant 100% wallet refund.
          </p>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: feedback.type === 'success' ? '#34d399' : '#f87171',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {feedback.type === 'success' ? <Sparkles size={18} /> : <AlertCircle size={18} />}
          {feedback.text}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="pulse-glow" style={{ fontSize: '1.1rem' }}>Loading your orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>📦</div>
          <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>No orders placed yet</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
            Head over to our Storefront and place your first order using your digital wallet.
          </p>
          <button onClick={onShopNow} className="btn btn-primary">
            Explore Storefront
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const isConfirmed = order.status === 'CONFIRMED';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.orderId}
                className="glass-panel"
                style={{
                  padding: '24px',
                  border: isCancelled ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isCancelled ? 'rgba(17, 24, 39, 0.5)' : 'var(--bg-card)'
                }}
              >
                {/* Header Row: Order Number, Date, Status, Total */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isCancelled ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Package size={20} color={isCancelled ? '#f43f5e' : '#818cf8'} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
                        {order.orderNumber}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={isConfirmed ? "badge badge-success" : "badge badge-danger"}>
                      {isConfirmed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {order.status}
                    </span>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Total Paid
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: isCancelled ? 'var(--text-muted)' : '#f8fafc',
                        textDecoration: isCancelled ? 'line-through' : 'none'
                      }}>
                        ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Ordered Breakdown */}
                <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#818cf8', fontWeight: 600 }}>{item.quantity}x</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.productName}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                        ₹{Number(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Address & Cancel Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} color="#6366f1" />
                    <span>Delivering to: <strong style={{ color: '#cbd5e1' }}>{order.shippingAddress}</strong></span>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(order)}
                      disabled={cancellingOrderId === order.orderId}
                      className="btn btn-danger btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: cancellingOrderId === order.orderId ? 0.6 : 1
                      }}
                    >
                      <RotateCcw size={14} />
                      {cancellingOrderId === order.orderId ? 'Restocking & Refunding...' : 'Cancel & Instant Refund to Wallet'}
                    </button>
                  )}

                  {isCancelled && (
                    <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontStyle: 'italic' }}>
                      Order cancelled. ₹{order.totalAmount} was credited back to your digital wallet.
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
