import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  PlusCircle, 
  RefreshCw, 
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';

export default function WalletHub({ 
  wallet, 
  transactions, 
  onTopUp, 
  loading, 
  refreshWallet, 
  currentUserName 
}) {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [topUpMessage, setTopUpMessage] = useState(null);

  const presets = [100, 500, 1000, 2000, 5000];

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) return;

    try {
      setIsSubmitting(true);
      setTopUpMessage(null);
      await onTopUp(amount);
      setTopUpMessage({ type: 'success', text: `₹${amount} successfully added to your wallet!` });
      setTopUpAmount('');
    } catch (err) {
      setTopUpMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header & Quick Intro */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
            Digital Wallet Management Hub
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Instant recharge, 1-click checkout ledger, and immutable transaction audit trail.
          </p>
        </div>
        <button 
          onClick={refreshWallet}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={14} className={loading ? 'pulse-glow' : ''} />
          Refresh Balance
        </button>
      </div>

      {/* Top Grid: Virtual Wallet Card + Top-Up Form */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px'
      }}>
        
        {/* 1. Digital Virtual Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 40%, #312e81 80%, #4338ca 100%)',
          borderRadius: '24px',
          padding: '32px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(49, 46, 129, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          {/* Card Decorative Hologram Glow */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 70, 239, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Top Row: Chip & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* EMV Microchip Simulation */}
              <div style={{
                width: '46px',
                height: '34px',
                background: 'linear-gradient(135deg, #fcd34d 0%, #b45309 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 600 }}>
                <ShieldCheck size={16} color="#34d399" />
                Optimistic-Lock Protected
              </div>
            </div>

            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              fontStyle: 'italic',
              letterSpacing: '1px',
              color: '#ffffff'
            }}>
              PayFlow
            </div>
          </div>

          {/* Center: Live Balance */}
          <div style={{ margin: '20px 0' }}>
            <div style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Available Balance
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
            }}>
              ₹{wallet ? Number(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
            </div>
          </div>

          {/* Bottom Row: Card Holder & Masked Identifier */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Account Holder
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.5px' }}>
                {wallet ? wallet.userName : currentUserName || 'Rahul Sharma'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Wallet ID
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#e0e7ff', fontWeight: 600 }}>
                WLT-00{wallet ? wallet.walletId : '1'} •••• 2026
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top-Up Funds Form */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PlusCircle size={18} color="#10b981" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Instant Wallet Recharge
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Add simulated funds to test atomic payments and transaction rollbacks.
            </p>

            {/* Notification alert */}
            {topUpMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: topUpMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                color: topUpMessage.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${topUpMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}>
                {topUpMessage.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {topUpMessage.text}
              </div>
            )}

            {/* Quick Presets */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Quick Presets
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presets.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTopUpAmount(amount.toString())}
                    style={{
                      background: Number(topUpAmount) === amount ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                      border: Number(topUpAmount) === amount ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: Number(topUpAmount) === amount ? '#a5b4fc' : 'var(--text-main)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    +₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <form onSubmit={handleTopUpSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Enter Custom Amount (₹)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700
                  }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="500"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '12px 14px 12px 32px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !topUpAmount || Number(topUpAmount) <= 0}
                className="btn btn-success"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  opacity: (isSubmitting || !topUpAmount || Number(topUpAmount) <= 0) ? 0.5 : 1,
                  cursor: (isSubmitting || !topUpAmount || Number(topUpAmount) <= 0) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Processing Credit...' : (
                  <>
                    <Sparkles size={16} />
                    Instant Top-up ₹{topUpAmount || '0'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section: Immutable Passbook Ledger */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
              Wallet Passbook & Transaction Ledger
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Complete chronological audit trail with exact timestamps and order references.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'CREDIT', 'DEBIT'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  background: filterType === type ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: filterType === type ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: filterType === type ? '#a5b4fc' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {type === 'ALL' ? 'All Transactions' : type === 'CREDIT' ? 'Credits (+)' : 'Debits (-)'}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No transactions found for this filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px' }}>Description / Reference</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'CREDIT';
                  const isSuccess = tx.status === 'SUCCESS';

                  return (
                    <tr 
                      key={tx.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Type Icon */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isCredit ? (
                              <ArrowDownLeft size={18} color="#10b981" />
                            ) : (
                              <ArrowUpRight size={18} color="#f43f5e" />
                            )}
                          </div>
                          <span style={{
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            color: isCredit ? '#34d399' : '#fb7185'
                          }}>
                            {tx.type}
                          </span>
                        </div>
                      </td>

                      {/* Description & Order Ref */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {tx.description}
                        </div>
                        {tx.referenceOrderId && (
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#818cf8', marginTop: '2px' }}>
                            Ref: {tx.referenceOrderId}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px' }}>
                        <span className={isSuccess ? "badge badge-success" : "badge badge-danger"}>
                          {tx.status}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        {new Date(tx.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Amount with colored prefix */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: isCredit ? '#10b981' : '#f43f5e'
                        }}>
                          {isCredit ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
