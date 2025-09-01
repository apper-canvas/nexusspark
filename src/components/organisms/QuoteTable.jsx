import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import TableHeader from "@/components/molecules/TableHeader";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const QuoteTable = ({ 
  quotes, 
  onQuoteClick, 
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

  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <ApperIcon name="Receipt" className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No quotes</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first quote.
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
                label="Quote #"
                sortable
                sortDirection={getSortDirection("quoteNumber")}
                onSort={() => handleSort("quoteNumber")}
              />
              <TableHeader
                label="Customer"
                sortable
                sortDirection={getSortDirection("customerName")}
                onSort={() => handleSort("customerName")}
              />
              <TableHeader
                label="Contact"
                sortable
                sortDirection={getSortDirection("contactName")}
                onSort={() => handleSort("contactName")}
              />
              <TableHeader
                label="Amount"
                sortable
                sortDirection={getSortDirection("totalAmount")}
                onSort={() => handleSort("totalAmount")}
              />
              <TableHeader
                label="Status"
                sortable
                sortDirection={getSortDirection("status")}
                onSort={() => handleSort("status")}
              />
              <TableHeader
                label="Expiry Date"
                sortable
                sortDirection={getSortDirection("expirationDate")}
                onSort={() => handleSort("expirationDate")}
              />
              <TableHeader label="Actions" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {quotes.map((quote, index) => (
              <tr
                key={quote.Id}
                onClick={() => onQuoteClick(quote)}
                className={cn(
                  "table-row-hover transition-colors duration-150",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <ApperIcon name="Receipt" className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {quote.quoteNumber || `Q-${quote.Id}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{quote.customerName || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{quote.contactName || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(quote.totalAmount, quote.currency)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(quote.status)}>
                    {quote.status || 'Draft'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500">
                    {quote.expirationDate 
                      ? format(new Date(quote.expirationDate), "MMM dd, yyyy")
                      : "—"
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuoteClick(quote);
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuoteTable;