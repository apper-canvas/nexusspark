class CompaniesService {
  constructor() {
    this.tableName = 'company_c';
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
      name: record.Name,
      industry: record.industry_c,
      address: record.address_c,
      notes: record.notes_c,
      contactCount: record.contact_count_c,
      totalDealValue: record.total_deal_value_c,
      lastActivityDate: record.last_activity_date_c,
      createdAt: record.created_at_c,
      updatedAt: record.updated_at_c
    };
  }

  mapToDatabase(data) {
    return {
      Name: data.name,
      industry_c: data.industry,
      address_c: data.address,
      notes_c: data.notes,
      contact_count_c: data.contactCount,
      total_deal_value_c: data.totalDealValue,
      last_activity_date_c: data.lastActivityDate,
      created_at_c: data.createdAt,
      updated_at_c: data.updatedAt
    };
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "total_deal_value_c"}},
          {"field": {"Name": "last_activity_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_count_c"}},
          {"field": {"Name": "total_deal_value_c"}},
          {"field": {"Name": "last_activity_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(companyData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...companyData,
        contactCount: 0,
        totalDealValue: 0,
        lastActivityDate: null,
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
          console.error(`Failed to create ${failed.length} companies:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to create company');
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, companyData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...companyData,
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
          console.error(`Failed to update ${failed.length} companies:`, failed);
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to update company');
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          throw new Error('Failed to delete company');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateCompanyMetrics(companyId) {
    try {
      // This would need to be implemented with aggregation queries
      // or calculated fields in the database. For now, we'll keep
      // the basic functionality and let the database handle metrics.
      console.log(`Company metrics update requested for company ${companyId}`);
    } catch (error) {
      console.error('Failed to update company metrics:', error);
    }
  }
}

const companiesService = new CompaniesService();
export default companiesService;

const companiesService = new CompaniesService();
export default companiesService;