import React, { useState, useEffect } from 'react';
import { MetricStatCard } from '../components/ReportCard';
import { StockMarketChart } from '../components/StockMarketChart';
import { Modal } from '../components/Modal';
import { reportService } from '../services/reportService';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  ArrowUpRight, 
  RefreshCw,
  Wallet,
  CheckCircle2,
  PieChart,
  IndianRupee,
  Receipt,
  Plus,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Tag,
  Percent,
  PiggyBank,
  Activity
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export const Dashboard = ({ onNavigateExpenses, onNavigateAddExpense, onNavigateIncome, onNavigateCategories }) => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Quick Income Modal State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeTitle, setIncomeTitle] = useState('Monthly Salary');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [savingIncome, setSavingIncome] = useState(false);

  // Quick Budget Setup Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetInputs, setBudgetInputs] = useState({});
  const [savingBudgets, setSavingBudgets] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [reportData, transactionsData, categoryData] = await Promise.all([
        reportService.getDashboardReport().catch(() => null),
        transactionService.getAllTransactions().catch(() => []),
        categoryService.getAllCategories().catch(() => [])
      ]);

      if (reportData) setReport(reportData);

      const txList = Array.isArray(transactionsData) 
        ? transactionsData 
        : (transactionsData && Array.isArray(transactionsData.content) ? transactionsData.content : []);
      setRecentTransactions(txList.slice(0, 5));

      const catList = Array.isArray(categoryData) 
        ? categoryData 
        : (categoryData && Array.isArray(categoryData.content) ? categoryData.content : []);
      setCategories(catList);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const refreshInterval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchDashboardData();
  };

  const handleQuickSaveIncome = async (e) => {
    e.preventDefault();
    if (!incomeAmount || parseFloat(incomeAmount) <= 0) return;
    setSavingIncome(true);
    try {
      await transactionService.createIncome({
        title: incomeTitle.trim(),
        amount: parseFloat(incomeAmount),
        paymentMethod: 'BANK_TRANSFER',
        transactionDate: new Date().toISOString().split('T')[0]
      });
      setIsIncomeModalOpen(false);
      setIncomeAmount('');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to log income: ' + err.message);
    } finally {
      setSavingIncome(false);
    }
  };

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
        <p style={{ color: '#64748B', fontWeight: '500' }}>Loading your dashboard...</p>
      </div>
    );
  }

  // Calculate 4 Core Pillars
  const currentMonthSpend = report?.currentMonthSpend || 0;
  const currentMonthIncome = report?.currentMonthIncome || report?.totalIncomeAllTime || 0;
  
  const totalBudget = categories.reduce((sum, cat) => sum + (cat.budgetLimit || 0), 0);
  const remainingBudget = totalBudget - currentMonthSpend;
  
  const momChange = report?.monthOverMonthChangePercentage;
  const breakdowns = report?.categoryBreakdowns || [];
  const monthlyTrends = report?.monthlyTrends || [];

  return (
    <div className="page-wrapper">
      {/* Top Banner & Quick Actions */}
      <div className="dashboard-heading" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="dashboard-kicker">
            <Activity size={13} /> Personal finance workspace
            {lastUpdated && <span className="dashboard-sync-status">Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
          </div>
          <h2>
            Financial Overview
          </h2>
          <p>
            Track your monthly salary, daily expenses, and savings goals
          </p>
        </div>
        
        <div className="dashboard-actions">
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-secondary"
            title="Refresh Data"
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? 'spin-anim' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className="btn btn-secondary"
            style={{ borderColor: '#A7F3D0', color: '#059669', background: '#ECFDF5' }}
          >
            <Plus size={15} />
            <span>Log Income</span>
          </button>

          <button
            onClick={onNavigateAddExpense}
            className="btn btn-primary"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 CORE FINANCIAL PILLARS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Pillar 1: Monthly Income */}
        <MetricStatCard
          title="Monthly Income"
          value={currentMonthIncome}
          subtext={currentMonthIncome > 0 ? "Total money earned this month" : "Click 'Log Income' above"}
          icon={Wallet}
          valueColor="#10B981"
          iconBg="#ECFDF5"
          iconColor="#10B981"
        />

        {/* Pillar 2: Total Budget */}
        <MetricStatCard
          title="Total Budget"
          value={totalBudget}
          subtext="Combined limit of all categories"
          icon={Sliders}
          valueColor="#10B981"
          iconBg="#ECFDF5"
          iconColor="#10B981"
        />

        {/* Pillar 3: Total Expenses */}
        <MetricStatCard
          title="Total Expenses"
          value={currentMonthSpend}
          change={momChange}
          subtext="Total money spent this month"
          icon={CreditCard}
          valueColor="#0F172A"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
        />

        {/* Pillar 4: Remaining Budget */}
        <MetricStatCard
          title="Remaining Budget"
          value={remainingBudget}
          subtext={remainingBudget >= 0 ? "Under your budget limit" : "Over budget!"}
          icon={remainingBudget >= 0 ? ShieldCheck : TrendingDown}
          valueColor={remainingBudget >= 0 ? "#10B981" : "#DC2626"}
          iconBg={remainingBudget >= 0 ? "#ECFDF5" : "#FEF2F2"}
          iconColor={remainingBudget >= 0 ? "#10B981" : "#DC2626"}
        />
      </div>

      {/* Main Visuals Grid: Spending Trend & Category Share */}
      <div className="grid-2 dashboard-chart-grid">
        {/* Stock Market Area Chart */}
        <div className="card dashboard-panel">
          <StockMarketChart 
            data={monthlyTrends} 
            title="Monthly Spending Trend"
            subtext="Interactive timeline showing your monthly spending habits"
            height={180}
          />
        </div>

        {/* Category Budget & Spending Breakdown */}
        <div className="card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3>Spending by Category</h3>
              <p>How your money is divided across categories</p>
            </div>
            <button 
              onClick={handleOpenBudgetModal}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Set Budgets
            </button>
          </div>

          {breakdowns.length === 0 ? (
            <div className="dashboard-empty-state">
              <p>
                No category expenses recorded yet. Add an expense to see breakdown.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {breakdowns.slice(0, 5).map((cat) => (
                <div key={cat.categoryId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>{cat.categoryName}</span>
                    <span style={{ color: '#64748B' }}>
                      <strong style={{ color: '#0F172A' }}>{formatCurrency(cat.totalAmount)}</strong> ({cat.percentage?.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(2, cat.percentage))}%`,
                        background: cat.overBudget ? '#DC2626' : (cat.colorCode || '#10B981')
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="category-panel-summary">
            <span className="category-panel-summary-label">Budget used this month</span>
            <span className="category-panel-summary-value">
              {totalBudget > 0 ? `${Math.min(100, Math.round((currentMonthSpend / totalBudget) * 100))}%` : 'No budget set'}
            </span>
            <div className="category-panel-summary-track">
              <div
                className="category-panel-summary-fill"
                style={{ width: `${totalBudget > 0 ? Math.min(100, Math.max(0, (currentMonthSpend / totalBudget) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Stream */}
      <div className="card dashboard-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-panel-header">
          <div>
            <h3>Recent Transactions</h3>
            <p>Latest income deposits and expenses</p>
          </div>
          {onNavigateExpenses && (
            <button onClick={onNavigateExpenses} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <p className="dashboard-empty-state">
            No transactions yet. Click <strong>+ Log Income</strong> or <strong>+ Add Expense</strong> to get started.
          </p>
        ) : (
          <div className="dashboard-transaction-list">
            {recentTransactions.map(tx => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div key={tx.id} className="dashboard-transaction">
                  <div className="dashboard-transaction-main">
                    <div className={`dashboard-transaction-icon ${isIncome ? 'income' : 'expense'}`}>
                      {isIncome ? <TrendingUp size={16} /> : <CreditCard size={16} />}
                    </div>
                    <div>
                      <div className="dashboard-transaction-title">{tx.title}</div>
                      <div className="dashboard-transaction-date">
                        {formatDate(tx.transactionDate || tx.expenseDate)} • {tx.paymentMethod || 'CARD'}
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-transaction-meta">
                    <div className={`dashboard-transaction-amount ${isIncome ? 'income' : ''}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <span className="badge" style={{
                      fontSize: '0.65rem',
                      background: isIncome ? '#ECFDF5' : '#F1F5F9',
                      color: isIncome ? '#059669' : '#475569',
                      borderColor: isIncome ? '#A7F3D0' : '#CBD5E1'
                    }}>
                      {isIncome ? 'INCOME' : (tx.category?.name || 'EXPENSE')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Salary Log Modal */}
      <Modal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} title="Log Income or Salary">
        <form onSubmit={handleQuickSaveIncome}>
          <div className="form-group">
            <label className="form-label">Income Source / Title</label>
            <input
              type="text"
              required
              className="form-input"
              value={incomeTitle}
              onChange={(e) => setIncomeTitle(e.target.value)}
              placeholder="e.g. Monthly Salary, Freelance project"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              className="form-input"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="e.g. 75000"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsIncomeModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={savingIncome} className="btn btn-primary">
              {savingIncome ? 'Saving...' : 'Save Income'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Budget Configuration Modal */}
      <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Set Category Monthly Budgets">
        <form onSubmit={handleSaveAllBudgets}>
          <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Assign monthly spending limits to your categories to keep your expenses under control.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '55vh', overflowY: 'auto' }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '600', color: '#0F172A', fontSize: '0.875rem' }}>{cat.name}</span>
                <div style={{ width: '150px' }}>
                  <input
                    type="number"
                    step="100"
                    placeholder="e.g. 5000"
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                    value={budgetInputs[cat.id] || ''}
                    onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsBudgetModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={savingBudgets} className="btn btn-primary">
              {savingBudgets ? 'Saving...' : 'Save Budgets'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
