const companiesData = [
  {
    Id: 1,
    name: "TechCorp Solutions",
    industry: "Technology",
    address: "123 Innovation Drive, San Francisco, CA 94105",
    notes: "Leading software development company specializing in enterprise solutions.",
    contactCount: 8,
    totalDealValue: 245000,
    lastActivityDate: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T09:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    Id: 2,
    name: "Global Manufacturing Inc",
    industry: "Manufacturing",
    address: "456 Industrial Blvd, Detroit, MI 48201",
    notes: "Automotive parts manufacturer with worldwide distribution network.",
    contactCount: 12,
    totalDealValue: 890000,
    lastActivityDate: "2024-01-14T14:20:00Z",
    createdAt: "2023-05-20T11:00:00Z",
    updatedAt: "2024-01-14T14:20:00Z"
  },
  {
    Id: 3,
    name: "HealthFirst Medical",
    industry: "Healthcare",
    address: "789 Medical Center Way, Boston, MA 02101",
    notes: "Regional healthcare provider with multiple clinic locations.",
    contactCount: 15,
    totalDealValue: 450000,
    lastActivityDate: "2024-01-13T16:45:00Z",
    createdAt: "2023-07-10T08:30:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  },
  {
    Id: 4,
    name: "Financial Partners LLC",
    industry: "Financial Services",
    address: "321 Wall Street, New York, NY 10005",
    notes: "Investment firm specializing in mid-market private equity.",
    contactCount: 6,
    totalDealValue: 1200000,
    lastActivityDate: "2024-01-12T11:15:00Z",
    createdAt: "2023-04-05T13:45:00Z",
    updatedAt: "2024-01-12T11:15:00Z"
  },
  {
    Id: 5,
    name: "RetailMax Stores",
    industry: "Retail",
    address: "987 Commerce Plaza, Chicago, IL 60601",
    notes: "Chain of specialty retail stores across the Midwest region.",
    contactCount: 10,
    totalDealValue: 320000,
    lastActivityDate: "2024-01-11T09:30:00Z",
    createdAt: "2023-08-22T15:20:00Z",
    updatedAt: "2024-01-11T09:30:00Z"
  },
  {
    Id: 6,
    name: "EduTech Academy",
    industry: "Education",
    address: "654 Learning Lane, Austin, TX 78701",
    notes: "Online education platform for professional development courses.",
    contactCount: 4,
    totalDealValue: 85000,
    lastActivityDate: "2024-01-10T13:00:00Z",
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-10T13:00:00Z"
  },
  {
    Id: 7,
    name: "GreenEnergy Systems",
    industry: "Energy",
    address: "147 Renewable Way, Portland, OR 97201",
    notes: "Solar and wind energy solutions for commercial properties.",
    contactCount: 7,
    totalDealValue: 675000,
    lastActivityDate: "2024-01-09T15:45:00Z",
    createdAt: "2023-03-15T12:30:00Z",
    updatedAt: "2024-01-09T15:45:00Z"
  },
  {
    Id: 8,
    name: "Logistics Pro",
    industry: "Transportation",
    address: "258 Freight Street, Atlanta, GA 30301",
    notes: "Third-party logistics provider with nationwide coverage.",
    contactCount: 9,
    totalDealValue: 520000,
    lastActivityDate: "2024-01-08T12:20:00Z",
    createdAt: "2023-06-30T14:15:00Z",
    updatedAt: "2024-01-08T12:20:00Z"
  },
  {
    Id: 9,
    name: "Creative Design Studio",
    industry: "Creative Services",
    address: "369 Art District, Los Angeles, CA 90028",
    notes: "Full-service creative agency specializing in brand development.",
    contactCount: 5,
    totalDealValue: 125000,
    lastActivityDate: "2024-01-07T10:10:00Z",
    createdAt: "2023-10-12T09:45:00Z",
    updatedAt: "2024-01-07T10:10:00Z"
  },
  {
    Id: 10,
    name: "Construction Builders",
    industry: "Construction",
    address: "741 Builder Avenue, Phoenix, AZ 85001",
    notes: "Commercial construction company with focus on sustainable building.",
    contactCount: 11,
    totalDealValue: 950000,
    lastActivityDate: "2024-01-06T14:30:00Z",
    createdAt: "2023-02-28T11:20:00Z",
    updatedAt: "2024-01-06T14:30:00Z"
  },
  {
    Id: 11,
    name: "FoodService Partners",
    industry: "Food & Beverage",
    address: "852 Culinary Court, Miami, FL 33101",
    notes: "Restaurant chain with locations throughout Florida.",
    contactCount: 13,
    totalDealValue: 380000,
    lastActivityDate: "2024-01-05T16:00:00Z",
    createdAt: "2023-11-08T13:10:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },
  {
    Id: 12,
    name: "DataSecure Systems",
    industry: "Cybersecurity",
    address: "963 Security Blvd, Seattle, WA 98101",
    notes: "Cybersecurity solutions for enterprise clients.",
    contactCount: 6,
    totalDealValue: 720000,
    lastActivityDate: "2024-01-04T11:45:00Z",
    createdAt: "2023-12-01T15:30:00Z",
    updatedAt: "2024-01-04T11:45:00Z"
  }
];

class CompaniesService {
  constructor() {
    this.companies = [...companiesData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.companies].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getById(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const company = this.companies.find(company => company.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  }

  async create(companyData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.companies.length > 0 
      ? Math.max(...this.companies.map(company => company.Id)) 
      : 0;
    
    const newCompany = {
      Id: maxId + 1,
      name: companyData.name,
      industry: companyData.industry || '',
      address: companyData.address || '',
      notes: companyData.notes || '',
      contactCount: 0,
      totalDealValue: 0,
      lastActivityDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.companies.findIndex(company => company.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }

    this.companies[index] = {
      ...this.companies[index],
      ...companyData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.companies[index] };
  }

  async delete(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.companies.findIndex(company => company.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }

    const deletedCompany = { ...this.companies[index] };
    this.companies.splice(index, 1);
    return deletedCompany;
  }
}

const companiesService = new CompaniesService();
export default companiesService;