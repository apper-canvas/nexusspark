import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import TableHeader from "@/components/molecules/TableHeader";
import { cn } from "@/utils/cn";

const CompanyTable = ({ 
  companies, 
  onCompanyClick, 
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!companies || companies.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <ApperIcon name="Building2" className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No companies</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by adding your first company.
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
                label="Company"
                sortable
                sortDirection={getSortDirection("name")}
                onSort={() => handleSort("name")}
              />
              <TableHeader
                label="Industry"
                sortable
                sortDirection={getSortDirection("industry")}
                onSort={() => handleSort("industry")}
              />
              <TableHeader
                label="Contacts"
                sortable
                sortDirection={getSortDirection("contactCount")}
                onSort={() => handleSort("contactCount")}
                className="text-center"
              />
              <TableHeader
                label="Deal Value"
                sortable
                sortDirection={getSortDirection("totalDealValue")}
                onSort={() => handleSort("totalDealValue")}
                className="text-right"
              />
              <TableHeader
                label="Last Activity"
                sortable
                sortDirection={getSortDirection("lastActivityDate")}
                onSort={() => handleSort("lastActivityDate")}
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {companies.map((company, index) => (
              <tr
                key={company.Id}
                onClick={() => onCompanyClick(company)}
                className={cn(
                  "table-row-hover transition-colors duration-150",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {company.name}
                      </div>
                      {company.address && (
                        <div className="text-xs text-slate-500 max-w-xs truncate">
                          {company.address}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{company.industry || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <ApperIcon name="Users" className="h-3 w-3 mr-1" />
                    {company.contactCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(company.totalDealValue)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500">
                    {company.lastActivityDate 
                      ? format(new Date(company.lastActivityDate), "MMM dd, yyyy")
                      : "No activity"
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;