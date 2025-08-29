class ActivitiesService {
  constructor() {
    this.tableName = 'activity_c';
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
      type: record.type_c,
      title: record.title_c,
      description: record.description_c,
      status: record.status_c,
      priority: record.priority_c,
      dueDate: record.due_date_c,
      completedAt: record.completed_at_c,
      contactId: record.contact_id_c?.Id || record.contact_id_c,
      contactName: record.contact_name_c,
      dealId: record.deal_id_c?.Id || record.deal_id_c,
      dealTitle: record.deal_title_c,
      assignedTo: record.assigned_to_c,
      createdAt: record.created_at_c,
      updatedAt: record.updated_at_c,
      outcome: record.outcome_c
    };
  }

  mapToDatabase(data) {
    const mappedData = {
      Name: data.title,
      type_c: data.type,
      title_c: data.title,
      description_c: data.description,
      status_c: data.status,
      priority_c: data.priority,
      due_date_c: data.dueDate,
      completed_at_c: data.completedAt,
      contact_name_c: data.contactName,
      deal_title_c: data.dealTitle,
      assigned_to_c: data.assignedTo,
      created_at_c: data.createdAt,
      updated_at_c: data.updatedAt,
      outcome_c: data.outcome
    };

    // Handle lookup fields - convert to integers
    if (data.contactId !== undefined && data.contactId !== null) {
      mappedData.contact_id_c = parseInt(data.contactId);
    }
    if (data.dealId !== undefined && data.dealId !== null) {
      mappedData.deal_id_c = parseInt(data.dealId);
    }

    return mappedData;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(activityData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...activityData,
        status: activityData.status || 'pending',
        priority: activityData.priority || 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to create activity');
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...activityData,
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
          console.error(`Failed to update ${failed.length} activities:`, failed);
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to update activity');
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async complete(id, outcome = '') {
    return this.update(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      outcome: outcome.trim() || 'Task completed successfully'
    });
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
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          throw new Error('Failed to delete activity');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTasks() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["completed"]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getHistory() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": ["completed"]}],
        orderBy: [{"fieldName": "completed_at_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching history:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByContact(contactId) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [{"FieldName": "contact_id_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDeal(dealId) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        where: [{"FieldName": "deal_id_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getOverdue() {
    const now = new Date();
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "deal_title_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "outcome_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "status_c", "operator": "NotEqualTo", "values": ["completed"]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "due_date_c", "operator": "LessThan", "values": [now.toISOString()]}
              ]
            }
          ]
        }],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching overdue activities:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const activitiesService = new ActivitiesService();

// Export singleton instance
export const activitiesService = new ActivitiesService();