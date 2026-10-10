import React from 'react';
import { 
  Wallet, 
  ShoppingCart, 
  Package, 
  BookOpen, 
  Store, 
  RefreshCw,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  wallet, 
  cartCount, 
  openCart, 
  refreshWallet, 
  walletLoading,
  users,
  currentUserId,
  setCurrentUserId
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(10, 14, 26, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 24px',
      marginBottom: '28px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)'
          }}>
            <Wallet size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.25rem', 
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(to right, #ffffff, #c7d2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              PayFlow
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
              Wallet & Order Engine
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <button
            onClick={() => setActiveTab('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'store' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'store' ? '#818cf8' : 'var(--text-muted)',
              fontWeight: activeTab === 'store' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: activeTab === 'store' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <Store size={16} />
            Storefront
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'wallet' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'wallet' ? '#818cf8' : 'var(--text-muted)',
              fontWeight: activeTab === 'wallet' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: activeTab === 'wallet' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <Wallet size={16} />
            Digital Wallet
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'orders' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'orders' ? '#818cf8' : 'var(--text-muted)',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: activeTab === 'orders' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
            }}
          >
            <Package size={16} />
            My Orders
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              background: activeTab === 'guide' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'guide' ? '#34d399' : 'var(--text-muted)',
              fontWeight: activeTab === 'guide' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: activeTab === 'guide' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
            }}
          >
            <BookOpen size={16} />
            Spring Boot Guide
          </button>
        </nav>

        {/* Right Section: User switch, Live Balance & Cart Drawer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* User Profile Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <UserCheck size={16} color="#818cf8" />
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={1} style={{ background: '#111827', color: '#fff' }}>Rahul Sharma (Demo User 1)</option>
              <option value={2} style={{ background: '#111827', color: '#fff' }}>Priya Patel (Demo User 2)</option>
            </select>
          </div>

          {/* Live Wallet Balance Pill */}
          <div 
            onClick={() => setActiveTab('wallet')}
            title="Click to manage wallet"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.2)'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Wallet:
            </span>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontWeight: 700, 
              color: '#34d399', 
              fontSize: '0.95rem' 
            }}>
              ₹{wallet ? Number(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshWallet();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RefreshCw size={13} className={walletLoading ? 'pulse-glow' : ''} />
            </button>
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="btn btn-primary"
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '12px'
            }}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#f43f5e',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(244, 63, 94, 0.6)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
