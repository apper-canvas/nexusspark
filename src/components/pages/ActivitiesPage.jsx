import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ActivitiesPage = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Activities"
        onMenuClick={toggleSidebar}
      />

      <div className="p-6">
        <Card className="text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Activity" className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Activities Coming Soon</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Stay on top of your customer interactions with comprehensive activity tracking. Log calls, emails, meetings, and tasks all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <ApperIcon name="Phone" className="h-4 w-4 mr-2 text-primary" />
                Call Logging
              </div>
              <div className="flex items-center">
                <ApperIcon name="Mail" className="h-4 w-4 mr-2 text-primary" />
                Email Tracking
              </div>
              <div className="flex items-center">
                <ApperIcon name="CheckSquare" className="h-4 w-4 mr-2 text-primary" />
                Task Management
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActivitiesPage;