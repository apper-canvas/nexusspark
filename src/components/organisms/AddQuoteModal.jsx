import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const AddQuoteModal = ({ isOpen, onClose, onSave, quote = null }) => {
  const [formData, setFormData] = useState({
    name: quote?.name || '',
    quoteNumber: quote?.quoteNumber || '',
    customerId: quote?.customerId || '',
    contactId: quote?.contactId || '',
    expirationDate: quote?.expirationDate || '',
    status: quote?.status || 'Draft',
    totalAmount: quote?.totalAmount || '',
    currency: quote?.currency || 'USD',
    validUntil: quote?.validUntil || '',
    notes: quote?.notes || '',
    termsAndConditions: quote?.termsAndConditions || '',
    discount: quote?.discount || '',
    taxAmount: quote?.taxAmount || '',
    isApproved: quote?.isApproved || false,
    approvedBy: quote?.approvedBy || '',
    approvalDate: quote?.approvalDate || '',
    createdByUserId: quote?.createdByUserId || '',
    assignedToUserId: quote?.assignedToUserId || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quoteNumber?.trim()) {
      toast.error('Quote number is required');
      return;
    }

    try {
      setLoading(true);
      await onSave(quote?.Id || null, formData);
      onClose();
      setFormData({
        name: '',
        quoteNumber: '',
        customerId: '',
        contactId: '',
        expirationDate: '',
        status: 'Draft',
        totalAmount: '',
        currency: 'USD',
        validUntil: '',
        notes: '',
        termsAndConditions: '',
        discount: '',
        taxAmount: '',
        isApproved: false,
        approvedBy: '',
        approvalDate: '',
        createdByUserId: '',
        assignedToUserId: ''
      });
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={quote ? "Edit Quote" : "Add New Quote"}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Quote Number" required>
            <Input
              type="text"
              value={formData.quoteNumber}
              onChange={(e) => handleInputChange('quoteNumber', e.target.value)}
              placeholder="Enter quote number"
              disabled={loading}
            />
          </FormField>

          <FormField label="Status">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              disabled={loading}
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
              <option value="Expired">Expired</option>
            </select>
          </FormField>

          <FormField label="Total Amount">
            <Input
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || '')}
              placeholder="0.00"
              disabled={loading}
            />
          </FormField>

          <FormField label="Currency">
            <Input
              type="text"
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              placeholder="USD"
              disabled={loading}
            />
          </FormField>

<FormField label="Expiration Date">
            <Input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              placeholder="Select date or type manually"
              disabled={loading}
            />
          </FormField>

<FormField label="Valid Until">
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
              placeholder="Select date or type manually"
              disabled={loading}
            />
          </FormField>

          <FormField label="Discount">
            <Input
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || '')}
              placeholder="0.00"
              disabled={loading}
            />
          </FormField>

          <FormField label="Tax Amount">
            <Input
              type="number"
              step="0.01"
              value={formData.taxAmount}
              onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || '')}
              placeholder="0.00"
              disabled={loading}
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <FormField label="Notes">
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter any additional notes..."
              disabled={loading}
            />
          </FormField>

          <FormField label="Terms and Conditions">
            <textarea
              value={formData.termsAndConditions}
              onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
              rows={4}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter terms and conditions..."
              disabled={loading}
            />
          </FormField>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.quoteNumber?.trim()}
          >
            {loading ? 'Saving...' : (quote ? 'Update Quote' : 'Create Quote')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddQuoteModal;