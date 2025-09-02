import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import TableHeader from "@/components/molecules/TableHeader";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TransactionTable = ({ 
  transactions, 
  onTransactionClick, 
  sortConfig, 
  onSort 
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortDirection = (field) => {
    if (sortConfig?.field === field) {
      return sortConfig.direction;
    }
    return null;
  };

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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <ApperIcon name="CreditCard" className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No transactions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first transaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <TableHeader
                label="Transaction ID"
                sortable
                sortDirection={getSortDirection("transactionId")}
                onSort={() => handleSort("transactionId")}
              />
              <TableHeader
                label="Type"
                sortable
                sortDirection={getSortDirection("type")}
                onSort={() => handleSort("type")}
              />
              <TableHeader
                label="Amount"
                sortable
                sortDirection={getSortDirection("amount")}
                onSort={() => handleSort("amount")}
              />
              <TableHeader
                label="Client"
                sortable
                sortDirection={getSortDirection("clientName")}
                onSort={() => handleSort("clientName")}
              />
              <TableHeader
                label="Date"
                sortable
                sortDirection={getSortDirection("date")}
                onSort={() => handleSort("date")}
              />
              <TableHeader
                label="Status"
                sortable
                sortDirection={getSortDirection("status")}
                onSort={() => handleSort("status")}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.Id}
                onClick={() => onTransactionClick(transaction)}
                className={cn(
                  "table-row-hover transition-colors duration-150",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {transaction.transactionId}
                  </div>
                  <div className="text-sm text-slate-500">
                    {transaction.referenceNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getTypeBadgeVariant(transaction.type)}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {transaction.paymentMethod?.replace('_', ' ').toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{transaction.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {format(new Date(transaction.date), "h:mm a")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusBadgeVariant(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;