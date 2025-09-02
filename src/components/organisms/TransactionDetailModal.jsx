import { format } from "date-fns";
import Modal from "@/components/molecules/Modal";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  if (!transaction) return null;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'invoice':
        return 'primary';
      case 'payment':
        return 'success';
      case 'refund':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Transaction Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {transaction.transactionId}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Reference: {transaction.referenceNumber}
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getTypeBadgeVariant(transaction.type)}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Badge>
            <Badge variant={getStatusBadgeVariant(transaction.status)}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {transaction.paymentMethod?.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Client</label>
              <div className="mt-1 text-sm text-slate-900">{transaction.clientName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Transaction Date</label>
              <div className="mt-1 text-sm text-slate-900">
                {format(new Date(transaction.date), "MMMM dd, yyyy 'at' h:mm a")}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <div className="mt-1 text-sm text-slate-900">{transaction.currency}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Payment Method</label>
              <div className="mt-1 text-sm text-slate-900">
                {transaction.paymentMethod?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Created</label>
              <div className="mt-1 text-sm text-slate-900">
                {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Last Updated</label>
              <div className="mt-1 text-sm text-slate-900">
                {format(new Date(transaction.updatedAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {transaction.description && (
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <div className="mt-1 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-900">{transaction.description}</p>
            </div>
          </div>
        )}

        {/* Status Info */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <ApperIcon name="Info" className="h-4 w-4" />
            <span>
              Transaction {transaction.status === 'completed' ? 'completed' : 
                          transaction.status === 'pending' ? 'is pending' : 
                          transaction.status === 'failed' ? 'failed' : 
                          transaction.status === 'overdue' ? 'is overdue' : 'status unknown'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailModal;