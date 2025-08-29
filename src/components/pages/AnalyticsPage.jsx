import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const AnalyticsPage = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Analytics"
        onMenuClick={toggleSidebar}
      />

      <div className="p-6">
        <Card className="text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="BarChart3" className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Analytics Dashboard Coming Soon</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Get powerful insights into your sales performance, customer relationships, and team productivity with comprehensive analytics and reporting.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-2 text-primary" />
                Performance Metrics
              </div>
              <div className="flex items-center">
                <ApperIcon name="PieChart" className="h-4 w-4 mr-2 text-primary" />
                Sales Reports
              </div>
              <div className="flex items-center">
                <ApperIcon name="Target" className="h-4 w-4 mr-2 text-primary" />
                Goal Tracking
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;