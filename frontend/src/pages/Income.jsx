import React, { useState, useEffect, useMemo } from 'react';
import { transactionService } from '../services/transactionService';
import { Modal } from '../components/Modal';
import { 
  Plus, 
  Search, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Building2, 
  ArrowDownRight,
  Briefcase,
  Layers,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

export const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [datePreset, setDatePreset] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getIncome({ startDate, endDate });
      const list = Array.isArray(data) ? data : (data?.content || []);
      setIncomeList(list);
    } catch (err) {
      console.error('Error fetching income records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [startDate, endDate]);

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

  const handleCreateIncome = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please provide a title and amount.');
      return;
    }
    setSubmitting(true);
    try {
      await transactionService.createIncome({
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        transactionDate: formData.transactionDate
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        amount: '',
        paymentMethod: 'BANK_TRANSFER',
        transactionDate: new Date().toISOString().split('T')[0]
      });
      fetchIncome();
    } catch (err) {
      alert('Failed to record income: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchIncome();
      } catch (err) {
        alert('Failed to delete income: ' + err.message);
      }
    }
  };

  // Preset Shortcuts
  const setPresetIncome = (title, defaultAmt) => {
    setFormData(prev => ({
      ...prev,
      title,
      amount: defaultAmt ? String(defaultAmt) : prev.amount
    }));
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return incomeList.filter(item => {
      const matchSearch = searchTerm === '' ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [incomeList, searchTerm]);

  // Income Metrics
  const metrics = useMemo(() => {
    const total = filteredList.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const count = filteredList.length;
    const avg = count > 0 ? total / count : 0;
    const max = filteredList.reduce((m, item) => Math.max(m, parseFloat(item.amount) || 0), 0);
    
    // Current month salary / income
    const currentYM = new Date().toISOString().slice(0, 7);
    const currentMonthIncome = filteredList
      .filter(i => (i.transactionDate || i.expenseDate || '').startsWith(currentYM))
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    return { total, count, avg, max, currentMonthIncome };
  }, [filteredList]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
            Income & Salary Ledger
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Track monthly salary, freelancing, investment inflows, and recurring earnings
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => exportToCSV(filteredList, 'fintrack_income_statement.csv')}
            className="btn btn-secondary"
            title="Export CSV"
          >
            <FileSpreadsheet size={15} color="#10B981" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => exportToJSON(filteredList, 'fintrack_income_data.json')}
            className="btn btn-secondary"
            title="Export JSON"
          >
            <FileCode size={15} color="#6366F1" />
            <span>JSON</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem' }}
          >
            <Plus size={16} />
            <span>Log Salary / Income</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Ribbon */}
      <div className="stats-ribbon" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-item">
          <span className="stat-label">Total Inflow Recorded</span>
          <span className="stat-value" style={{ color: '#10B981' }}>
            {formatCurrency(metrics.total)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Current Month Salary</span>
          <span className="stat-value" style={{ color: '#0F172A' }}>
            {formatCurrency(metrics.currentMonthIncome)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Income Records</span>
          <span className="stat-value">{metrics.count} entries</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Peak Inflow</span>
          <span className="stat-value" style={{ color: '#10B981' }}>
            {formatCurrency(metrics.max)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search salary, client, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Quick Date Presets */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Time' },
              { id: 'THIS_MONTH', label: 'This Month' },
              { id: 'LAST_30', label: 'Last 30 Days' },
              { id: 'THIS_YEAR', label: 'This Year' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyDatePreset(p.id)}
                className={`pill-btn ${datePreset === p.id ? 'active' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Income Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#FFFFFF' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Loading income records...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Wallet size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.35rem' }}>
              No Income Records Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Log your monthly salary, consulting fees, or investment returns to calculate your real-time savings rate.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} />
              <span>Log First Salary / Income</span>
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Source & Title</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Channel</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr 
                    key={item.id} 
                    style={{ borderBottom: '1px solid #F1F5F9', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{item.title}</div>
                      {item.description && (
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#64748B' }}>
                      {formatDate(item.transactionDate || item.expenseDate)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className="badge" style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0', fontSize: '0.725rem' }}>
                        {item.paymentMethod || 'BANK_TRANSFER'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: '800', color: '#10B981', fontSize: '0.95rem' }}>
                      +{formatCurrency(item.amount)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-icon btn-secondary"
                        title="Delete Income Record"
                        style={{ color: '#DC2626', borderColor: '#FECACA', padding: '0.35rem' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Income Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Monthly Salary & Income">
        <form onSubmit={handleCreateIncome}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Quick Presets:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Monthly Salary', defaultAmt: 75000 },
                { label: 'Freelance Payout', defaultAmt: 25000 },
                { label: 'Investment Dividend', defaultAmt: 5000 },
                { label: 'Annual Bonus', defaultAmt: 50000 }
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPresetIncome(p.label, p.defaultAmt)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Income Title / Source *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Monthly Salary - September 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              required
              min="1"
              className="form-input"
              placeholder="e.g. 75000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Deposit Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Channel</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="BANK_TRANSFER">Direct Deposit / Wire</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="CARD">Debit Card</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Source Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Optional details (e.g., Company payroll, project milestone, tax deductions)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving...' : 'Save Income Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
