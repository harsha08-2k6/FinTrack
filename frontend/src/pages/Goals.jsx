import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Target, Trash2, CalendarDays, TrendingUp, WalletCards } from 'lucide-react';
import { Modal } from '../components/Modal';
import { formatCurrency } from '../utils/formatCurrency';

const STORAGE_KEY = 'fintrack_savings_goals';

const readGoals = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const Goals = () => {
  const [goals, setGoals] = useState(readGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  const [error, setError] = useState('');
  const [contributionGoal, setContributionGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionError, setContributionError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const totals = useMemo(() => goals.reduce((summary, goal) => ({
    target: summary.target + Number(goal.targetAmount),
    saved: summary.saved + Number(goal.currentAmount)
  }), { target: 0, saved: 0 }), [goals]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const targetAmount = Number(form.targetAmount);
    const currentAmount = Number(form.currentAmount || 0);
    if (!form.name.trim() || targetAmount <= 0 || currentAmount < 0 || currentAmount > targetAmount) {
      setError('Enter a goal name, a positive target, and a saved amount within the target.');
      return;
    }
    setGoals(previous => [{
      id: Date.now(),
      name: form.name.trim(),
      targetAmount,
      currentAmount,
      targetDate: form.targetDate
    }, ...previous]);
    setForm({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
    setError('');
    setIsModalOpen(false);
  };

  const updateProgress = (goal, value) => {
    const currentAmount = Math.max(0, Math.min(Number(goal.targetAmount), Number(value) || 0));
    setGoals(previous => previous.map(item => item.id === goal.id ? { ...item, currentAmount } : item));
  };

  const openContributionModal = (goal) => {
    setContributionGoal(goal);
    setContributionAmount('');
    setContributionError('');
  };

  const handleContribution = (event) => {
    event.preventDefault();
    const amount = Number(contributionAmount);
    const remaining = Number(contributionGoal.targetAmount) - Number(contributionGoal.currentAmount);
    if (amount <= 0 || amount > remaining) {
      setContributionError(`Enter an amount up to ${formatCurrency(remaining)}.`);
      return;
    }
    updateProgress(contributionGoal, Number(contributionGoal.currentAmount) + amount);
    setContributionGoal(null);
  };

  const removeGoal = (id) => {
    if (window.confirm('Delete this savings goal?')) {
      setGoals(previous => previous.filter(goal => goal.id !== id));
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div>
          <div className="dashboard-kicker"><Target size={14} /> Financial planning</div>
          <h2 style={{ fontSize: 'clamp(1.85rem, 2.7vw, 2.55rem)' }}>Savings Goals</h2>
          <p style={{ marginTop: '0.55rem', color: 'var(--text-secondary)' }}>Turn your next milestone into a clear, trackable plan.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={16} /> New Goal</button>
      </div>

      <div className="stats-ribbon">
        <div className="stat-item"><span className="stat-label">Active Goals</span><span className="stat-value">{goals.length}</span></div>
        <div className="stat-item"><span className="stat-label">Total Saved</span><span className="stat-value" style={{ color: 'var(--accent-hover)' }}>{formatCurrency(totals.saved)}</span></div>
        <div className="stat-item"><span className="stat-label">Total Targets</span><span className="stat-value">{formatCurrency(totals.target)}</span></div>
        <div className="stat-item"><span className="stat-label">Overall Progress</span><span className="stat-value">{totals.target ? `${Math.round((totals.saved / totals.target) * 100)}%` : '0%'}</span></div>
      </div>

      {goals.length === 0 ? (
        <div className="card dashboard-empty-state"><Target size={28} color="var(--accent)" style={{ marginBottom: '0.75rem' }} /><h3>No savings goals yet</h3><p style={{ marginTop: '0.35rem' }}>Create a goal for an emergency fund, trip, purchase, or any future milestone.</p></div>
      ) : (
        <div className="grid-2">
          {goals.map(goal => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div className="card" key={goal.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><div className="dashboard-transaction-icon income"><TrendingUp size={18} /></div><div><h3>{goal.name}</h3>{goal.targetDate && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}><CalendarDays size={13} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />Target {goal.targetDate}</p>}</div></div>
                  <button className="btn btn-secondary btn-icon" title="Delete goal" onClick={() => removeGoal(goal.id)}><Trash2 size={15} color="var(--danger)" /></button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.9rem' }}><strong>{formatCurrency(goal.currentAmount)}</strong><span style={{ color: 'var(--text-secondary)' }}>of {formatCurrency(goal.targetAmount)}</span></div>
                <div className="progress-bar-bg" style={{ marginTop: '0.55rem', height: '10px' }}><div className="progress-bar-fill" style={{ width: `${progress}%`, background: progress === 100 ? 'var(--accent-hover)' : 'var(--accent)' }} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.9rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--accent-hover)', fontWeight: '800' }}>{progress}% complete</span>
                  {progress < 100 && <button className="btn btn-secondary" onClick={() => openContributionModal(goal)} style={{ padding: '0.45rem 0.75rem', color: 'var(--accent-hover)', borderColor: '#A7F3D0' }}><Plus size={14} /> Add funds</button>}
                  {progress === 100 && <span className="badge badge-emerald">Goal reached</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Savings Goal">
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-group"><label className="form-label">Goal name *</label><input className="form-input" required placeholder="e.g. Emergency fund" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></div>
          <div className="grid-2"><div className="form-group"><label className="form-label">Target amount *</label><input className="form-input" required type="number" min="1" step="0.01" value={form.targetAmount} onChange={event => setForm({ ...form, targetAmount: event.target.value })} /></div><div className="form-group"><label className="form-label">Already saved</label><input className="form-input" type="number" min="0" step="0.01" value={form.currentAmount} onChange={event => setForm({ ...form, currentAmount: event.target.value })} /></div></div>
          <div className="form-group"><label className="form-label">Target date</label><input className="form-input" type="date" value={form.targetDate} onChange={event => setForm({ ...form, targetDate: event.target.value })} /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}><button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create Goal</button></div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(contributionGoal)} onClose={() => setContributionGoal(null)} title={`Add funds to ${contributionGoal?.name || 'goal'}`}>
        <form onSubmit={handleContribution}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', marginBottom: '1.25rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid var(--border-color)' }}>
            <WalletCards size={20} color="var(--accent-hover)" />
            <div><div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Remaining to reach target</div><strong>{contributionGoal && formatCurrency(Number(contributionGoal.targetAmount) - Number(contributionGoal.currentAmount))}</strong></div>
          </div>
          {contributionError && <div className="form-error" style={{ marginBottom: '1rem' }}>{contributionError}</div>}
          <div className="form-group"><label className="form-label">Contribution amount *</label><input className="form-input" autoFocus required type="number" min="0.01" step="0.01" value={contributionAmount} onChange={event => setContributionAmount(event.target.value)} placeholder="e.g. 1000" /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}><button type="button" className="btn btn-secondary" onClick={() => setContributionGoal(null)}>Cancel</button><button type="submit" className="btn btn-primary"><Plus size={15} /> Add contribution</button></div>
        </form>
      </Modal>
    </div>
  );
};
