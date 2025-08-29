import React, { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { contactService } from "@/services/api/contactService";
import { cn } from "@/utils/cn";
import AddContactModal from "@/components/organisms/AddContactModal";
import ContactTable from "@/components/organisms/ContactTable";
import ContactDetailModal from "@/components/organisms/ContactDetailModal";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const ContactsPage = () => {
  const { toggleSidebar } = useOutletContext();
  
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: "name", direction: "asc" });

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm))
    );

    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  // Sorting functionality
  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ field, direction });

    const sorted = [...filteredContacts].sort((a, b) => {
      let aValue = a[field] || "";
      let bValue = b[field] || "";

      // Handle date fields
      if (field === "lastContactDate") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      // Handle string fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredContacts(sorted);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [newContact, ...prev]);
      setFilteredContacts(prev => [newContact, ...prev]);
    } catch (err) {
      console.error("Error adding contact:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header
          title="Contacts"
          onMenuClick={toggleSidebar}
        />
        <div className="p-6">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header
          title="Contacts"
          onMenuClick={toggleSidebar}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadContacts} />
        </div>
      </div>
    );
  }
return (
<div className="flex-1 overflow-hidden">
      <Header
        title="Contacts"
        onMenuClick={toggleSidebar}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={() => setShowAddModal(true)}
      />
<div className="p-6">
        {contacts.length === 0 ? (
          <Empty
            title="No contacts yet"
            description="Start building your customer database by adding your first contact."
            actionLabel="Add Contact"
            onAction={() => setShowAddModal(true)}
            icon="Users"
          />
        ) : (
          <ContactTable
            contacts={filteredContacts}
            onContactClick={handleContactClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddContact}
      />
    </div>
  );
};

export default ContactsPage;