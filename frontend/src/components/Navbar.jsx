import React from 'react';
import { Bell, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activePage, onAddExpenseClick, alertsCount = 0 }) => {
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Financial Overview';
      case 'expenses': return 'Expense Ledger';
      case 'add-expense': return 'Add New Transaction';
      case 'categories': return 'Budget Categories';
      case 'reports': return 'Analytics & Reports';
      case 'profile': return 'User Settings';
      default: return 'FinTrack';
    }
  };

  return (
    <header style={{
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
        {/* Quick action add expense (Emerald Button) */}
        {activePage !== 'add-expense' && (
          <button 
            className="btn btn-primary" 
            onClick={onAddExpenseClick}
            style={{
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        )}

        {/* Notifications Icon with count */}
        <div style={{ position: 'relative' }}>
          <button 
            title="System Alerts"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#1E293B',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <Bell size={17} />
          </button>
          {alertsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#10B981',
              color: '#FFFFFF',
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '1px 5px',
              borderRadius: '9999px',
              border: '2px solid #0F172A'
            }}>
              {alertsCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
