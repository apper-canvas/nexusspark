import { useState } from "react";
import { format } from "date-fns";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import AddQuoteModal from "@/components/organisms/AddQuoteModal";

const QuoteDetailModal = ({ quote, isOpen, onClose, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!quote) return null;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Draft':
        return 'default';
      case 'Sent':
        return 'info';
      case 'Accepted':
        return 'success';
      case 'Declined':
        return 'error';
      case 'Expired':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async (id, formData) => {
    await onUpdate(quote.Id, formData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    onDelete(quote.Id);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Quote Details"
        size="large"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <ApperIcon name="Receipt" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {quote.quoteNumber || `Q-${quote.Id}`}
                </h3>
                <p className="text-sm text-slate-500">Quote Details</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(quote.status)}>
              {quote.status || 'Draft'}
            </Badge>
          </div>

          {/* Quote Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quote Number
                </label>
                <p className="text-sm text-slate-900">{quote.quoteNumber || '—'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer
                </label>
                <p className="text-sm text-slate-900">{quote.customerName || '—'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact
                </label>
                <p className="text-sm text-slate-900">{quote.contactName || '—'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Amount
                </label>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(quote.totalAmount, quote.currency)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Currency
                </label>
                <p className="text-sm text-slate-900">{quote.currency || '—'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiration Date
                </label>
                <p className="text-sm text-slate-900">{formatDate(quote.expirationDate)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valid Until
                </label>
                <p className="text-sm text-slate-900">{formatDate(quote.validUntil)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Discount
                </label>
                <p className="text-sm text-slate-900">
                  {formatCurrency(quote.discount, quote.currency)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tax Amount
                </label>
                <p className="text-sm text-slate-900">
                  {formatCurrency(quote.taxAmount, quote.currency)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Approved
                </label>
                <p className="text-sm text-slate-900">
                  {quote.isApproved ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(quote.notes || quote.termsAndConditions) && (
            <div className="space-y-4 pt-4 border-t">
              {quote.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md">
                    {quote.notes}
                  </p>
                </div>
              )}

              {quote.termsAndConditions && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Terms and Conditions
                  </label>
                  <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md whitespace-pre-wrap">
                    {quote.termsAndConditions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* System Information */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <span className="font-medium">Created:</span> {formatDate(quote.createdOn)}
              </div>
              <div>
                <span className="font-medium">Modified:</span> {formatDate(quote.modifiedOn)}
              </div>
              {quote.createdByUserName && (
                <div>
                  <span className="font-medium">Created By:</span> {quote.createdByUserName}
                </div>
              )}
              {quote.assignedToUserName && (
                <div>
                  <span className="font-medium">Assigned To:</span> {quote.assignedToUserName}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
            >
              Edit Quote
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete Quote
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <AddQuoteModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onSave={handleSaveEdit}
        quote={quote}
      />
    </>
  );
};

export default QuoteDetailModal;