class QuotesService {
  constructor() {
    this.tableName = 'quotes_c';
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
      tags: record.Tags,
      quoteId: record.quote_id_c,
      quoteNumber: record.quote_number_c,
      customerId: record.customer_id_c?.Id || record.customer_id_c,
      customerName: record.customer_id_c?.Name || '',
      contactId: record.contact_id_c?.Id || record.contact_id_c,
      contactName: record.contact_id_c?.Name || '',
      expirationDate: record.expiration_date_c,
      status: record.status_c,
      totalAmount: record.total_amount_c,
      currency: record.currency_c,
      validUntil: record.valid_until_c,
      notes: record.notes_c,
      termsAndConditions: record.terms_and_conditions_c,
      discount: record.discount_c,
      taxAmount: record.tax_amount_c,
      isApproved: record.is_approved_c,
      approvedBy: record.approved_by_c?.Id || record.approved_by_c,
      approvedByName: record.approved_by_c?.Name || '',
      approvalDate: record.approval_date_c,
      createdByUserId: record.created_by_user_id_c?.Id || record.created_by_user_id_c,
      createdByUserName: record.created_by_user_id_c?.Name || '',
      assignedToUserId: record.assigned_to_user_id_c?.Id || record.assigned_to_user_id_c,
      assignedToUserName: record.assigned_to_user_id_c?.Name || '',
      createdOn: record.CreatedOn,
      createdBy: record.CreatedBy?.Name || '',
      modifiedOn: record.ModifiedOn,
      modifiedBy: record.ModifiedBy?.Name || '',
      owner: record.Owner?.Name || ''
    };
  }

  mapToDatabase(data) {
    const mappedData = {
      Name: data.name || data.quoteNumber,
      Tags: data.tags,
      quote_id_c: data.quoteId,
      quote_number_c: data.quoteNumber,
      expiration_date_c: data.expirationDate,
      status_c: data.status,
      total_amount_c: data.totalAmount,
      currency_c: data.currency,
      valid_until_c: data.validUntil,
      notes_c: data.notes,
      terms_and_conditions_c: data.termsAndConditions,
      discount_c: data.discount,
      tax_amount_c: data.taxAmount,
      is_approved_c: data.isApproved,
      approval_date_c: data.approvalDate
    };

    // Handle lookup fields - convert to integers
    if (data.customerId !== undefined && data.customerId !== null) {
      mappedData.customer_id_c = parseInt(data.customerId);
    }
    if (data.contactId !== undefined && data.contactId !== null) {
      mappedData.contact_id_c = parseInt(data.contactId);
    }
    if (data.approvedBy !== undefined && data.approvedBy !== null) {
      mappedData.approved_by_c = parseInt(data.approvedBy);
    }
    if (data.createdByUserId !== undefined && data.createdByUserId !== null) {
      mappedData.created_by_user_id_c = parseInt(data.createdByUserId);
    }
    if (data.assignedToUserId !== undefined && data.assignedToUserId !== null) {
      mappedData.assigned_to_user_id_c = parseInt(data.assignedToUserId);
    }

    return mappedData;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "quote_id_c"}},
          {"field": {"Name": "quote_number_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "expiration_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "valid_until_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "terms_and_conditions_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "is_approved_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "approval_date_c"}},
          {"field": {"Name": "created_by_user_id_c"}},
          {"field": {"Name": "assigned_to_user_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "quote_id_c"}},
          {"field": {"Name": "quote_number_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "expiration_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "valid_until_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "terms_and_conditions_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "is_approved_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "approval_date_c"}},
          {"field": {"Name": "created_by_user_id_c"}},
          {"field": {"Name": "assigned_to_user_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      return this.mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(quoteData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase({
        ...quoteData,
        status: quoteData.status || 'Draft',
        currency: quoteData.currency || 'USD',
        totalAmount: quoteData.totalAmount || 0,
        discount: quoteData.discount || 0,
        taxAmount: quoteData.taxAmount || 0,
        isApproved: quoteData.isApproved || false
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
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to create quote');
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, quoteData) {
    try {
      const client = this.getApperClient();
      const mappedData = this.mapToDatabase(quoteData);

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
          console.error(`Failed to update ${failed.length} quotes:`, failed);
        }

        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data);
        }
      }
      
      throw new Error('Failed to update quote');
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          throw new Error('Failed to delete quote');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStatus(status) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "quote_id_c"}},
          {"field": {"Name": "quote_number_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "expiration_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "valid_until_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "terms_and_conditions_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "tax_amount_c"}},
          {"field": {"Name": "is_approved_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "approval_date_c"}},
          {"field": {"Name": "created_by_user_id_c"}},
          {"field": {"Name": "assigned_to_user_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(record => this.mapFromDatabase(record));
    } catch (error) {
      console.error("Error fetching quotes by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getQuoteStats() {
    try {
      const quotes = await this.getAll();
      
      const stats = {
        Draft: { count: 0, value: 0 },
        Sent: { count: 0, value: 0 },
        Accepted: { count: 0, value: 0 },
        Declined: { count: 0, value: 0 },
        Expired: { count: 0, value: 0 }
      };

      quotes.forEach(quote => {
        if (stats[quote.status]) {
          stats[quote.status].count++;
          stats[quote.status].value += quote.totalAmount || 0;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error fetching quote stats:", error?.response?.data?.message || error);
      return {
        Draft: { count: 0, value: 0 },
        Sent: { count: 0, value: 0 },
        Accepted: { count: 0, value: 0 },
        Declined: { count: 0, value: 0 },
        Expired: { count: 0, value: 0 }
      };
    }
  }
}

export const quotesService = new QuotesService();
export default quotesService;