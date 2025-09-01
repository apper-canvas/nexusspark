import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import { quotesService } from "@/services/api/quotesService";
import QuoteTable from "@/components/organisms/QuoteTable";
import AddQuoteModal from "@/components/organisms/AddQuoteModal";
import QuoteDetailModal from "@/components/organisms/QuoteDetailModal";

const QuotesPage = () => {
  const { toggleSidebar } = useOutletContext();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quotesService.getAll();
      setQuotes(data);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load quotes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteClick = (quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    setSelectedQuote(null);
  };

  const handleAddQuote = async (quoteData) => {
    try {
      const newQuote = await quotesService.create(quoteData);
      setQuotes(prev => [newQuote, ...prev]);
      toast.success('Quote created successfully');
      return newQuote;
    } catch (error) {
      toast.error(`Failed to create quote: ${error.message}`);
      throw error;
    }
  };

  const handleUpdateQuote = async (id, quoteData) => {
    try {
      const updatedQuote = await quotesService.update(id, quoteData);
      setQuotes(prev => prev.map(quote => 
        quote.Id === id ? updatedQuote : quote
      ));
      toast.success('Quote updated successfully');
      return updatedQuote;
    } catch (error) {
      toast.error(`Failed to update quote: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!confirm('Are you sure you want to delete this quote?')) {
      return;
    }

    try {
      await quotesService.delete(id);
      setQuotes(prev => prev.filter(quote => quote.Id !== id));
      toast.success('Quote deleted successfully');
      setShowDetailModal(false);
      setSelectedQuote(null);
    } catch (error) {
      toast.error(`Failed to delete quote: ${error.message}`);
    }
  };

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (!sortConfig.field) return 0;
    
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <Loading type="page" />;
  
  if (error) return (
    <div className="flex-1 overflow-hidden">
      <Header title="Quotes" onMenuClick={toggleSidebar} />
      <div className="p-6">
        <div className="text-center text-red-500">
          Error: {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Quotes"
        onMenuClick={toggleSidebar}
        onAddClick={() => setShowAddModal(true)}
        buttonText="Add Quote"
      />
      
      <div className="p-6">
        <QuoteTable 
          quotes={sortedQuotes}
          onQuoteClick={handleQuoteClick}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>

      <AddQuoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddQuote}
      />

      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          isOpen={showDetailModal}
          onClose={handleDetailModalClose}
          onUpdate={handleUpdateQuote}
          onDelete={handleDeleteQuote}
        />
      )}
    </div>
  );
};

export default QuotesPage;