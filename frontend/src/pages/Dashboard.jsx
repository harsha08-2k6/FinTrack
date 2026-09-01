import React, { useState, useEffect } from 'react';
import { MetricStatCard } from '../components/ReportCard';
import { ExpenseCard } from '../components/ExpenseCard';
import { Modal } from '../components/Modal';
import { reportService } from '../services/reportService';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ShieldAlert, 
  RefreshCw,
  Wallet,
  CheckCircle2,
  PieChart,
  IndianRupee,
  Receipt,
  Sparkles,
  PlusCircle,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export const Dashboard = ({ onNavigateExpenses, onNavigateAddExpense, onNavigateCategories }) => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Quick Budget Setup Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetInputs, setBudgetInputs] = useState({});
  const [savingBudgets, setSavingBudgets] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [reportData, expensesData, alertsData, categoryData] = await Promise.all([
        reportService.getDashboardReport().catch(() => null),
        expenseService.getExpenses({ size: 5 }).catch(() => []),
        reportService.getBudgetAlerts().catch(() => []),
        categoryService.getAllCategories().catch(() => [])
      ]);

      if (reportData) setReport(reportData);

      const expList = Array.isArray(expensesData) 
        ? expensesData 
        : (expensesData && Array.isArray(expensesData.content) ? expensesData.content : []);
      setRecentExpenses(expList);

      const alertList = Array.isArray(alertsData) 
        ? alertsData 
        : (alertsData && Array.isArray(alertsData.content) ? alertsData.content : []);
      setAlerts(alertList);

      const catList = Array.isArray(categoryData) 
        ? categoryData 
        : (categoryData && Array.isArray(categoryData.content) ? categoryData.content : []);
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete expense: ' + err.message);
    }
  };

  // Open Quick Budget Modal
  const handleOpenBudgetModal = () => {
    const initial = {};
    categories.forEach(cat => {
      initial[cat.id] = (cat.budgetLimit && cat.budgetLimit > 0) ? cat.budgetLimit.toString() : '';
    });
    setBudgetInputs(initial);
    setIsBudgetModalOpen(true);
  };

  const handleBudgetChange = (catId, value) => {
    setBudgetInputs(prev => ({ ...prev, [catId]: value }));
  };

  const handleApplyPreset = (catId, amount) => {
    setBudgetInputs(prev => ({ ...prev, [catId]: amount.toString() }));
  };

  const handleSaveAllBudgets = async (e) => {
    e.preventDefault();
    setSavingBudgets(true);
    try {
      await Promise.all(
        categories.map(cat => {
          const limitVal = parseFloat(budgetInputs[cat.id]) || 0;
          return categoryService.updateCategory(cat.id, {
            name: cat.name,
            description: cat.description || '',
            colorCode: cat.colorCode || '#10B981',
            budgetLimit: limitVal,
            icon: cat.icon || 'tag'
          });
        })
      );
      setIsBudgetModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to save budgets: ' + err.message);
    } finally {
      setSavingBudgets(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }}></div>
        <p style={{ color: '#64748B', fontWeight: '500' }}>Loading financial overview...</p>
      </div>
    );
  }

  const currentMonthSpend = report?.currentMonthSpend || 0;
  const totalAllTime = report?.totalSpendAllTime || 0;
  const totalTransactions = report?.totalTransactions || recentExpenses.length;
  const momChange = report?.monthOverMonthChangePercentage;
  const breakdowns = report?.categoryBreakdowns || [];

  // Calculate Total Budget and Budget Remaining using the same spend source as budget tracking.
  const totalBudgetLimit = categories.reduce((sum, c) => sum + (parseFloat(c.budgetLimit) || 0), 0);
  const countWithBudget = categories.filter(c => parseFloat(c.budgetLimit) > 0).length;
  const breakdownSpend = breakdowns.reduce((sum, cat) => sum + (parseFloat(cat.totalAmount) || 0), 0);
  const budgetSpendBase = breakdownSpend > 0 ? breakdownSpend : currentMonthSpend;
  const budgetRemaining = totalBudgetLimit > 0 ? totalBudgetLimit - budgetSpendBase : 0;

  const previewTotalBudget = Object.values(budgetInputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0F172A' }}>Financial Overview</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Real-time analytics and transaction telemetry from FinTrack corporate microservices
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleRefresh}
            className="btn btn-secondary"
            title="Refresh Data"
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? 'spin-anim' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Budget Alerts Banner */}
      {alerts.length > 0 && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#991B1B' }}>
              {alerts[0].title}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#B91C1C' }}>
              {alerts[0].message}
            </p>
          </div>
        </div>
      )}

      {/* User-Friendly First-Time Budget Setup Hero (Only shown when 0 Budgets Defined) */}
      {totalBudgetLimit === 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          color: '#FFFFFF',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              fontSize: '0.75rem',
              fontWeight: '700',
              marginBottom: '0.65rem'
            }}>
              <Sliders size={13} /> STEP 1: SET MONTHLY BUDGETS
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Set Your Corporate Category Budgets 🎯
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Define spending limits for your departments & categories (Food, Travel, Software, Bills) to activate real-time budget tracking, safe limits, and automated headroom alerts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenBudgetModal}
              className="btn btn-primary"
              style={{
                padding: '0.7rem 1.3rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Sliders size={16} />
              <span>Quick Set Budgets</span>
            </button>
            {onNavigateCategories && (
              <button
                onClick={onNavigateCategories}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  padding: '0.7rem 1.1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'var(--transition)'
                }}
              >
                <span>Manage in Categories</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Key Metric Stat Cards Matching Specified Palette */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Total Expenses (#0F172A) */}
        <MetricStatCard
          title="Total Expenses"
          value={totalAllTime}
          subtext={`${totalTransactions} total transactions`}
          icon={Wallet}
          valueColor="#0F172A"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
        />

        {/* Monthly Spending (#10B981) */}
        <MetricStatCard
          title="Monthly Spending"
          value={currentMonthSpend}
          change={momChange}
          subtext="Current calendar month"
          icon={CreditCard}
          valueColor="#10B981"
          iconBg="#ECFDF5"
          iconColor="#059669"
        />

        {/* Budget Remaining */}
        <MetricStatCard
          title="Budget Remaining"
          value={totalBudgetLimit > 0 ? budgetRemaining : 'Unset'}
          subtext={totalBudgetLimit > 0 ? `of ${formatCurrency(totalBudgetLimit)} budget` : 'Click Quick Set above'}
          icon={CheckCircle2}
          valueColor={totalBudgetLimit > 0 ? '#059669' : '#0F172A'}
          iconBg={totalBudgetLimit > 0 ? '#ECFDF5' : '#F1F5F9'}
          iconColor={totalBudgetLimit > 0 ? '#059669' : '#64748B'}
        />

        {/* Top Category */}
        <MetricStatCard
          title="Top Spending Category"
          value={(report?.totalSpendAllTime > 0 && report?.topSpendingCategory && report.topSpendingCategory !== 'None') ? report.topSpendingCategory : 'None yet'}
          subtext={report?.totalSpendAllTime > 0 ? formatCurrency(report?.topSpendingCategoryAmount || 0) : 'No transactions recorded'}
          icon={TrendingUp}
          valueColor="#0F172A"
          iconBg="#EEF2FF"
          iconColor="#4F46E5"
        />
      </div>

      {/* Main Breakdown Section */}
      <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
        {/* Category Breakdown Progress */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>Spending by Category</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Outflow distribution across categories</p>
            </div>
            <span className="badge badge-emerald">{breakdowns.length} Categories</span>
          </div>

          {breakdowns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #E2E8F0' }}>
              <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                No category metrics recorded yet. Log expenses to view breakdown.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {breakdowns.map((cat) => (
                <div key={cat.categoryId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>{cat.categoryName}</span>
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#0F172A' }}>{formatCurrency(cat.totalAmount)}</strong> ({cat.percentage?.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(cat.percentage || 0, 100)}%`,
                        background: cat.colorCode || '#10B981'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions List */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>Recent Transactions</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Latest captured ledger records</p>
            </div>
            <button
              onClick={onNavigateExpenses}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px dashed #E2E8F0' }}>
              <Receipt size={32} color="#10B981" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.25rem' }}>
                No Transactions Recorded
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.8rem', maxWidth: '320px', margin: '0 auto 1.25rem auto' }}>
                Start tracking your outflow to populate analytics and monitor monthly category budgets.
              </p>
              <button className="btn btn-primary" onClick={onNavigateAddExpense} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                + Record First Expense
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentExpenses.slice(0, 4).map((exp) => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Set Category Budgets Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Set Category Monthly Budgets"
      >
        <form onSubmit={handleSaveAllBudgets}>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Enter your monthly spending limit for each corporate category. Leave blank or 0 for unbudgeted categories.
          </p>

          <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {categories.map((cat) => {
              const currentVal = budgetInputs[cat.id] || '';
              return (
                <div 
                  key={cat.id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${cat.colorCode || '#10B981'}18`,
                      border: `1px solid ${cat.colorCode || '#10B981'}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.colorCode || '#10B981'
                    }}>
                      <Tag size={15} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0F172A' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{cat.description || 'Corporate category'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', width: '130px' }}>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        placeholder="0.00"
                        value={currentVal}
                        onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '1.75rem', fontSize: '0.85rem', fontWeight: '600' }}
                      />
                      <IndianRupee size={13} color="#64748B" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    {/* Quick Presets */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1000, 3000, 5000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleApplyPreset(cat.id, amt)}
                          style={{
                            padding: '0.25rem 0.45rem',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          +₹{amt / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Budget Summary Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: '600' }}>TOTAL MONTHLY ALLOCATION</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#047857' }}>
                {formatCurrency(previewTotalBudget)}
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '500' }}>
              Calculates dynamic headroom automatically
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingBudgets}
              className="btn btn-primary"
              style={{ minWidth: '150px' }}
            >
              {savingBudgets ? 'Applying Limits...' : 'Save & Apply Budgets'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
