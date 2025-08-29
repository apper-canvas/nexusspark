import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { analyticsService } from "@/services/api/analyticsService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const AnalyticsPage = () => {
  const { toggleSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getAllMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTrend = (trend) => {
    const isPositive = trend > 0;
    return {
      value: Math.abs(trend).toFixed(1) + '%',
      icon: isPositive ? 'TrendingUp' : 'TrendingDown',
      color: isPositive ? 'text-success' : 'text-error'
    };
  };

  const handleDrillDown = (section, filters = {}) => {
    // Navigate to other sections with filters
    const params = new URLSearchParams(filters).toString();
    navigate(`/${section}${params ? '?' + params : ''}`);
  };

  if (loading) return (
    <div className="flex-1 overflow-hidden">
      <Header title="Analytics" onMenuClick={toggleSidebar} />
      <div className="p-6">
        <Loading />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-1 overflow-hidden">
      <Header title="Analytics" onMenuClick={toggleSidebar} />
      <div className="p-6">
        <Error message={error} onRetry={loadMetrics} />
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Analytics" onMenuClick={toggleSidebar} />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pipeline Value Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('deals', { view: 'pipeline' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Pipeline Value</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(metrics?.pipeline?.totalValue || 0)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.pipeline && (
                  <Badge variant={metrics.pipeline.trend > 0 ? "success" : "error"} className="mb-1">
                    <ApperIcon 
                      name={formatTrend(metrics.pipeline.trend).icon} 
                      className="h-3 w-3 mr-1" 
                    />
                    {formatTrend(metrics.pipeline.trend).value}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {metrics?.pipeline?.stages?.slice(0, 3).map(stage => (
                <div key={stage.stage} className="flex justify-between text-sm">
                  <span className="text-slate-600">{stage.stage}</span>
                  <span className="font-medium">{formatCurrency(stage.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Conversion Rate Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('deals', { view: 'conversion' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-success to-green-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.conversion?.averageRate || 0}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.conversion && (
                  <Badge variant="success" className="mb-1">
                    <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />
                    {formatTrend(metrics.conversion.trend).value}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {metrics?.conversion?.rates?.slice(0, 2).map(rate => (
                <div key={`${rate.from}-${rate.to}`} className="flex justify-between text-sm">
                  <span className="text-slate-600">{rate.from} → {rate.to}</span>
                  <span className="font-medium">{rate.rate}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Summary Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('activities', { filter: 'completed' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-orange-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Activity Summary</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.activities?.thisWeek?.completionRate || 0}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.activities && (
                  <Badge variant="success" className="mb-1">
                    <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />
                    {formatTrend(metrics.activities.trend).value}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">This Week</span>
                <span className="font-medium">
                  {metrics?.activities?.thisWeek?.completed || 0}/{metrics?.activities?.thisWeek?.total || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">This Month</span>
                <span className="font-medium">
                  {metrics?.activities?.thisMonth?.completed || 0}/{metrics?.activities?.thisMonth?.total || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* Top Performers Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('contacts', { sort: 'performance' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Top Performers</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.performers?.performers?.length || 0}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.performers && (
                  <Badge variant="success" className="mb-1">
                    <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />
                    {formatTrend(metrics.performers.trend).value}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {metrics?.performers?.performers?.slice(0, 3).map(performer => (
                <div key={performer.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate">{performer.name}</span>
                  <span className="font-medium">{formatCurrency(performer.dealValue)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Deal Velocity Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('deals', { view: 'velocity' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-info to-cyan-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Deal Velocity</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics?.velocity?.averageVelocity || 0}d
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.velocity && (
                  <Badge variant="success" className="mb-1">
                    <ApperIcon name="TrendingDown" className="h-3 w-3 mr-1" />
                    {Math.abs(metrics.velocity.trend).toFixed(1)}%
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {metrics?.velocity?.stages?.slice(0, 3).map(stage => (
                <div key={stage.stage} className="flex justify-between text-sm">
                  <span className="text-slate-600">{stage.stage}</span>
                  <span className="font-medium">{stage.averageDays}d</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Forecast Widget */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            onClick={() => handleDrillDown('deals', { view: 'forecast' })}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-error to-red-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Revenue Forecast</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(metrics?.forecast?.monthly?.forecast || 0)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {metrics?.forecast && (
                  <Badge variant="success" className="mb-1">
                    <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />
                    {formatTrend(metrics.forecast.trend).value}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Monthly</span>
                <span className="font-medium">
                  {metrics?.forecast?.monthly?.confidence || 0}% confidence
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Quarterly</span>
                <span className="font-medium">
                  {formatCurrency(metrics?.forecast?.quarterly?.forecast || 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;