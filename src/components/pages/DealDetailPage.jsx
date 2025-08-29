import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { dealsService } from "@/services/api/dealsService";
import DealDetailModal from "@/components/organisms/DealDetailModal";

const DealDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const loadDeal = async () => {
      try {
        setLoading(true);
        setError(null);
        const dealData = await dealsService.getById(id);
        setDeal(dealData);
      } catch (err) {
        console.error('Failed to load deal:', err);
        setError(err.message || 'Failed to load deal');
        toast.error('Failed to load deal details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDeal();
    }
  }, [id]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/deals');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          title="Deal Details" 
          subtitle="Loading deal information..."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
          title="Deal Details" 
          subtitle="Error loading deal"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error 
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title={deal?.title || "Deal Details"} 
        subtitle={deal?.company || "Deal information"}
      >
        <Button
          variant="outline"
          onClick={() => navigate('/deals')}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Deals</span>
        </Button>
      </Header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {deal && (
          <DealDetailModal
            deal={deal}
            isOpen={showModal}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default DealDetailPage;