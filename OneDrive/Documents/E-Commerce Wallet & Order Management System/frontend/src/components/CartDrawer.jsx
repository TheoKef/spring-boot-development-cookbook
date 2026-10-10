import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  walletBalance,
  onCheckout,
  onQuickTopUpAndPay
}) {
  const [shippingAddress, setShippingAddress] = useState('B-402, Skyline Residency, Tech City, Bengaluru - 560100');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  // Total cart calculation
  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const isBalanceSufficient = Number(walletBalance) >= totalAmount;
  const shortfall = totalAmount - Number(walletBalance);

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      await onCheckout(shippingAddress);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickTopUp = async () => {
    if (cart.length === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Top up the exact shortfall (or rounded) and checkout
      const amountToTopUp = Math.ceil(shortfall);
      await onQuickTopUpAndPay(amountToTopUp, shippingAddress);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    }}>
      {/* Slide-out Drawer Panel */}
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#0d1322',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Your Shopping Cart
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {errorMessage && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#f87171',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ color: '#ffffff', marginBottom: '6px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.875rem' }}>Add some products from the Storefront to checkout with your digital wallet.</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center'
                }}
              >
                {/* Thumbnail */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    background: '#1e293b'
                  }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a5b4fc', margin: '2px 0 8px' }}>
                    ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: item.quantity >= item.stockQuantity ? 'not-allowed' : 'pointer',
                        opacity: item.quantity >= item.stockQuantity ? 0.4 : 1
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Delete */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Wallet Balance comparison & Checkout Action */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(17, 24, 39, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Shipping Address Input */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <MapPin size={14} color="#818cf8" /> Delivery Address
              </label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Price & Balance Comparison Pill */}
            <div style={{
              background: isBalanceSufficient ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
              border: `1px solid ${isBalanceSufficient ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
              borderRadius: '12px',
              padding: '12px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cart Total:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Wallet Balance:</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 700, 
                  color: isBalanceSufficient ? '#34d399' : '#f87171',
                  fontSize: '0.95rem' 
                }}>
                  ₹{Number(walletBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Status note */}
              <div style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: isBalanceSufficient ? '#34d399' : '#fb7185'
              }}>
                {isBalanceSufficient ? (
                  <>
                    <ShieldCheck size={14} />
                    Sufficient balance! 1-click atomic wallet payment available.
                  </>
                ) : (
                  <>
                    <ShieldAlert size={14} />
                    Short by ₹{shortfall.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.
                  </>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            {isBalanceSufficient ? (
              <button
                onClick={handleCheckoutSubmit}
                disabled={isProcessing}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                {isProcessing ? 'Processing Atomic Order...' : (
                  <>
                    <Zap size={18} />
                    Pay ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} via Wallet
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleQuickTopUp}
                disabled={isProcessing}
                className="btn btn-success"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  opacity: isProcessing ? 0.6 : 1
                }}
              >
                {isProcessing ? 'Adding Funds & Paying...' : (
                  <>
                    <Sparkles size={18} />
                    Add ₹{Math.ceil(shortfall)} & Pay Now
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
