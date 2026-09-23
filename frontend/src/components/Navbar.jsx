import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Info, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';

export const Navbar = ({ activePage }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      const data = await reportService.getBudgetAlerts();
      const list = Array.isArray(data) ? data : (data?.content || []);
      setAlerts(list);
      setUnreadCount(list.length);
    } catch (err) {
      console.error('Failed to fetch budget alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // refresh alerts every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // mark as seen
    }
  };

  const handleClearAlerts = (e) => {
    e.stopPropagation();
    setAlerts([]);
    setUnreadCount(0);
  };

  const handleDismissAlert = (index, e) => {
    e.stopPropagation();
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Financial Dashboard';
      case 'transactions': return 'All Transactions';
      case 'income': return 'Income & Salary Tracker';
      case 'expenses': return 'Expense Tracker';
      case 'add-expense': return 'Record New Expense';
      case 'categories': return 'Categories & Budgets';
      case 'analytics': return 'Spending Analytics';
      case 'reports': return 'Financial Reports & Statements';
      case 'goals': return 'Savings Goals';
      case 'settings':
      case 'profile': return 'Account & Profile Settings';
      default: return 'FinTrack';
    }
  };

  return (
    <header className="app-header" style={{
      background: '#0F172A',
      borderBottom: '1px solid #1E293B',
      padding: '1rem 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>
          {getPageTitle()}
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
          Welcome back, <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{user?.fullName || 'User'}</span>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Notifications Icon with Interactive Dropdown Panel */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            onClick={handleToggle}
            title="System & Budget Notifications"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '9px',
              background: isOpen ? '#334155' : '#1E293B',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isOpen ? '#FFFFFF' : '#94A3B8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isOpen) {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#475569';
              }
            }}
            onMouseLeave={(e) => {
              if (!isOpen) {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = '#334155';
              }
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '1px 6px',
                borderRadius: '9999px',
                border: '2px solid #0F172A',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Floating Notification Dropdown */}
          {isOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 10px)',
              width: '380px',
              maxWidth: '90vw',
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              zIndex: 50,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {/* Dropdown Header */}
              <div style={{
                padding: '0.9rem 1.15rem',
                background: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #1E293B'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} color="#10B981" />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                    Notifications & Alerts
                  </span>
                  {alerts.length > 0 && (
                    <span style={{
                      background: '#1E293B',
                      color: '#94A3B8',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}>
                      {alerts.length}
                    </span>
                  )}
                </div>

                {alerts.length > 0 && (
                  <button
                    onClick={handleClearAlerts}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <Trash2 size={12} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Notification List Body */}
              <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.75rem' }}>
                {alerts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto'
                    }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem' }}>
                      All Caught Up!
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      No active budget breaches or threshold alerts.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {alerts.map((alert, idx) => {
                      const isCritical = alert.alertType === 'CRITICAL' || (alert.title && alert.title.includes('Exceeded'));
                      const bg = isCritical ? '#FEF2F2' : '#FFFBEB';
                      const border = isCritical ? '#FECACA' : '#FDE68A';
                      const iconBg = isCritical ? '#FEE2E2' : '#FEF3C7';
                      const titleColor = isCritical ? '#991B1B' : '#92400E';
                      const textColor = isCritical ? '#B91C1C' : '#B45309';
                      const iconColor = isCritical ? '#DC2626' : '#D97706';

                      return (
                        <div
                          key={alert.id || idx}
                          style={{
                            background: bg,
                            border: `1px solid ${border}`,
                            borderRadius: '10px',
                            padding: '0.75rem 0.9rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            position: 'relative',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          {/* Alert Icon matching user's image */}
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: iconBg,
                            color: iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            <ShieldAlert size={16} />
                          </div>

                          {/* Alert Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              color: titleColor,
                              lineHeight: 1.3,
                              marginBottom: '2px'
                            }}>
                              {alert.title}
                            </div>
                            <div style={{
                              fontSize: '0.775rem',
                              color: textColor,
                              lineHeight: 1.4
                            }}>
                              {alert.message}
                            </div>
                          </div>

                          {/* Dismiss Button */}
                          <button
                            onClick={(e) => handleDismissAlert(idx, e)}
                            title="Dismiss Notification"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: textColor,
                              cursor: 'pointer',
                              padding: '2px',
                              opacity: 0.6,
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div style={{
                padding: '0.65rem 1rem',
                background: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                fontSize: '0.725rem',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Real-time budget governance</span>
                <span style={{ fontWeight: '600', color: '#10B981' }}>Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
