import React, { useState } from 'react';
import { ShoppingBag, Check, Zap, AlertTriangle, Layers } from 'lucide-react';

export default function Storefront({ products, onAddToCart, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedItemMap, setAddedItemMap] = useState({});

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  const handleAdd = (product) => {
    onAddToCart(product);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      {/* Banner / Hero Section */}
      <div className="glass-panel" style={{
        padding: '36px 40px',
        marginBottom: '36px',
        background: 'radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.22) 0%, rgba(17, 24, 39, 0.85) 70%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div className="badge badge-success" style={{ marginBottom: '12px' }}>
            <Zap size={14} />
            Instant Wallet Checkout Enabled
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.4rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '12px',
            background: 'linear-gradient(to right, #ffffff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Next-Gen E-Commerce with Dedicated Digital Wallet
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Shop premium tech gadgets with 1-click atomic wallet deduction. Fully synchronized with Spring Boot
            transactional backend and live rollback guarantees.
          </p>
        </div>

        {/* Quick Features Pill Box */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <span style={{ color: '#10b981' }}>✓</span> 0% Payment Gateway Failure
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <span style={{ color: '#10b981' }}>✓</span> Instant Refund on Order Cancel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
            <span style={{ color: '#10b981' }}>✓</span> Atomic @Transactional Integrity
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', marginRight: '8px' }}>
          <Layers size={16} />
          Categories:
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: selectedCategory === cat ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === cat ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: selectedCategory === cat ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div className="pulse-glow" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Fetching product inventory from Spring Boot backend...
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map(product => {
            const isOutOfStock = product.stockQuantity <= 0;
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
            const isJustAdded = addedItemMap[product.id];

            return (
              <div 
                key={product.id}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  border: '1px solid rgba(255, 255, 255, 0.07)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.boxShadow = '0 16px 32px -8px rgba(0, 0, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
              >
                {/* Product Image Box */}
                <div style={{
                  position: 'relative',
                  height: '210px',
                  background: '#0d1322',
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  
                  {/* Category Pill on Image */}
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(10, 14, 26, 0.8)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#c7d2fe',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {product.category}
                  </span>

                  {/* Stock Status Badge */}
                  <span style={{
                    position: 'absolute',
                    bottom: '14px',
                    right: '14px',
                  }}>
                    {isOutOfStock ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="badge badge-warning">
                        <AlertTriangle size={12} /> Only {product.stockQuantity} Left
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        Stock: {product.stockQuantity}
                      </span>
                    )}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      color: '#ffffff'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      marginBottom: '18px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Price
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#f8fafc'
                      }}>
                        ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      disabled={isOutOfStock}
                      className={isJustAdded ? "btn btn-success" : "btn btn-primary"}
                      style={{
                        opacity: isOutOfStock ? 0.4 : 1,
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        padding: '10px 18px'
                      }}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={16} />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
