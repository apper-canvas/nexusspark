import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded loading-pulse w-32"></div>
            <div className="h-8 bg-slate-200 rounded loading-pulse w-24"></div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-200">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-slate-200 rounded-full loading-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded loading-pulse w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded loading-pulse w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded loading-pulse w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
        />
        <p className="text-slate-500">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;