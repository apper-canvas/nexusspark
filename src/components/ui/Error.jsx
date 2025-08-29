import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="text-center">
      <div className="py-12">
        <ApperIcon name="AlertCircle" className="mx-auto h-12 w-12 text-error mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">Oops!</h3>
        <p className="text-slate-500 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;