class ContactService {
  constructor() {
    this.tableName = 'contact_c';
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
      email: record.email_c,
      phone: record.phone_c,
      company: record.company_c,
      lastContactDate: record.last_contact_date_c,
      notes: record.notes_c,
      createdAt: record.created_at_c,
      updatedAt: record.updated_at_c,
      companyId: record.company_id_c?.Id || record.company_id_c
    };
  }

  mapToDatabase(data) {
    const mappedData = {
      Name: data.name,
      email_c: data.email,
      phone_c: data.phone,
      company_c: data.company,
      last_contact_date_c: data.lastContactDate,
      notes_c: data.notes,
      created_at_c: data.createdAt,
      updated_at_c: data.updatedAt
    };

    // Handle lookup field - convert to integer
    if (data.companyId !== undefined && data.companyId !== null) {
      mappedData.company_id_c = parseInt(data.companyId);
    }

    return mappedData;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "last_contact_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "company_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "last_contact_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "company_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(contactData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...contactData,
        lastContactDate: null,
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
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to create contact');
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...contactData,
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
          console.error(`Failed to update ${failed.length} contacts:`, failed);
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to update contact');
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          throw new Error('Failed to delete contact');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const contactService = new ContactService();