import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Income } from './pages/Income';
import { Expenses } from './pages/Expenses';
import { AddExpense } from './pages/AddExpense';
import { Categories } from './pages/Categories';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          onNavigateLogin={() => setAuthView('login')}
          onSuccess={() => setActivePage('dashboard')}
        />
      );
    }
    return (
      <Login
        onNavigateRegister={() => setAuthView('register')}
        onSuccess={() => setActivePage('dashboard')}
      />
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigateExpenses={() => setActivePage('transactions')}
            onNavigateIncome={() => setActivePage('income')}
            onNavigateAddExpense={() => setActivePage('add-expense')}
            onNavigateCategories={() => setActivePage('categories')}
          />
        );
      case 'transactions':
        return (
          <Transactions
            onNavigateAddExpense={() => setActivePage('add-expense')}
            onNavigateIncome={() => setActivePage('income')}
          />
        );
      case 'income':
        return <Income />;
      case 'expenses':
        return (
          <Expenses
            onNavigateAddExpense={() => setActivePage('add-expense')}
          />
        );
      case 'add-expense':
        return (
          <AddExpense
            onSuccess={() => setActivePage('expenses')}
            onCancel={() => setActivePage('expenses')}
          />
        );
      case 'categories':
        return <Categories />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'settings':
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <Navbar
          activePage={activePage}
          onAddExpenseClick={() => setActivePage('add-expense')}
          alertsCount={1}
        />
        <ProtectedRoute onNavigateLogin={() => setAuthView('login')}>
          {renderContent()}
        </ProtectedRoute>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
