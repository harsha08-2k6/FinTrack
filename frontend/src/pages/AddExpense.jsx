import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { reportService } from '../services/reportService';
import {
  PlusCircle,
  IndianRupee,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  X,
  Sparkles
} from 'lucide-react';

export const AddExpense = ({ onSuccess, onCancel, onNavigateCategories }) => {
  const [categories, setCategories] = useState([]);
  const [categoryBreakdowns, setCategoryBreakdowns] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CARD',
    description: '',
    receiptUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [budgetError, setBudgetError] = useState(null);
  const [incomeError, setIncomeError] = useState(null);
  const [dashboardReport, setDashboardReport] = useState(null);

  useEffect(() => {
    Promise.all([
      categoryService.getAllCategories(),
      reportService.getCategoryBreakdown(),
      reportService.getDashboardReport()
    ])
    .then(([catData, breakdownData, reportData]) => {
      if (Array.isArray(catData) && catData.length > 0) {
        setCategories(catData);
        setFormData(prev => ({ ...prev, categoryId: catData[0].id.toString() }));
      }
      if (Array.isArray(breakdownData)) {
        const breakdownMap = {};
        breakdownData.forEach(b => {
          breakdownMap[b.categoryId] = b;
        });
        setCategoryBreakdowns(breakdownMap);
      }
      if (reportData) {
        setDashboardReport(reportData);
      }
    })
    .catch(err => console.error('Could not load categories or breakdown:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickAmount = (val) => {
    setFormData(prev => ({ ...prev, amount: val.toString() }));
  };

  const handleReceiptFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receiptUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setBudgetError(null);
    setIncomeError(null);

    const expenseAmount = parseFloat(formData.amount);

    if (!formData.amount || expenseAmount <= 0) {
      setError('Please enter a valid positive expense amount.');
      return;
    }

    if (!formData.categoryId) {
      setError('Please select a valid expense category.');
      return;
    }

    const selectedCatId = parseInt(formData.categoryId, 10);
    const breakdown = categoryBreakdowns[selectedCatId];
    const selectedCategory = categories.find(c => c.id === selectedCatId);
    
    if (breakdown && selectedCategory) {
      const budgetLimit = selectedCategory.budgetLimit || breakdown.budgetLimit || 0;
      if (budgetLimit > 0) {
        const currentSpent = breakdown.totalSpent || breakdown.totalAmount || 0;
        if (currentSpent + expenseAmount > budgetLimit) {
           setBudgetError({
             spent: currentSpent,
             limit: budgetLimit,
             amount: expenseAmount
           });
           return;
        }
      }
    }

    if (dashboardReport) {
      const currentMonthIncome = dashboardReport.currentMonthIncome || dashboardReport.totalIncomeAllTime || 0;
      const currentMonthSpend = dashboardReport.currentMonthSpend || dashboardReport.totalSpendAllTime || 0;
      
      if (currentMonthIncome > 0 && (currentMonthSpend + expenseAmount > currentMonthIncome)) {
        setIncomeError({
          income: currentMonthIncome,
          spent: currentMonthSpend,
          amount: expenseAmount
        });
        return;
      } else if (currentMonthIncome === 0) {
        setIncomeError({
          income: 0,
          spent: currentMonthSpend,
          amount: expenseAmount
        });
        return;
      }
    }

    setLoading(true);
    try {
      await transactionService.createExpense({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId, 10),
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
        description: formData.description.trim(),
        receiptUrl: formData.receiptUrl || null
      });

      setSuccessMsg('Expense logged successfully!');
      setFormData({
        title: '',
        amount: '',
        categoryId: categories[0]?.id?.toString() || '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'CARD',
        description: '',
        receiptUrl: ''
      });

      if (onSuccess) {
        setTimeout(onSuccess, 600);
      }
    } catch (err) {
      setError(err.message || 'Failed to record expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0F172A' }}>Record New Expense</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Enter your expense amount, category, and payment method
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {budgetError && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <AlertCircle size={18} />
              <span>Budget Limit Reached!</span>
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              You have already spent <strong>₹{budgetError.spent.toFixed(2)}</strong> of your <strong>₹{budgetError.limit.toFixed(2)}</strong> budget for this category. Adding ₹{budgetError.amount.toFixed(2)} will exceed your limit.
            </p>
            {onNavigateCategories && (
              <button 
                type="button" 
                onClick={onNavigateCategories}
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.4rem 0.8rem',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Change Category Budget
              </button>
            )}
          </div>
        )}

        {incomeError && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            color: '#B45309',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <AlertCircle size={18} />
              <span>Insufficient Income Warning!</span>
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {incomeError.income === 0 
                ? `You haven't logged any income yet! How can you spend without earning? Please log your income first.`
                : `You only have ₹${incomeError.income.toFixed(2)} in income, but adding ₹${incomeError.amount.toFixed(2)} will bring your total expenses to ₹${(incomeError.spent + incomeError.amount).toFixed(2)}. You cannot spend more than you earn!`
              }
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Expense Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Monthly Grocery Restock, Fuel"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  className="form-input"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem', fontSize: '1.1rem', fontWeight: '700' }}
                />
                <IndianRupee size={17} color="#0F172A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {/* Quick Amount presets in INR */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                {[100, 250, 500, 1000, 2500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      color: '#334155',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="categoryId"
                className="form-select"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Date</label>
              <input
                type="date"
                name="expenseDate"
                className="form-input"
                value={formData.expenseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="CARD">Credit / Debit Card</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Receipt Attachment Section */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Receipt Attachment (Optional)</span>
              {formData.receiptUrl && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, receiptUrl: '' }))}
                  style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <X size={12} /> Remove Attachment
                </button>
              )}
            </label>

            {formData.receiptUrl ? (
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                maxHeight: '180px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FAFC'
              }}>
                <img
                  src={formData.receiptUrl}
                  alt="Receipt Preview"
                  style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                />
                <span className="badge badge-emerald" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <CheckCircle2 size={11} /> Attached
                </span>
              </div>
            ) : (
              <label className="receipt-dropzone" style={{ display: 'block' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptFileChange}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={26} color="#64748B" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>
                    Click to upload receipt image (PNG, JPG)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Max file size 2MB or use presets above
                  </span>
                </div>
              </label>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Notes & Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              className="form-textarea"
              placeholder="Add optional notes, merchant details, or location..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ minWidth: '160px' }}
            >
              {loading ? 'Saving Entry...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
