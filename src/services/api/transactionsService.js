import transactionsMockData from '../mockData/transactions.json';
import { toast } from 'react-toastify';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionsService {
  constructor() {
    this.data = [...transactionsMockData];
  }

  async getAll() {
    try {
      await delay(300);
      return [...this.data];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
      return [];
    }
  }

  async getById(id) {
    try {
      await delay(200);
      const transaction = this.data.find(item => item.Id === parseInt(id));
      return transaction ? { ...transaction } : null;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      toast.error("Failed to load transaction details");
      return null;
    }
  }

  async create(transactionData) {
    try {
      await delay(400);
      const newTransaction = {
        ...transactionData,
        Id: Math.max(...this.data.map(item => item.Id)) + 1,
        transactionId: `TXN-${new Date().getFullYear()}-${String(Math.max(...this.data.map(item => item.Id)) + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.data.unshift(newTransaction);
      toast.success("Transaction created successfully");
      return { ...newTransaction };
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction");
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      await delay(350);
      const index = this.data.findIndex(item => item.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Transaction not found");
      }

      const updatedTransaction = {
        ...this.data[index],
        ...transactionData,
        updatedAt: new Date().toISOString()
      };

      this.data[index] = updatedTransaction;
      toast.success("Transaction updated successfully");
      return { ...updatedTransaction };
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      const index = this.data.findIndex(item => item.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Transaction not found");
      }

      this.data.splice(index, 1);
      toast.success("Transaction deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      await delay(300);
      return this.data.filter(transaction => transaction.status === status).map(item => ({ ...item }));
    } catch (error) {
      console.error("Error fetching transactions by status:", error);
      toast.error("Failed to load transactions");
      return [];
    }
  }

  async getByType(type) {
    try {
      await delay(300);
      return this.data.filter(transaction => transaction.type === type).map(item => ({ ...item }));
    } catch (error) {
      console.error("Error fetching transactions by type:", error);
      toast.error("Failed to load transactions");
      return [];
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      await delay(350);
      return this.data.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      }).map(item => ({ ...item }));
    } catch (error) {
      console.error("Error fetching transactions by date range:", error);
      toast.error("Failed to load transactions");
      return [];
    }
  }

  async getTotalsByStatus() {
    try {
      await delay(250);
      const totals = this.data.reduce((acc, transaction) => {
        if (!acc[transaction.status]) {
          acc[transaction.status] = { count: 0, amount: 0 };
        }
        acc[transaction.status].count++;
        acc[transaction.status].amount += transaction.amount;
        return acc;
      }, {});
      
      return totals;
    } catch (error) {
      console.error("Error calculating transaction totals:", error);
      return {};
    }
  }
}

export const transactionsService = new TransactionsService();