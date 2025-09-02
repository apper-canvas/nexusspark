import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { transactionsService } from "@/services/api/transactionsService";
import { cn } from "@/utils/cn";
import AddTransactionModal from "@/components/organisms/AddTransactionModal";
import TransactionTable from "@/components/organisms/TransactionTable";
import TransactionDetailModal from "@/components/organisms/TransactionDetailModal";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const TransactionsPage = () => {
  const { toggleSidebar } = useOutletContext();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "desc" });

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionsService.getAll();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(transaction => 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  // Sorting functionality
  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ field, direction });

    const sorted = [...filteredTransactions].sort((a, b) => {
      let aValue = a[field] || "";
      let bValue = b[field] || "";

      // Handle date fields
      if (field === "date" || field === "createdAt" || field === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric fields
      if (field === "amount") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Handle string fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(sorted);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionsService.create(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      setFilteredTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      console.error("Error adding transaction:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header
          title="Transactions"
          onMenuClick={toggleSidebar}
        />
        <div className="p-6">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header
          title="Transactions"
          onMenuClick={toggleSidebar}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadTransactions} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Transactions"
        onMenuClick={toggleSidebar}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={() => setShowAddModal(true)}
        buttonText="Add Transaction"
      />
      
      <div className="p-6">
        {transactions.length === 0 ? (
          <Empty
            title="No transactions yet"
            description="Start tracking your financial transactions by adding your first transaction."
            actionLabel="Add Transaction"
            onAction={() => setShowAddModal(true)}
            icon="CreditCard"
          />
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            onTransactionClick={handleTransactionClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default TransactionsPage;