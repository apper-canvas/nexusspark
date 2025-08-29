import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";

const CompanyDetailModal = ({ company, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState({ contacts: false, deals: false });

  if (!company) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Building2" },
    { id: "contacts", label: "Contacts", icon: "Users" },
    { id: "deals", label: "Deals", icon: "DollarSign" },
    { id: "activities", label: "Activities", icon: "Clock" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h4 className="text-lg font-medium text-slate-900 mb-4">Company Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Building2" className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Industry</p>
                      <p className="text-sm text-slate-900">{company.industry || "Not specified"}</p>
                    </div>
                  </div>
                  
                  {company.address && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MapPin" className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Address</p>
                        <p className="text-sm text-slate-900">{company.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Calendar" className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Last Activity</p>
                      <p className="text-sm text-slate-900">
                        {company.lastActivityDate 
                          ? format(new Date(company.lastActivityDate), "MMMM dd, yyyy")
                          : "No recent activity"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h4 className="text-lg font-medium text-slate-900 mb-4">Business Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-slate-700">Total Contacts</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-900">{company.contactCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="DollarSign" className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-700">Total Deal Value</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-900">
                      {formatCurrency(company.totalDealValue)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {company.notes && (
              <Card>
                <h4 className="text-lg font-medium text-slate-900 mb-4">Notes</h4>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{company.notes}</p>
              </Card>
            )}

            <div className="border-t border-slate-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                <div>
                  <span className="font-medium">Created:</span> {format(new Date(company.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {format(new Date(company.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
          </div>
        );

case "contacts":
        return (
          <div className="space-y-4">
            {loading.contacts ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-slate-500 mt-2">Loading contacts...</p>
              </div>
            ) : contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.map(contact => (
                  <div key={contact.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.email}</p>
                      </div>
                    </div>
                    {contact.phone && (
                      <p className="text-sm text-slate-600">{contact.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Users" className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No Contacts</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No contacts are associated with this company yet.
                </p>
              </div>
            )}
          </div>
        );

case "deals":
        return (
          <div className="space-y-4">
            {loading.deals ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-slate-500 mt-2">Loading deals...</p>
              </div>
            ) : deals.length > 0 ? (
              <div className="space-y-3">
                {deals.map(deal => (
                  <div key={deal.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-slate-900">{deal.title}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          deal.stage === 'Won' ? 'bg-green-100 text-green-800' :
                          deal.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {deal.stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{deal.contactName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{formatCurrency(deal.value)}</p>
                      <p className="text-xs text-slate-500">{deal.probability}% probability</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="DollarSign" className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">No Deals</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No deals are associated with this company yet.
                </p>
              </div>
            )}
          </div>
        );

      case "activities":
        return (
          <div className="text-center py-12">
            <ApperIcon name="Clock" className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Activity Timeline</h3>
            <p className="mt-1 text-sm text-slate-500">
              Activity timeline for companies will be available soon.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Last activity: {company.lastActivityDate 
                ? format(new Date(company.lastActivityDate), "MMM dd, yyyy")
                : "No recent activity"
              }
            </p>
          </div>
        );

      default:
        return null;
    }
};

  const loadCompanyData = async () => {
    if (!company || !isOpen) return;

    // Load contacts for this company
    if (activeTab === 'contacts' && !loading.contacts) {
      setLoading(prev => ({ ...prev, contacts: true }));
      try {
        const { contactService } = await import('@/services/api/contactService');
        const allContacts = await contactService.getAll();
        const companyContacts = allContacts.filter(contact => 
          contact.company === company.name || contact.companyId === company.Id
        );
        setContacts(companyContacts);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        setContacts([]);
      } finally {
        setLoading(prev => ({ ...prev, contacts: false }));
      }
    }

    // Load deals for this company
    if (activeTab === 'deals' && !loading.deals) {
      setLoading(prev => ({ ...prev, deals: true }));
      try {
        const { dealsService } = await import('@/services/api/dealsService');
        const allDeals = await dealsService.getAll();
        const companyDeals = allDeals.filter(deal => 
          deal.company === company.name
        );
        setDeals(companyDeals);
      } catch (error) {
        console.error('Failed to load deals:', error);
        setDeals([]);
      } finally {
        setLoading(prev => ({ ...prev, deals: false }));
      }
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, [company, isOpen, activeTab]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Company Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Company Header */}
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <ApperIcon name="Building2" className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{company.name}</h3>
            <p className="text-slate-500">{company.industry || "Industry not specified"}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
};

export default CompanyDetailModal;