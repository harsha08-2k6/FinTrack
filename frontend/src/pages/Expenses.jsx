import React, { useState, useEffect, useMemo } from 'react';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { ExpenseTable } from '../components/ExpenseTable';
import { ExpenseCard } from '../components/ExpenseCard';
import { Modal } from '../components/Modal';
import { 
  Search, 
  LayoutList, 
  LayoutGrid, 
  Plus, 
  Calendar, 
  DollarSign, 
  FileSpreadsheet,
  FileCode,
  ArrowUpDown,
  Receipt,
  X
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

export const Expenses = ({ onNavigateAddExpense }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(true);

  // Modal for viewing receipt image
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [expenseData, categoryData] = await Promise.all([
        expenseService.getExpenses(params).catch(() => []),
        categoryService.getAllCategories().catch(() => [])
      ]);

      const expList = Array.isArray(expenseData) 
        ? expenseData 
        : (expenseData && Array.isArray(expenseData.content) ? expenseData.content : []);
      const catList = Array.isArray(categoryData) 
        ? categoryData 
        : (categoryData && Array.isArray(categoryData.content) ? categoryData.content : []);

      setExpenses(expList);
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, startDate, endDate]);

  const applyDatePreset = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'THIS_MONTH') {
      setStartDate(`${yyyy}-${mm}-01`);
      setEndDate(`${yyyy}-${mm}-${dd}`);
    } else if (preset === 'LAST_30') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      const pastY = past.getFullYear();
      const pastM = String(past.getMonth() + 1).padStart(2, '0');
      const pastD = String(past.getDate()).padStart(2, '0');
      setStartDate(`${pastY}-${pastM}-${pastD}`);
      setEndDate(`${yyyy}-${mm}-${dd}`);
    } else if (preset === 'THIS_YEAR') {
      setStartDate(`${yyyy}-01-01`);
      setEndDate(`${yyyy}-12-31`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  const filteredAndSortedExpenses = useMemo(() => {
    let list = [...expenses];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(exp => (
        exp.title?.toLowerCase().includes(term) ||
        exp.description?.toLowerCase().includes(term) ||
        exp.category?.name?.toLowerCase().includes(term) ||
        exp.paymentMethod?.toLowerCase().includes(term)
      ));
    }

    if (selectedPayment !== 'ALL') {
      list = list.filter(exp => exp.paymentMethod === selectedPayment);
    }

    list.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.expenseDate || 0) - new Date(a.expenseDate || 0);
      } else if (sortBy === 'date_asc') {
        return new Date(a.expenseDate || 0) - new Date(b.expenseDate || 0);
      } else if (sortBy === 'amount_desc') {
        return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
      } else if (sortBy === 'amount_asc') {
        return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
      } else if (sortBy === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return list;
  }, [expenses, searchTerm, selectedPayment, sortBy]);

  const stats = useMemo(() => {
    const count = filteredAndSortedExpenses.length;
    const total = filteredAndSortedExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    const avg = count > 0 ? total / count : 0;
    const max = filteredAndSortedExpenses.reduce((m, exp) => Math.max(m, parseFloat(exp.amount) || 0), 0);

    return { count, total, avg, max };
  }, [filteredAndSortedExpenses]);

  const handleExportCSV = () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'amount', label: 'Amount (₹)', formatter: (item) => parseFloat(item.amount).toFixed(2) },
      { key: 'category', label: 'Category', formatter: (item) => item.category?.name || 'Uncategorized' },
      { key: 'expenseDate', label: 'Date', formatter: (item) => item.expenseDate },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'description', label: 'Notes', formatter: (item) => item.description || '' },
      { key: 'receiptUrl', label: 'Has Receipt', formatter: (item) => item.receiptUrl ? 'YES' : 'NO' }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    exportToCSV(filteredAndSortedExpenses, `fintrack_expenses_${todayStr}.csv`, columns);
  };

  const handleExportJSON = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    exportToJSON(filteredAndSortedExpenses, `fintrack_expenses_${todayStr}.json`);
  };

  const paymentOptions = ['ALL', 'CARD', 'UPI', 'CASH', 'BANK_TRANSFER', 'OTHER'];

  return (
    <div className="page-wrapper">
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0F172A' }}>Expense Ledger</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Filter, search, export, and manage your complete transaction history
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
            title="Export filtered records to CSV for Excel"
          >
            <FileSpreadsheet size={15} color="#10B981" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.8rem' }}
            title="Export filtered records as JSON"
          >
            <FileCode size={15} color="#4F46E5" />
            <span>JSON</span>
          </button>

          {/* Toggle View Mode */}
          <div style={{ display: 'flex', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setViewMode('table')}
              className="btn btn-icon"
              style={{
                background: viewMode === 'table' ? '#10B981' : 'transparent',
                color: viewMode === 'table' ? '#FFFFFF' : '#64748B',
                padding: '0.4rem 0.6rem'
              }}
              title="Table View"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className="btn btn-icon"
              style={{
                background: viewMode === 'cards' ? '#10B981' : 'transparent',
                color: viewMode === 'cards' ? '#FFFFFF' : '#64748B',
                padding: '0.4rem 0.6rem'
              }}
              title="Card View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button onClick={onNavigateAddExpense} className="btn btn-primary" style={{ padding: '0.55rem 1.1rem' }}>
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <span className="stat-label">Filtered Spending</span>
          <span className="stat-value" style={{ color: '#0F172A' }}>
            {formatCurrency(stats.total)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Transactions</span>
          <span className="stat-value">{stats.count} records</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Outflow</span>
          <span className="stat-value" style={{ color: '#10B981' }}>
            {formatCurrency(stats.avg)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Largest Expense</span>
          <span className="stat-value" style={{ color: '#059669' }}>
            {formatCurrency(stats.max)}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search expenses, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Category Filter */}
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: Highest First</option>
              <option value="amount_asc">Amount: Lowest First</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
            <ArrowUpDown size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Date Range Start & End */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('CUSTOM');
              }}
              title="Start Date"
              style={{ fontSize: '0.8rem', padding: '0.6rem 0.5rem' }}
            />
            <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('CUSTOM');
              }}
              title="End Date"
              style={{ fontSize: '0.8rem', padding: '0.6rem 0.5rem' }}
            />
          </div>
        </div>

        {/* Quick Date Presets & Payment Method Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Quick Date Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', marginRight: '0.25rem' }}>PERIOD:</span>
            {[
              { id: 'ALL', label: 'All Time' },
              { id: 'THIS_MONTH', label: 'This Month' },
              { id: 'LAST_30', label: 'Last 30 Days' },
              { id: 'THIS_YEAR', label: 'This Year' }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => applyDatePreset(preset.id)}
                className={`pill-btn ${datePreset === preset.id ? 'active' : ''}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Payment Method Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', marginRight: '0.25rem' }}>PAYMENT:</span>
            {paymentOptions.map(method => (
              <button
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={`pill-btn ${selectedPayment === method ? 'active' : ''}`}
              >
                {method === 'ALL' ? 'All' : method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Content List / Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: '#64748B' }}>Loading expenses...</p>
        </div>
      ) : filteredAndSortedExpenses.length === 0 ? (
        <ExpenseTable
          expenses={[]}
          onAddExpense={onNavigateAddExpense}
        />
      ) : viewMode === 'table' ? (
        <ExpenseTable
          expenses={filteredAndSortedExpenses}
          onDelete={handleDelete}
          onViewReceipt={(expense) => setSelectedReceiptExpense(expense)}
          onAddExpense={onNavigateAddExpense}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredAndSortedExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id}
              expense={exp}
              onDelete={handleDelete}
              onViewReceipt={(expense) => setSelectedReceiptExpense(expense)}
            />
          ))}
        </div>
      )}

      {/* Receipt Inspection Modal */}
      {selectedReceiptExpense && (
        <Modal
          isOpen={!!selectedReceiptExpense}
          onClose={() => setSelectedReceiptExpense(null)}
          title={`Receipt: ${selectedReceiptExpense.title}`}
        >
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: '#0F172A' }}>{formatDate(selectedReceiptExpense.expenseDate)}</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedReceiptExpense.paymentMethod || 'CARD'}</p>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A' }}>
                {formatCurrency(selectedReceiptExpense.amount)}
              </span>
            </div>

            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '400px',
              border: '1px solid #E2E8F0'
            }}>
              {selectedReceiptExpense.receiptUrl.startsWith('data:image') || selectedReceiptExpense.receiptUrl.startsWith('http') ? (
                <img
                  src={selectedReceiptExpense.receiptUrl}
                  alt="Expense receipt"
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                  <Receipt size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                  <p>Document attachment reference:</p>
                  <code style={{ fontSize: '0.8rem', color: '#0F172A' }}>{selectedReceiptExpense.receiptUrl}</code>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedReceiptExpense(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
