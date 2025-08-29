import { contactsService } from './contactService';
import { dealsService } from './dealsService';
import { activitiesService } from './activitiesService';

class AnalyticsService {
  // Pipeline Value: Total value by stage with trend indicator
  async getPipelineValue() {
    const deals = await dealsService.getAll();
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    
    const pipelineData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage);
      const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      return { stage, value: totalValue, count: stageDeals.length };
    });
    
    const totalPipelineValue = pipelineData.reduce((sum, stage) => sum + stage.value, 0);
    const lastMonthValue = totalPipelineValue * 0.85; // Mock previous month data
    const trend = ((totalPipelineValue - lastMonthValue) / lastMonthValue * 100).toFixed(1);
    
    return {
      totalValue: totalPipelineValue,
      trend: parseFloat(trend),
      stages: pipelineData
    };
  }

  // Conversion Rate: Stage-to-stage conversion percentages
  async getConversionRates() {
    const deals = await dealsService.getAll();
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    
    const conversionRates = [];
    for (let i = 0; i < stages.length - 1; i++) {
      const currentStage = stages[i];
      const nextStage = stages[i + 1];
      
      const currentCount = deals.filter(d => d.stage === currentStage).length;
      const nextCount = deals.filter(d => d.stage === nextStage).length;
      const rate = currentCount > 0 ? (nextCount / currentCount * 100).toFixed(1) : 0;
      
      conversionRates.push({
        from: currentStage,
        to: nextStage,
        rate: parseFloat(rate)
      });
    }
    
    const avgConversion = conversionRates.reduce((sum, cr) => sum + cr.rate, 0) / conversionRates.length;
    return {
      averageRate: parseFloat(avgConversion.toFixed(1)),
      rates: conversionRates,
      trend: 5.2 // Mock trend
    };
  }

  // Activity Summary: Tasks completed vs created this week/month
  async getActivitySummary() {
    const activities = await activitiesService.getAll();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeekActivities = activities.filter(a => new Date(a.dueDate) >= weekAgo);
    const thisMonthActivities = activities.filter(a => new Date(a.dueDate) >= monthAgo);
    
    const weekCompleted = thisWeekActivities.filter(a => a.status === 'completed').length;
    const monthCompleted = thisMonthActivities.filter(a => a.status === 'completed').length;
    
    const weekCompletionRate = thisWeekActivities.length > 0 ? 
      (weekCompleted / thisWeekActivities.length * 100).toFixed(1) : 0;
    
    return {
      thisWeek: {
        completed: weekCompleted,
        total: thisWeekActivities.length,
        completionRate: parseFloat(weekCompletionRate)
      },
      thisMonth: {
        completed: monthCompleted,
        total: thisMonthActivities.length
      },
      trend: 8.5 // Mock positive trend
    };
  }

  // Top Performers: Contacts/companies by deal value and activity count
  async getTopPerformers() {
    const deals = await dealsService.getAll();
    const contacts = await contactsService.getAll();
    const activities = await activitiesService.getAll();
    
    const performerStats = contacts.map(contact => {
      const contactDeals = deals.filter(d => d.contactId === contact.Id);
      const contactActivities = activities.filter(a => a.contactId === contact.Id);
      const totalValue = contactDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      return {
        id: contact.Id,
        name: contact.name,
        company: contact.company,
        dealValue: totalValue,
        dealCount: contactDeals.length,
        activityCount: contactActivities.length,
        score: totalValue + (contactActivities.length * 1000) // Weighted score
      };
    });
    
    const topPerformers = performerStats
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return {
      performers: topPerformers,
      trend: 12.3 // Mock trend
    };
  }

  // Deal Velocity: Average time deals spend in each pipeline stage
  async getDealVelocity() {
    const deals = await dealsService.getAll();
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    
    // Mock velocity data since we don't have stage transition history
    const stageVelocity = stages.map((stage, index) => ({
      stage,
      averageDays: [14, 7, 12, 18, 5][index], // Mock average days per stage
      dealCount: deals.filter(d => d.stage === stage).length
    }));
    
    const totalAverage = stageVelocity.reduce((sum, sv) => sum + sv.averageDays, 0) / stages.length;
    
    return {
      averageVelocity: parseFloat(totalAverage.toFixed(1)),
      stages: stageVelocity,
      trend: -6.8 // Mock improvement (negative is better for velocity)
    };
  }

  // Revenue Forecast: Projected monthly/quarterly revenue based on pipeline
  async getRevenueForecast() {
    const deals = await dealsService.getAll();
    const pipelineStats = await dealsService.getPipelineStats();
    
    const openDeals = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
    const weightedPipeline = openDeals.reduce((sum, deal) => {
      const stageWeights = { 'Lead': 0.1, 'Qualified': 0.3, 'Proposal': 0.5, 'Negotiation': 0.8 };
      return sum + ((deal.value || 0) * (stageWeights[deal.stage] || 0));
    }, 0);
    
    const closedWonThisMonth = deals
      .filter(d => d.stage === 'Closed Won')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);
    
    const monthlyForecast = closedWonThisMonth + (weightedPipeline * 0.4);
    const quarterlyForecast = monthlyForecast * 3;
    
    return {
      monthly: {
        actual: closedWonThisMonth,
        forecast: monthlyForecast,
        confidence: 75
      },
      quarterly: {
        forecast: quarterlyForecast,
        confidence: 65
      },
      trend: 18.7 // Mock positive trend
    };
  }

  // Get all analytics data in one call
  async getAllMetrics() {
    try {
      const [pipeline, conversion, activities, performers, velocity, forecast] = await Promise.all([
        this.getPipelineValue(),
        this.getConversionRates(),
        this.getActivitySummary(),
        this.getTopPerformers(),
        this.getDealVelocity(),
        this.getRevenueForecast()
      ]);

      return {
        pipeline,
        conversion,
        activities,
        performers,
        velocity,
        forecast
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();