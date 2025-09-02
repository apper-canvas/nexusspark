import { useState } from "react";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: "invoice",
    amount: "",
    currency: "USD",
    status: "pending",
    clientName: "",
    description: "",
    paymentMethod: "bank_transfer",
    date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        clientId: Math.floor(Math.random() * 100) + 1 // Mock client ID
      };
      
      await onSave(transactionData);
      
      // Reset form
      setFormData({
        type: "invoice",
        amount: "",
        currency: "USD",
        status: "pending",
        clientName: "",
        description: "",
        paymentMethod: "bank_transfer",
        date: new Date().toISOString().split('T')[0]
      });
      
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "invoice",
      amount: "",
      currency: "USD",
      status: "pending",
      clientName: "",
      description: "",
      paymentMethod: "bank_transfer",
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Add New Transaction"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Transaction Type"
            required
            error={errors.type}
          >
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="invoice">Invoice</option>
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
            </select>
          </FormField>

          <FormField
            label="Status"
            required
            error={errors.status}
          >
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="overdue">Overdue</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Amount"
            required
            error={errors.amount}
          >
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              placeholder="0.00"
            />
          </FormField>

          <FormField
            label="Currency"
            required
            error={errors.currency}
          >
            <select
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </FormField>
        </div>

        <FormField
          label="Client Name"
          required
          error={errors.clientName}
        >
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            placeholder="Enter client name"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Date"
            required
            error={errors.date}
          >
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </FormField>

          <FormField
            label="Payment Method"
            required
            error={errors.paymentMethod}
          >
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="wire_transfer">Wire Transfer</option>
              <option value="check">Check</option>
            </select>
          </FormField>
        </div>

        <FormField
          label="Description"
          required
          error={errors.description}
        >
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none resize-none"
            placeholder="Enter transaction description"
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;