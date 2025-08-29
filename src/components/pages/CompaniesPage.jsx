import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const CompaniesPage = () => {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Companies"
        onMenuClick={toggleSidebar}
      />

      <div className="p-6">
        <Card className="text-center">
          <div className="py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Building2" className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Companies Coming Soon</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Organize your business relationships at the company level. Manage accounts, track company information, and view all contacts within each organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <ApperIcon name="Users" className="h-4 w-4 mr-2 text-primary" />
                Contact Organization
              </div>
              <div className="flex items-center">
                <ApperIcon name="FileText" className="h-4 w-4 mr-2 text-primary" />
                Company Profiles
              </div>
              <div className="flex items-center">
                <ApperIcon name="BarChart3" className="h-4 w-4 mr-2 text-primary" />
                Account Analytics
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompaniesPage;