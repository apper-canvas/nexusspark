class DealsService {
  constructor() {
    this.tableName = 'deal_c';
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  mapFromDatabase(record) {
    return {
      Id: record.Id,
      title: record.title_c,
      contactName: record.contact_name_c,
      contactId: record.contact_id_c?.Id || record.contact_id_c,
      company: record.company_c,
      value: record.value_c,
      expectedCloseDate: record.expected_close_date_c,
      status: record.status_c,
      stage: record.stage_c,
      probability: record.probability_c,
      description: record.description_c,
      source: record.source_c,
      assignedTo: record.assigned_to_c,
      createdAt: record.created_at_c,
      updatedAt: record.updated_at_c,
      stageChangedAt: record.stage_changed_at_c,
      activities: record.activities_c ? JSON.parse(record.activities_c) : [],
      notes: record.description_c
    };
  }

  mapToDatabase(data) {
    const mappedData = {
      Name: data.title,
      title_c: data.title,
      contact_name_c: data.contactName,
      company_c: data.company,
      value_c: data.value,
      expected_close_date_c: data.expectedCloseDate,
      status_c: data.status,
      stage_c: data.stage,
      probability_c: data.probability,
      description_c: data.description || data.notes,
      source_c: data.source,
      assigned_to_c: data.assignedTo,
      created_at_c: data.createdAt,
      updated_at_c: data.updatedAt,
      stage_changed_at_c: data.stageChangedAt,
      activities_c: data.activities ? JSON.stringify(data.activities) : null
    };

    // Handle lookup field - convert to integer
    if (data.contactId !== undefined && data.contactId !== null) {
      mappedData.contact_id_c = parseInt(data.contactId);
    }

    return mappedData;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "stage_changed_at_c"}},
          {"field": {"Name": "activities_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "stage_changed_at_c"}},
          {"field": {"Name": "activities_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...dealData,
        status: dealData.status || 'active',
        stage: dealData.stage || 'Lead',
        probability: dealData.probability || 50,
        value: dealData.value || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activities: []
      });

      const params = {
        records: [mappedData]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to create deal');
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...dealData,
        updatedAt: new Date().toISOString()
      });

      const params = {
        records: [{
          Id: parseInt(id),
          ...mappedData
        }]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to update deal');
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateStatus(id, status, stage) {
    try {
      // Get current deal to track stage change
      const currentDeal = await this.getById(id);
      if (!currentDeal) {
        throw new Error("Deal not found");
      }

      const previousStage = currentDeal.stage;
      const activity = {
        id: Date.now(),
        type: 'status_change',
        description: `Deal moved from ${previousStage} to ${stage}`,
        timestamp: new Date().toISOString(),
        userId: 1,
        userName: 'System'
      };

      const updatedActivities = [...(currentDeal.activities || []), activity];

      return this.update(id, {
        status,
        stage,
        stageChangedAt: new Date().toISOString(),
        activities: updatedActivities
      });
    } catch (error) {
      console.error("Error updating deal status:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          throw new Error('Failed to delete deal');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStage(stage) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "stage_changed_at_c"}},
          {"field": {"Name": "activities_c"}}
        ],
        where: [{"FieldName": "stage_c", "Operator": "EqualTo", "Values": [stage]}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getPipelineStats() {
    try {
      const deals = await this.getAll();
      
      const stats = {
        Lead: { count: 0, value: 0 },
        Qualified: { count: 0, value: 0 },
        Proposal: { count: 0, value: 0 },
        Negotiation: { count: 0, value: 0 },
        Closed: { count: 0, value: 0 }
      };

      deals.forEach(deal => {
        if (stats[deal.stage]) {
          stats[deal.stage].count++;
          stats[deal.stage].value += deal.value || 0;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error fetching pipeline stats:", error?.response?.data?.message || error);
      return {
        Lead: { count: 0, value: 0 },
        Qualified: { count: 0, value: 0 },
        Proposal: { count: 0, value: 0 },
        Negotiation: { count: 0, value: 0 },
        Closed: { count: 0, value: 0 }
      };
    }
  }
}

export const dealsService = new DealsService();