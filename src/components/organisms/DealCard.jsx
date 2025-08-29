import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DealCard = ({ deal, onDragStart, onDragEnd, isDragging, onClick }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600 bg-green-100';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-100';
    if (probability >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const isOverdue = () => {
    if (!deal.expectedCloseDate) return false;
    const closeDate = new Date(deal.expectedCloseDate);
    const today = new Date();
    return closeDate < today && deal.stage !== 'Closed';
  };

  return (
<Card
      className={`p-4 cursor-move hover:shadow-md transition-all duration-200 border-l-4 ${
        deal.stage === 'Lead' ? 'border-l-slate-400' :
        deal.stage === 'Qualified' ? 'border-l-blue-400' :
        deal.stage === 'Proposal' ? 'border-l-yellow-400' :
        deal.stage === 'Negotiation' ? 'border-l-orange-400' :
        'border-l-green-400'
      } ${isDragging ? 'opacity-50 transform rotate-2' : ''}`}
      draggable="true"
      onDragStart={(e) => onDragStart(e, deal)}
      onDragEnd={onDragEnd}
      onClick={() => onClick && onClick(deal)}
    >
      {/* Deal Title */}
      <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
        {deal.title}
      </h3>

      {/* Contact & Company */}
      <div className="flex items-center text-sm text-slate-600 mb-2">
        <ApperIcon name="User" className="h-3 w-3 mr-1" />
        <span className="truncate">{deal.contactName}</span>
      </div>
      
      <div className="flex items-center text-sm text-slate-600 mb-3">
        <ApperIcon name="Building2" className="h-3 w-3 mr-1" />
        <span className="truncate">{deal.company}</span>
      </div>

      {/* Value */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-lg font-bold text-slate-900">
          <ApperIcon name="DollarSign" className="h-4 w-4 mr-1" />
          {formatCurrency(deal.value)}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(deal.probability)}`}>
          {deal.probability}%
        </div>
      </div>

      {/* Expected Close Date */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-slate-600">
          <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
          <span>Close:</span>
        </div>
        <span className={`font-medium ${
          isOverdue() ? 'text-red-600' : 'text-slate-700'
        }`}>
          {formatDate(deal.expectedCloseDate)}
        </span>
      </div>

      {/* Overdue Warning */}
      {isOverdue() && (
        <div className="flex items-center mt-2 px-2 py-1 bg-red-50 rounded text-red-700 text-xs">
          <ApperIcon name="AlertTriangle" className="h-3 w-3 mr-1" />
          <span>Overdue</span>
        </div>
      )}

      {/* Assigned To */}
      {deal.assignedTo && (
        <div className="flex items-center mt-2 text-xs text-slate-500">
          <ApperIcon name="UserCheck" className="h-3 w-3 mr-1" />
          <span>Assigned to {deal.assignedTo}</span>
        </div>
      )}
    </Card>
  );
};

export default DealCard;