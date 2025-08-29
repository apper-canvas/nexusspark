import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import TableHeader from "@/components/molecules/TableHeader";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ContactTable = ({ 
  contacts, 
  onContactClick, 
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

  if (!contacts || contacts.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <ApperIcon name="Users" className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No contacts</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first contact.
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
                label="Name"
                sortable
                sortDirection={getSortDirection("name")}
                onSort={() => handleSort("name")}
              />
              <TableHeader
                label="Email"
                sortable
                sortDirection={getSortDirection("email")}
                onSort={() => handleSort("email")}
              />
              <TableHeader
                label="Phone"
                sortable
                sortDirection={getSortDirection("phone")}
                onSort={() => handleSort("phone")}
              />
              <TableHeader
                label="Company"
                sortable
                sortDirection={getSortDirection("company")}
                onSort={() => handleSort("company")}
              />
              <TableHeader
                label="Last Contact"
                sortable
                sortDirection={getSortDirection("lastContactDate")}
                onSort={() => handleSort("lastContactDate")}
              />
              <TableHeader label="Status" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {contacts.map((contact, index) => (
              <tr
                key={contact.Id}
                onClick={() => onContactClick(contact)}
                className={cn(
                  "table-row-hover transition-colors duration-150",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {contact.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{contact.phone || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{contact.company || "—"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500">
                    {contact.lastContactDate 
                      ? format(new Date(contact.lastContactDate), "MMM dd, yyyy")
                      : "Never"
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="success">Active</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;