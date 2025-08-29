import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DealsPage = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Deals"
        onMenuClick={toggleSidebar}
      />

      <div className="p-6">
        <Card className="text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Target" className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Deals Coming Soon</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Track your sales pipeline, manage opportunities, and close more deals with our comprehensive deal management system.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <ApperIcon name="DollarSign" className="h-4 w-4 mr-2 text-primary" />
                Revenue Tracking
              </div>
              <div className="flex items-center">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-2 text-primary" />
                Pipeline Management
              </div>
              <div className="flex items-center">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2 text-primary" />
                Follow-up Scheduling
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DealsPage;