import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { MetricStatCard } from '../components/ReportCard';
import { formatCurrency } from '../utils/formatCurrency';
import { exportToCSV } from '../utils/exportUtils';
import { 
  PieChart, 
  TrendingUp, 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2, 
  BarChart3,
  Printer,
  FileSpreadsheet,
  Layers,
  AlertTriangle,
  Wallet,
  IndianRupee
} from 'lucide-react';

export const Reports = () => {
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [dashData, trendsData, breakdownData] = await Promise.all([
          reportService.getDashboardReport().catch(() => null),
          reportService.getMonthlyTrends().catch(() => []),
          reportService.getCategoryBreakdown().catch(() => [])
        ]);

        if (dashData) setReport(dashData);
        if (Array.isArray(trendsData)) setTrends(trendsData);
        if (Array.isArray(breakdownData)) setBreakdown(breakdownData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const handleExportBreakdownCSV = () => {
    const columns = [
      { key: 'categoryName', label: 'Category' },
      { key: 'transactionCount', label: 'Transaction Count' },
      { key: 'budgetLimit', label: 'Budget Target (₹)', formatter: (item) => parseFloat(item.budgetLimit || 0).toFixed(2) },
      { key: 'totalAmount', label: 'Total Spent (₹)', formatter: (item) => parseFloat(item.totalAmount || 0).toFixed(2) },
      { key: 'percentage', label: 'Share (%)', formatter: (item) => item.percentage ? item.percentage.toFixed(2) : '0.00' },
      { key: 'overBudget', label: 'Budget Compliance', formatter: (item) => item.overBudget ? 'OVER_BUDGET' : 'WITHIN_BUDGET' }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    exportToCSV(breakdown, `fintrack_portfolio_breakdown_${todayStr}.csv`, columns);
  };

  const handleExportTrendsCSV = () => {
    const columns = [
      { key: 'yearMonth', label: 'Billing Period' },
      { key: 'month', label: 'Month Label' },
      { key: 'totalSpent', label: 'Expenditure (₹)', formatter: (item) => parseFloat(item.totalSpent || 0).toFixed(2) }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    exportToCSV(trends, `fintrack_monthly_trends_${todayStr}.csv`, columns);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto' }}></div>
        <p style={{ color: '#64748B' }}>Synthesizing analytics report...</p>
      </div>
    );
  }

  const maxTrendSpend = trends.reduce((max, t) => Math.max(max, parseFloat(t.totalSpent) || 0), 100);

  const totalCategoriesWithBudget = breakdown.filter(b => b.budgetLimit > 0).length;
  const breachedCategories = breakdown.filter(b => b.overBudget).length;
  const withinBudgetCategories = totalCategoriesWithBudget - breachedCategories;

  return (
    <div className="page-wrapper">
      {/* Header & Export Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0F172A' }}>Financial Analytics & Reports</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
            Comprehensive analytics, monthly trajectories, and budget compliance metrics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportBreakdownCSV}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
            title="Download Category Breakdown as CSV"
          >
            <FileSpreadsheet size={15} color="#10B981" />
            <span>Breakdown CSV</span>
          </button>
          <button
            onClick={handleExportTrendsCSV}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
            title="Download Monthly Trends as CSV"
          >
            <Layers size={15} color="#4F46E5" />
            <span>Trends CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
            title="Print or save as PDF"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <MetricStatCard
          title="Current Period Outflow"
          value={report?.currentMonthSpend || 0}
          change={report?.monthOverMonthChangePercentage}
          subtext="vs previous billing month"
          icon={CreditCard}
          valueColor="#10B981"
          iconBg="#ECFDF5"
          iconColor="#059669"
        />
        <MetricStatCard
          title="All-Time Total Spend"
          value={report?.totalSpendAllTime || 0}
          subtext={`${report?.totalTransactions || 0} lifetime transactions`}
          icon={Wallet}
          valueColor="#0F172A"
          iconBg="#F1F5F9"
          iconColor="#0F172A"
        />
        <MetricStatCard
          title="Top Spending Category"
          value={report?.topSpendingCategory || 'Food & Dining'}
          subtext={formatCurrency(report?.topSpendingCategoryAmount || 0)}
          icon={TrendingUp}
          valueColor="#0F172A"
          iconBg="#EEF2FF"
          iconColor="#4F46E5"
        />
      </div>

      {/* Budget Compliance Executive Summary Banner */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: breachedCategories > 0 ? '#FEF2F2' : '#ECFDF5',
            color: breachedCategories > 0 ? '#DC2626' : '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {breachedCategories > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>
              {breachedCategories > 0 
                ? `${breachedCategories} Budget Threshold Breach Detected` 
                : 'All Category Targets Healthy & Compliant'}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              {totalCategoriesWithBudget} configured budget limits • {withinBudgetCategories} within limit • {breachedCategories} exceeding threshold
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className={`badge ${breachedCategories > 0 ? 'badge-rose' : 'badge-emerald'}`}>
            {breachedCategories > 0 ? 'Action Recommended' : 'Optimal Compliance'}
          </span>
        </div>
      </div>

      {/* Monthly Trends Bar Chart */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A' }}>Monthly Spending Trajectory</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Historical spending comparison over recent billing cycles</p>
          </div>
          <span className="badge badge-emerald">
            <BarChart3 size={13} />
            Trend Analysis
          </span>
        </div>

        {trends.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
            No historical trend records found. Add expenses across dates to construct trends!
          </p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '240px', paddingTop: '2rem', borderBottom: '1px solid #E2E8F0', gap: '1.5rem' }}>
            {trends.map((trend) => {
              const heightPercent = Math.max(((parseFloat(trend.totalSpent) || 0) / maxTrendSpend) * 180, 15);
              return (
                <div key={trend.yearMonth} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '100px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                    {formatCurrency(trend.totalSpent)}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPercent}px`,
                      background: '#10B981',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.8s ease-out'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Breakdown Table */}
      <div className="card" style={{ background: '#FFFFFF', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A' }}>Portfolio Breakdown Matrix</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Proportional expenditure and budget headroom</p>
          </div>
          <span className="badge badge-emerald">
            <PieChart size={13} />
            Breakdown
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Transactions</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Budget Target</th>
                <th style={{ padding: '1rem', fontWeight: '600', textAlign: 'right' }}>Total Outflow</th>
                <th style={{ padding: '1rem', fontWeight: '600', textAlign: 'right' }}>Share (%)</th>
                <th style={{ padding: '1rem', fontWeight: '600', textAlign: 'center' }}>Compliance</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => {
                const isOver = item.overBudget;
                return (
                  <tr key={item.categoryId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.colorCode || '#10B981' }}></span>
                        <strong style={{ color: '#0F172A' }}>{item.categoryName}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>
                      {item.transactionCount || 0} entries
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>
                      {item.budgetLimit > 0 ? formatCurrency(item.budgetLimit) : 'None'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#334155' }}>
                      {item.percentage?.toFixed(1)}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isOver ? (
                        <span className="badge badge-rose">
                          <ShieldAlert size={12} />
                          Over Limit
                        </span>
                      ) : (
                        <span className="badge badge-emerald">
                          <CheckCircle2 size={12} />
                          Within Budget
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
