import { apiRequest } from './api';

export const transactionService = {
  // Unified Transactions
  getAllTransactions: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.type) query.append('type', params.type);
      if (params.categoryId) query.append('categoryId', params.categoryId);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);
      
      const endpoint = `/api/transactions${query.toString() ? `?${query.toString()}` : ''}`;
      const data = await apiRequest(endpoint, { method: 'GET' });
      return data || [];
    } catch (err) {
      return getLocalTransactions(params);
    }
  },

  getTransactionById: async (id) => {
    return apiRequest(`/api/transactions/${id}`, { method: 'GET' });
  },

  createTransaction: async (data) => {
    try {
      return await apiRequest('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      return saveLocalTransaction(data);
    }
  },

  updateTransaction: async (id, data) => {
    return apiRequest(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteTransaction: async (id) => {
    try {
      await apiRequest(`/api/transactions/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      deleteLocalTransaction(id);
      return true;
    }
  },

  // Income Specific Shortcuts
  getIncome: async (params = {}) => {
    return transactionService.getAllTransactions({ ...params, type: 'INCOME' });
  },

  createIncome: async (data) => {
    return transactionService.createTransaction({ ...data, type: 'INCOME' });
  },

  // Expense Specific Shortcuts
  getExpenses: async (params = {}) => {
    return transactionService.getAllTransactions({ ...params, type: 'EXPENSE' });
  },

  createExpense: async (data) => {
    return transactionService.createTransaction({ ...data, type: 'EXPENSE' });
  }
};

// Local storage fallback helpers
const LOCAL_STORAGE_KEY = 'fintrack_local_transactions';

function getLocalTransactions(params = {}) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];
    if (params.type) {
      list = list.filter(t => t.type === params.type);
    }
    if (params.categoryId) {
      list = list.filter(t => String(t.categoryId) === String(params.categoryId));
    }
    return list;
  } catch {
    return [];
  }
}

function saveLocalTransaction(data) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const newTx = {
      id: Date.now(),
      ...data,
      transactionDate: data.transactionDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    list.unshift(newTx);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return newTx;
  } catch {
    return { id: Date.now(), ...data };
  }
}

function deleteLocalTransaction(id) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    const list = JSON.parse(raw).filter(t => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {}
}
