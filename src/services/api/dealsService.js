import dealsData from "@/services/mockData/deals.json";

class DealsService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = this.deals.find(deal => deal.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

async create(dealData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.deals.length > 0 
      ? Math.max(...this.deals.map(deal => deal.Id)) 
      : 0;
    
    const newDeal = {
      Id: maxId + 1,
      title: dealData.title,
      contactId: dealData.contactId,
      contactName: dealData.contactName || 'Unknown Contact',
      company: dealData.company || 'No Company',
      value: dealData.value || 0,
      probability: dealData.probability || 50,
      expectedCloseDate: dealData.expectedCloseDate,
      notes: dealData.notes || '',
      assignedTo: dealData.assignedTo || null,
      status: dealData.status || 'active',
      stage: dealData.stage || 'Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: []
    };

    this.deals.push(newDeal);
    
    // Update company metrics for the associated company
    if (newDeal.company && newDeal.company !== 'No Company') {
      try {
        const companiesService = (await import('./companiesService')).default;
        const allCompanies = await companiesService.getAll();
        const company = allCompanies.find(c => c.name === newDeal.company);
        if (company) {
          await companiesService.updateCompanyMetrics(company.Id);
        }
      } catch (error) {
        console.error('Failed to update company metrics:', error);
      }
    }
    
    return { ...newDeal };
  }

  async update(id, dealData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.deals[index] };
  }

  async updateStatus(id, status, stage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    const previousStage = this.deals[index].stage;
    const activity = {
      id: Date.now(),
      type: 'status_change',
      description: `Deal moved from ${previousStage} to ${stage}`,
      timestamp: new Date().toISOString(),
      userId: 1,
      userName: 'System'
    };

    this.deals[index] = {
      ...this.deals[index],
      status,
      stage,
      stageChangedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [...(this.deals[index].activities || []), activity]
    };

    return { ...this.deals[index] };
  }

  async delete(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    this.deals.splice(index, 1);
    return true;
  }

  async getByStage(stage) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.deals.filter(deal => deal.stage === stage);
  }

  async getPipelineStats() {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const stats = {
      Lead: { count: 0, value: 0 },
      Qualified: { count: 0, value: 0 },
      Proposal: { count: 0, value: 0 },
      Negotiation: { count: 0, value: 0 },
      Closed: { count: 0, value: 0 }
    };

    this.deals.forEach(deal => {
      if (stats[deal.stage]) {
        stats[deal.stage].count++;
        stats[deal.stage].value += deal.value || 0;
      }
    });

    return stats;
  }
}

export const dealsService = new DealsService();