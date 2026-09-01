import React, { useState, useEffect, useMemo } from 'react';
import { categoryService } from '../services/categoryService';
import { reportService } from '../services/reportService';
import { CategoryCard } from '../components/CategoryCard';
import { Modal } from '../components/Modal';
import { 
  Plus, 
  Tag, 
  IndianRupee, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  PieChart
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [breakdownMap, setBreakdownMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorCode: '#10B981',
    budgetLimit: ''
  });

  const fetchCategoriesAndSpent = async () => {
    setLoading(true);
    try {
      const [cats, breakdowns] = await Promise.all([
        categoryService.getAllCategories().catch(() => []),
        reportService.getCategoryBreakdown().catch(() => [])
      ]);

      setCategories(Array.isArray(cats) ? cats : []);

      const map = {};
      if (Array.isArray(breakdowns)) {
        breakdowns.forEach(item => {
          map[item.categoryId] = item.totalAmount || 0;
        });
      }
      setBreakdownMap(map);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSpent();
  }, []);

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      colorCode: category.colorCode || '#10B981',
      budgetLimit: category.budgetLimit ? category.budgetLimit.toString() : ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom category?')) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategoriesAndSpent();
      } catch (err) {
        alert('Could not delete category: ' + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        colorCode: formData.colorCode,
        budgetLimit: formData.budgetLimit ? parseFloat(formData.budgetLimit) : 0,
        icon: 'tag'
      });
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', colorCode: '#10B981', budgetLimit: '' });
      fetchCategoriesAndSpent();
    } catch (err) {
      alert('Failed to create category: ' + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await categoryService.updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        colorCode: formData.colorCode,
        budgetLimit: formData.budgetLimit ? parseFloat(formData.budgetLimit) : 0,
        icon: editingCategory.icon || 'tag'
      });
      setEditingCategory(null);
      setFormData({ name: '', description: '', colorCode: '#10B981', budgetLimit: '' });
      fetchCategoriesAndSpent();
    } catch (err) {
      alert('Failed to update category: ' + err.message);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.description && c.description.toLowerCase().includes(term))
    );
  }, [categories, searchTerm]);

  const budgetSummary = useMemo(() => {
    const totalBudget = categories.reduce((sum, c) => sum + (parseFloat(c.budgetLimit) || 0), 0);
    const totalSpent = Object.values(breakdownMap).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const remaining = totalBudget - totalSpent;
    const countWithBudget = categories.filter(c => c.budgetLimit > 0).length;

    return { totalBudget, totalSpent, remaining, countWithBudget };
  }, [categories, breakdownMap]);

  const colorPresets = ['#10B981', '#059669', '#4F46E5', '#6366F1', '#F59E0B', '#DC2626', '#0284C7', '#64748B'];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0F172A' }}>Categories & Budgets</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Set category budget limits, track spending progress, and customize tags
          </p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', description: '', colorCode: '#10B981', budgetLimit: '' });
            setIsCreateModalOpen(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {/* Budget Capacity Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <span className="stat-label">Total Monthly Budget</span>
          <span className="stat-value" style={{ color: '#0F172A' }}>
            {formatCurrency(budgetSummary.totalBudget)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value" style={{ color: '#10B981' }}>
            {formatCurrency(budgetSummary.totalSpent)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Budget Remaining</span>
          <span className="stat-value" style={{ color: budgetSummary.remaining < 0 ? '#DC2626' : '#059669' }}>
            {formatCurrency(budgetSummary.remaining)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Limits Defined</span>
          <span className="stat-value">
            {budgetSummary.countWithBudget} of {categories.length}
          </span>
        </div>
      </div>

      {/* Corporate Guidance Banner when No Budgets Set */}
      {budgetSummary.countWithBudget === 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1E40AF',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <ShieldCheck size={20} color="#2563EB" style={{ flexShrink: 0 }} />
          <span>
            <strong>Configure Your Budgets:</strong> No default limits are enforced. Click the <strong>edit icon (✏️)</strong> or <strong>+ Set Budget</strong> on any category below to assign your organization's custom monthly spending caps.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Showing <strong>{filteredCategories.length}</strong> categories
        </span>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: '#64748B' }}>Loading categories...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              spent={breakdownMap[cat.id] || 0}
              onDelete={handleDelete}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Modal to Create Category */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Category">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Subscriptions, Fitness, Investments"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Budget Limit (₹)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00 (Leave 0 for no limit)"
                value={formData.budgetLimit}
                onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                style={{ paddingLeft: '2.5rem' }}
              />
              <IndianRupee size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color Theme</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, colorCode: c })}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: c,
                    border: formData.colorCode === c ? '3px solid #0F172A' : '2px solid transparent',
                    cursor: 'pointer',
                    transform: formData.colorCode === c ? 'scale(1.15)' : 'scale(1)',
                    transition: 'var(--transition)'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="What belongs in this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Category
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal to Edit Category */}
      {editingCategory && (
        <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} title={`Edit: ${editingCategory.name}`}>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Budget Limit (₹)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.budgetLimit}
                  onChange={(e) => setFormData({ ...formData, budgetLimit: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <IndianRupee size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color Theme</label>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, colorCode: c })}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c,
                      border: formData.colorCode === c ? '3px solid #0F172A' : '2px solid transparent',
                      cursor: 'pointer',
                      transform: formData.colorCode === c ? 'scale(1.15)' : 'scale(1)',
                      transition: 'var(--transition)'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditingCategory(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
