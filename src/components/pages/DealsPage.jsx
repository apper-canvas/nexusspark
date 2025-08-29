import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import { dealsService } from "@/services/api/dealsService";
import DealKanbanBoard from "@/components/organisms/DealKanbanBoard";

const DealsPage = () => {
  const { toggleSidebar } = useOutletContext();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dealsService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load deals: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (dealId, newStatus, newStage) => {
    try {
      const updatedDeal = await dealsService.updateStatus(dealId, newStatus, newStage);
      setDeals(prev => prev.map(deal => 
        deal.Id === dealId ? updatedDeal : deal
      ));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error(`Failed to update deal: ${err.message}`);
    }
  };

  if (loading) return <Loading type="page" />;
  if (error) return (
    <div className="flex-1 overflow-hidden">
      <Header title="Deals" onMenuClick={toggleSidebar} />
      <div className="p-6">
        <div className="text-center text-red-500">
          Error: {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <Header
        title="Deals"
        onMenuClick={toggleSidebar}
      />
      
      <div className="p-6">
        <DealKanbanBoard 
          deals={deals} 
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default DealsPage;