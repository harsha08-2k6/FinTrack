import React, { useState, useEffect, useMemo } from 'react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { Modal } from '../components/Modal';
import { 
  Search, 
  Plus, 
  Calendar, 
  DollarSign, 
  FileSpreadsheet, 
  FileCode, 
  ArrowUpDown, 
  Receipt, 
  X,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Trash2,
  Tag,
  Paperclip
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

export const Transactions = ({ onNavigateAddExpense, onNavigateIncome }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Quick Inflow Modal
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeForm, setIncomeForm] = useState({
    title: 'Monthly Salary',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  // Modal for receipt image
  const [selectedReceiptTx, setSelectedReceiptTx] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'ALL') params.type = selectedType;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [txData, categoryData] = await Promise.all([
        transactionService.getAllTransactions(params).catch(() => []),
        categoryService.getAllCategories().catch(() => [])
      ]);

      const txList = Array.isArray(txData) ? txData : (txData?.content || []);
      const catList = Array.isArray(categoryData) ? categoryData : (categoryData?.content || []);

      setTransactions(txList);
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedType, selectedCategory, startDate, endDate]);

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
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchTransactions();
      } catch (err) {
        alert('Failed to delete transaction: ' + err.message);
      }
    }
  };

  const handleCreateIncome = async (e) => {
    e.preventDefault();
    if (!incomeForm.amount) return;
    try {
      await transactionService.createIncome({
        title: incomeForm.title.trim(),
        amount: parseFloat(incomeForm.amount),
        paymentMethod: incomeForm.paymentMethod,
        transactionDate: incomeForm.transactionDate
      });
      setIsIncomeModalOpen(false);
      setIncomeForm({
        title: 'Monthly Salary',
        amount: '',
        paymentMethod: 'BANK_TRANSFER',
        transactionDate: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (err) {
      alert('Failed to record income: ' + err.message);
    }
  };

  // Filtered in-memory for fast search and payment channels
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = searchTerm === '' ||
        (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPayment = selectedPayment === 'ALL' || t.paymentMethod === selectedPayment;

      return matchSearch && matchPayment;
    });
  }, [transactions, searchTerm, selectedPayment]);

  // Statistics Calculation: Inflow, Outflow, Net Balance
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    filteredTransactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'INCOME') {
        inflow += amt;
        incomeCount++;
      } else {
        outflow += amt;
        expenseCount++;
      }
    });

    const net = inflow - outflow;

    return {
      inflow,
      outflow,
      net,
      totalCount: filteredTransactions.length,
      incomeCount,
      expenseCount
    };
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    const columns = [
      { key: 'transactionDate', label: 'Date', formatter: (i) => i.transactionDate || i.expenseDate },
      { key: 'type', label: 'Flow Type' },
      { key: 'title', label: 'Title / Description' },
      { key: 'categoryName', label: 'Category', formatter: (i) => i.category?.name || (i.type === 'INCOME' ? 'Income' : 'General') },
      { key: 'paymentMethod', label: 'Payment Channel' },
      { key: 'amount', label: 'Amount (₹)', formatter: (i) => parseFloat(i.amount || 0).toFixed(2) }
    ];
    exportToCSV(filteredTransactions, 'FinTrack_Complete_Transaction_History.csv', columns);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredTransactions, 'FinTrack_Transactions.json');
  };

  return (
    <div className="page-wrapper">
      {/* Header & Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
            All Transactions
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            View and manage all your incoming salary deposits and outgoing expenses
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            title="Export CSV"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.8rem' }}
          >
            <FileSpreadsheet size={15} color="#10B981" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="btn btn-secondary"
            title="Export JSON"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.8rem' }}
          >
            <FileCode size={15} color="#6366F1" />
            <span>Export JSON</span>
          </button>

          <button 
            onClick={() => setIsIncomeModalOpen(true)}
            className="btn btn-secondary"
            style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#059669', padding: '0.55rem 1rem' }}
          >
            <Plus size={15} />
            <span>Log Income</span>
          </button>

          <button 
            onClick={onNavigateAddExpense}
            className="btn btn-primary" 
            style={{ padding: '0.55rem 1.1rem' }}
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY STATS RIBBON: Inflow, Outflow, Net Balance, Total Count */}
      <div className="stats-ribbon" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-item">
          <span className="stat-label">Total Income</span>
          <span className="stat-value" style={{ color: '#10B981' }}>
            +{formatCurrency(stats.inflow)}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value" style={{ color: '#0F172A' }}>
            -{formatCurrency(stats.outflow)}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Net Balance</span>
          <span className="stat-value" style={{ color: stats.net >= 0 ? '#10B981' : '#DC2626' }}>
            {stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Total Records</span>
          <span className="stat-value" style={{ fontSize: '1.2rem' }}>
            {stats.totalCount} records <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>({stats.incomeCount} In • {stats.expenseCount} Out)</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Flow Type Filter */}
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All (Income & Expenses)</option>
            <option value="INCOME">Income Only (+)</option>
            <option value="EXPENSE">Expenses Only (-)</option>
          </select>

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

          {/* Payment Method Filter */}
          <select
            className="form-select"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="ALL">All Payment Modes</option>
            <option value="CARD">Card (Credit/Debit)</option>
            <option value="UPI">UPI / Digital Wallet</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
          </select>
        </div>

        {/* Date Presets Row */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginRight: '0.35rem' }}>
            Period:
          </span>
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

      {/* Transaction Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Loading transaction records...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Receipt size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.35rem' }}>
              No Transactions Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              No inflows or outflows matched your active search and filter criteria.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Title & Description</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Category / Flow</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Channel</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600', textAlign: 'center' }}>Receipt</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  const catName = tx.category?.name || (isIncome ? 'Salary / Income' : 'General');
                  const catColor = tx.category?.colorCode || (isIncome ? '#10B981' : '#64748B');

                  return (
                    <tr 
                      key={tx.id} 
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'var(--transition)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A' }}>{tx.title}</div>
                        {tx.description && (
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                            {tx.description}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span 
                          className="badge" 
                          style={{ 
                            background: isIncome ? '#ECFDF5' : '#F1F5F9', 
                            color: isIncome ? '#059669' : '#334155', 
                            borderColor: isIncome ? '#A7F3D0' : '#E2E8F0',
                            fontSize: '0.725rem'
                          }}
                        >
                          <Tag size={11} color={catColor} />
                          {catName}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', color: '#64748B' }}>
                        {formatDate(tx.transactionDate || tx.expenseDate)}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#475569'
                        }}>
                          {tx.paymentMethod || 'CARD'}
                        </span>
                      </td>

                      <td style={{ 
                        padding: '1rem 1.25rem', 
                        textAlign: 'right', 
                        fontWeight: '800', 
                        fontSize: '0.95rem',
                        color: isIncome ? '#10B981' : '#0F172A' 
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        {tx.receiptUrl ? (
                          <button
                            onClick={() => setSelectedReceiptTx(tx)}
                            className="btn btn-secondary btn-icon"
                            title="View Receipt Attachment"
                            style={{ padding: '0.35rem', color: '#10B981', borderColor: '#A7F3D0' }}
                          >
                            <Paperclip size={14} />
                          </button>
                        ) : (
                          <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="btn btn-secondary btn-icon"
                          title="Delete Transaction"
                          style={{ color: '#DC2626', borderColor: '#FECACA', padding: '0.35rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Salary Log Modal */}
      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Log Monthly Salary & Inflows">
        <form onSubmit={handleCreateIncome}>
          <div className="form-group">
            <label className="form-label">Income Source / Title *</label>
            <input
              type="text"
              required
              className="form-input"
              value={incomeForm.title}
              onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
              placeholder="e.g. Monthly Salary - September 2026"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Inflow Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              className="form-input"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
              placeholder="e.g. 75000"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={incomeForm.transactionDate}
                onChange={(e) => setIncomeForm({ ...incomeForm, transactionDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Channel</label>
              <select
                className="form-select"
                value={incomeForm.paymentMethod}
                onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value })}
              >
                <option value="BANK_TRANSFER">Direct Deposit / Wire</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="CARD">Debit Card</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsIncomeModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Inflow
            </button>
          </div>
        </form>
      </Modal>

      {/* Receipt Image Modal */}
      {selectedReceiptTx && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedReceiptTx(null)}
          title={`Receipt: ${selectedReceiptTx.title}`}
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <img 
              src={selectedReceiptTx.receiptUrl} 
              alt="Receipt Attachment" 
              style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E2E8F0' }}
            />
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748B' }}>
              Attached for transaction on <strong>{formatDate(selectedReceiptTx.transactionDate || selectedReceiptTx.expenseDate)}</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
