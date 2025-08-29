import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const AddCompanyModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    address: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.name = "Company name is required";
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave(formData);
      
      // Reset form
      setFormData({
        name: "",
        industry: "",
        address: "",
        notes: ""
      });
      
      setErrors({});
      toast.success("Company added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        industry: "",
        address: "",
        notes: ""
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Company"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Company Name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Enter company name"
            required
            disabled={isLoading}
          />
          
          <FormField
            label="Industry"
            type="text"
            value={formData.industry}
            onChange={handleChange("industry")}
            error={errors.industry}
            placeholder="e.g., Technology, Healthcare"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <FormField
            label="Address"
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            error={errors.address}
            placeholder="Enter company address"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Add any additional notes about the company..."
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
            {isLoading ? "Adding..." : "Add Company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCompanyModal;