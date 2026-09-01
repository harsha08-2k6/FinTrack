import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  Tags, 
  PieChart, 
  User, 
  LogOut, 
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'add-expense', label: 'Add Expense', icon: PlusCircle, highlight: true },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'reports', label: 'Analytics & Reports', icon: PieChart },
    { id: 'profile', label: 'Settings', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#0F172A',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      flexShrink: 0,
      color: '#FFFFFF',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 30
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
        }}>
          <Wallet size={20} color="#FFFFFF" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.04em', color: '#FFFFFF', lineHeight: 1.1 }}>
            FIN<span style={{ color: '#10B981' }}>TRACK</span>
          </h2>
          <span style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
            Corporate Expenses
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: isActive 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : item.highlight 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'transparent',
                color: isActive 
                  ? '#10B981' 
                  : item.highlight 
                    ? '#F8FAFC' 
                    : '#94A3B8',
                border: 'none',
                borderLeft: isActive ? '3px solid #10B981' : '3px solid transparent',
                fontSize: '0.9rem',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                transition: 'var(--transition)',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = item.highlight ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
                  e.currentTarget.style.color = item.highlight ? '#F8FAFC' : '#94A3B8';
                }
              }}
            >
              <Icon size={18} color={isActive ? '#10B981' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section / Logout */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          padding: '0.75rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          marginTop: 'auto',
          minWidth: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
            {/* User Avatar with Dual Initials */}
            <div 
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.8rem',
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                flexShrink: 0
              }}
              title={user.fullName || user.username}
            >
              {(() => {
                const name = (user.fullName || user.username || '').trim();
                if (!name) return 'U';
                const parts = name.split(/\s+/);
                if (parts.length >= 2) {
                  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                }
                return name.slice(0, 2).toUpperCase();
              })()}
            </div>

            {/* Truncated Name & Formatted Role */}
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <div 
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  color: '#F8FAFC', 
                  textOverflow: 'ellipsis', 
                  overflow: 'hidden', 
                  whiteSpace: 'nowrap',
                  lineHeight: 1.25
                }}
                title={user.fullName || user.username}
              >
                {user.fullName || user.username}
              </div>
              <div style={{ 
                fontSize: '0.68rem', 
                color: '#94A3B8', 
                marginTop: '2px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ width: '6px', height: '6px', minWidth: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>
                  {user.role === 'ROLE_ADMIN' 
                    ? 'Administrator' 
                    : user.role === 'ROLE_USER' 
                      ? 'Corporate User' 
                      : (user.role || 'Member')}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign Out"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0.45rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      )}
    </aside>
  );
};
