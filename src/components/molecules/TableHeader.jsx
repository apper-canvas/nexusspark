import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TableHeader = ({ 
  label, 
  sortable = false, 
  sortDirection, 
  onSort,
  className 
}) => {
  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th 
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
        sortable && "cursor-pointer hover:text-slate-700 select-none",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortable && (
          <ApperIcon 
            name={
              sortDirection === "asc" ? "ChevronUp" : 
              sortDirection === "desc" ? "ChevronDown" : "ChevronsUpDown"
            } 
            className="h-3 w-3" 
          />
        )}
      </div>
    </th>
  );
};

export default TableHeader;