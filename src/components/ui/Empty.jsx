import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <Card className="text-center">
      <div className="py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 mb-6">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="btn-primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;