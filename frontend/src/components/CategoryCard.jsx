import React from 'react';
import { Tag, Trash2, Edit2, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const CategoryCard = ({ category, spent = 0, onDelete, onEdit }) => {
  const limit = category.budgetLimit || 0;
  const rawPercentage = limit > 0 ? (spent / limit) * 100 : 0;
  const percentage = Math.min(rawPercentage, 100);
  const isOverBudget = limit > 0 && spent > limit;
  const isWarning = limit > 0 && spent >= limit * 0.8 && !isOverBudget;
  const color = category.colorCode || '#6366F1';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: `${color}22`,
            border: `1px solid ${color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}>
            <Tag size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{category.name}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {category.isCustom ? 'Custom Category' : 'System Default'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className="btn btn-secondary btn-icon"
              title="Edit category & budget"
              style={{ padding: '0.35rem' }}
            >
              <Edit2 size={14} />
            </button>
          )}

          {category.isCustom && onDelete && (
            <button
              onClick={() => onDelete(category.id)}
              className="btn btn-secondary btn-icon"
              title="Delete category"
              style={{ color: 'var(--rose-500)', borderColor: 'rgba(244,63,94,0.2)', padding: '0.35rem' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {category.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {category.description}
        </p>
      )}

      {/* Budget Limit & Progress */}
      {limit > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Spent: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(spent)}</strong>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Limit: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(limit)}</strong>
            </span>
          </div>

          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{
                width: `${percentage}%`,
                background: isOverBudget ? 'var(--rose-500)' : isWarning ? 'var(--amber-500)' : color
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {rawPercentage.toFixed(0)}% utilized
            </span>

            {isOverBudget ? (
              <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                <ShieldAlert size={10} /> Over +{formatCurrency(spent - limit)}
              </span>
            ) : isWarning ? (
              <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                <AlertTriangle size={10} /> Approaching Limit
              </span>
            ) : (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                <CheckCircle2 size={10} /> Safe
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 0.85rem',
          background: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          borderRadius: '8px',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: '#64748B', fontWeight: '500' }}>No budget defined</span>
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#10B981',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              + Set Budget
            </button>
          )}
        </div>
      )}
    </div>
  );
};

