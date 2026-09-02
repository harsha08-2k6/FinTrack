import React, { useState, useEffect, useMemo } from 'react';
import { reportService } from '../services/reportService';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { formatCurrency } from '../utils/formatCurrency';
import { StockMarketChart } from '../components/StockMarketChart';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Wallet, 
  Target, 
  Activity, 
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  Percent
} from 'lucide-react';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState('6M'); // '1M' | '3M' | '6M' | '1Y' | 'ALL'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashData, trendsData, breakdownData, expData] = await Promise.all([
        reportService.getDashboardReport().catch(() => null),
        reportService.getMonthlyTrends().catch(() => []),
        reportService.getCategoryBreakdown().catch(() => []),
        expenseService.getExpenses({ size: 200 }).catch(() => ({ content: [] }))
      ]);

      if (dashData) setReport(dashData);
      if (Array.isArray(trendsData)) setTrends(trendsData);
      if (Array.isArray(breakdownData)) setBreakdown(breakdownData);
      
      const expList = Array.isArray(expData) ? expData : (expData?.content || []);
      setExpenses(expList);
    } catch (err) {
      console.error('Error fetching analytics intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered trends based on timeRange
  const filteredTrends = useMemo(() => {
    if (!trends || trends.length === 0) return [];
    if (timeRange === '1M') return trends.slice(-1);
    if (timeRange === '3M') return trends.slice(-3);
    if (timeRange === '6M') return trends.slice(-6);
    if (timeRange === '1Y') return trends.slice(-12);
    return trends;
  }, [trends, timeRange]);

  // Payment Method Breakdown computation
  const paymentMethodStats = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const map = {};
    let total = 0;
    expenses.forEach(exp => {
      const method = exp.paymentMethod || 'CARD';
      const amt = parseFloat(exp.amount) || 0;
      map[method] = (map[method] || 0) + amt;
      total += amt;
    });

    const labels = {
      'CARD': 'Credit / Debit Card',
      'UPI': 'UPI & Digital Wallets',
      'CASH': 'Cash Outflow',
      'BANK_TRANSFER': 'Bank Wire / EFT',
      'OTHER': 'Other Payment Rails'
    };

    const colors = {
      'CARD': '#10B981',
      'UPI': '#059669',
      'CASH': '#F59E0B',
      'BANK_TRANSFER': '#6366F1',
      'OTHER': '#64748B'
    };

    return Object.entries(map).map(([key, value]) => ({
      key,
      label: labels[key] || key,
      color: colors[key] || '#10B981',
      amount: value,
      percentage: total > 0 ? (value / total) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Key Analytics Calculations
  const analyticsSummary = useMemo(() => {
    const totalSpent = report?.totalSpendAllTime || breakdown.reduce((acc, b) => acc + (parseFloat(b.totalAmount) || 0), 0);
    const currentMonthSpend = report?.currentMonthSpend || 0;
    const momChange = report?.monthOverMonthChangePercentage || 0;

    // Daily Average (over 30 days)
    const dailyAvg = currentMonthSpend > 0 ? currentMonthSpend / new Date().getDate() : 0;
    const projectedMonthSpend = dailyAvg * 30;

    // Highest Expense in list
    const highestExpense = expenses.reduce((max, e) => (parseFloat(e.amount) > parseFloat(max.amount || 0) ? e : max), {});

    // Over budget count
    const totalBudget = breakdown.reduce((acc, b) => acc + (parseFloat(b.budgetLimit) || 0), 0);
    const overBudgetCategories = breakdown.filter(b => b.overBudget);

    return {
      totalSpent,
      currentMonthSpend,
      momChange,
      dailyAvg,
      projectedMonthSpend,
      highestExpense,
      totalBudget,
      overBudgetCategoriesCount: overBudgetCategories.length
    };
  }, [report, breakdown, expenses]);

  // Max spend for trend visualization scaling
  const maxTrendSpend = useMemo(() => {
    const max = filteredTrends.reduce((m, t) => Math.max(m, parseFloat(t.totalSpent) || 0), 0);
    return max > 0 ? max * 1.15 : 1000;
  }, [filteredTrends]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#10B981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem auto'
        }}></div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>Generating Financial Intelligence...</h3>
        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Crunching real-time trajectories, category velocity & budget variances
        </p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Top Header & Analytics Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                Spending Analytics
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                Visual charts and insights into your daily, monthly, and category spending habits
              </p>
            </div>
          </div>
        </div>

        {/* Time Window Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#FFFFFF',
          padding: '0.35rem',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          {[
            { id: '1M', label: '1M' },
            { id: '3M', label: '3M' },
            { id: '6M', label: '6M' },
            { id: '1Y', label: '1Y' },
            { id: 'ALL', label: 'All Time' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: 'none',
                background: timeRange === t.id ? '#10B981' : 'transparent',
                color: timeRange === t.id ? '#FFFFFF' : '#64748B',
                fontSize: '0.8rem',
                fontWeight: timeRange === t.id ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={fetchData}
            title="Refresh Data"
            style={{
              padding: '0.4rem',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Intelligence KPI Matrix */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* KPI 1: Current Outflow */}
        <div className="card" style={{ padding: '1.4rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#10B981' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              This Month's Spending
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
            {formatCurrency(analyticsSummary.currentMonthSpend)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', fontSize: '0.8rem' }}>
            {analyticsSummary.momChange >= 0 ? (
              <span style={{ color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={15} color="#16A34A" /> +{analyticsSummary.momChange.toFixed(1)}%
              </span>
            ) : (
              <span style={{ color: '#DC2626', fontWeight: '700', display: 'flex', alignItems: 'center' }}>
                <ArrowDownRight size={15} color="#DC2626" /> {analyticsSummary.momChange.toFixed(1)}%
              </span>
            )}
            <span style={{ color: '#94A3B8' }}>vs last month</span>
          </div>
        </div>

        {/* KPI 2: Average Daily Spend */}
        <div className="card" style={{ padding: '1.4rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#059669' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Daily Spend
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
            {formatCurrency(analyticsSummary.dailyAvg)}
            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748B' }}> / day</span>
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#64748B' }}>
            Estimated Month Total: <strong style={{ color: '#0F172A' }}>{formatCurrency(analyticsSummary.projectedMonthSpend)}</strong>
          </div>
        </div>

        {/* KPI 3: Overall Budget Health */}
        <div className="card" style={{ padding: '1.4rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: analyticsSummary.overBudgetCategoriesCount > 0 ? '#F59E0B' : '#10B981' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Budget Used
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
            {analyticsSummary.totalBudget > 0 
              ? `${Math.min(100, (analyticsSummary.currentMonthSpend / analyticsSummary.totalBudget * 100)).toFixed(0)}%` 
              : 'N/A'}
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: analyticsSummary.overBudgetCategoriesCount > 0 ? '#DC2626' : '#10B981', fontWeight: '600' }}>
            {analyticsSummary.overBudgetCategoriesCount > 0 
              ? `${analyticsSummary.overBudgetCategoriesCount} categories over limit`
              : 'All categories within budget'}
          </div>
        </div>

        {/* KPI 4: Biggest Single Expense */}
        <div className="card" style={{ padding: '1.4rem', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#0F172A' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Biggest Expense
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
            {formatCurrency(analyticsSummary.highestExpense.amount || 0)}
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {analyticsSummary.highestExpense.title || 'No transactions logged'}
          </div>
        </div>
      </div>

      {/* Main Visuals Grid: Monthly Trajectory Chart & Category Share */}
      <div className="grid-2" style={{ marginBottom: '2rem', gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Visual 1: Stock Market Trajectory Chart */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <StockMarketChart 
            data={filteredTrends} 
            title="Monthly Spending Trajectory"
            subtext="Interactive market timeline with live price crosshair scrubber"
            height={260}
          />
        </div>

        {/* Visual 2: Category Distribution Matrix */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieChartIcon size={18} color="#10B981" />
                Category Outflow Share
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Spending concentration by budget category
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {breakdown.slice(0, 5).map((cat) => {
              const spent = parseFloat(cat.totalAmount) || 0;
              const percent = cat.percentage ? parseFloat(cat.percentage) : 0;
              const color = cat.colorCode || '#10B981';

              return (
                <div key={cat.categoryId || cat.categoryName}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                      <span style={{ fontWeight: '600', color: '#0F172A' }}>{cat.categoryName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>{formatCurrency(spent)}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({percent.toFixed(1)}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, Math.max(2, percent))}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Intelligence: Payment Method Channels & Smart Insights AI */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Payment Channels Breakdown */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <CreditCard size={18} color="#10B981" />
            Payment Rails & Channels
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
            Expenditure split across cards, UPI, cash, and bank transfers
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {paymentMethodStats.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>No payment method data recorded.</p>
            ) : (
              paymentMethodStats.map(method => (
                <div key={method.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: method.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1E293B' }}>{method.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>{formatCurrency(method.amount)}</span>
                    <span style={{ fontSize: '0.75rem', background: '#E2E8F0', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: '700', color: '#475569' }}>
                      {method.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Smart Financial Insights Assistant */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#10B981" />
              Automated Financial Insights
            </h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Live AI Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#15803D', display: 'block', marginBottom: '2px' }}>
                  Spending Stability Status
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.4 }}>
                  {analyticsSummary.momChange <= 0 
                    ? `Expenses dropped by ${Math.abs(analyticsSummary.momChange).toFixed(1)}% compared to last cycle. Budget efficiency remains optimal.`
                    : `Expenditure increased by ${analyticsSummary.momChange.toFixed(1)}% this month. Monitoring discretionary categories is advised.`}
                </p>
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', gap: '0.75rem' }}>
              <Target size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block', marginBottom: '2px' }}>
                  Primary Cost Driver
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  <strong>{report?.topSpendingCategory || 'Food & Dining'}</strong> accounts for the largest share of outflows at {formatCurrency(report?.topSpendingCategoryAmount || 0)}.
                </p>
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', gap: '0.75rem' }}>
              <Layers size={20} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.85rem', color: '#334155', display: 'block', marginBottom: '2px' }}>
                  Transaction Velocity
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  Total of <strong>{report?.totalTransactions || expenses.length}</strong> corporate transactions registered in the ledger with an average transaction value of <strong>{formatCurrency(expenses.length > 0 ? analyticsSummary.totalSpent / expenses.length : 0)}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
