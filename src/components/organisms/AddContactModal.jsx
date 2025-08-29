import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import companiesService from "@/services/api/companiesService";
const AddContactModal = ({ isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyId: "",
    notes: ""
  });
const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
    }
  }, [isOpen]);

  const loadCompanies = async () => {
    try {
      setCompaniesLoading(true);
      const companiesData = await companiesService.getAll();
      setCompanies(companiesData);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setCompaniesLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.companyId) {
      newErrors.companyId = "Please select a company";
    }

setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      const selectedCompany = companies.find(c => c.Id === parseInt(formData.companyId));
      
      const contactData = {
        ...formData,
        company: selectedCompany ? selectedCompany.name : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null
      };

      // Call the onSave function passed from parent
      await onSave(contactData);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyId: "",
        notes: ""
      });
      
      setErrors({});
      toast.success("Contact added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyId: "",
      notes: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Contact"
      size="md"
    >
<form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Enter full name"
            required
            disabled={isLoading}
          />
          
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            placeholder="Enter email address"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            placeholder="Enter phone number"
            disabled={isLoading}
          />
<div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Company <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.companyId}
              onChange={handleChange("companyId")}
              disabled={isLoading || companiesLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
              <option value="">
                {companiesLoading ? "Loading companies..." : "Select a company"}
              </option>
              {companies.map(company => (
                <option key={company.Id} value={company.Id}>
                  {company.name} {company.industry && `- ${company.industry}`}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <p className="text-xs text-error mt-1">{errors.companyId}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Add any additional notes..."
            rows={3}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed bg-white resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? "Adding..." : "Add Contact"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContactModal;