import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { contactService } from "@/services/api/contactService";
import { dealsService } from "@/services/api/dealsService";

const LogActivityModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'call',
    title: '',
    description: '',
    outcome: '',
    contactId: '',
    dealId: ''
  });
  
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadContacts();
      loadDeals();
      
      setFormData({
        type: 'call',
        title: '',
        description: '',
        outcome: '',
        contactId: '',
        dealId: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      setContacts([]);
    }
  };

  const loadDeals = async () => {
    try {
      const data = await dealsService.getAll();
      setDeals(data);
    } catch (error) {
      console.error('Failed to load deals:', error);
      setDeals([]);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.outcome.trim()) {
      newErrors.outcome = 'Outcome is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get selected contact and deal details
      const selectedContact = contacts.find(c => c.Id === parseInt(formData.contactId));
      const selectedDeal = deals.find(d => d.Id === parseInt(formData.dealId));
      
      const activityData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: 'completed',
        priority: 'normal',
        dueDate: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        contactName: selectedContact ? selectedContact.name : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        dealTitle: selectedDeal ? selectedDeal.title : null,
        assignedTo: 'Current User',
        outcome: formData.outcome.trim()
      };
      
      await onSave(activityData);
      toast.success('Activity logged successfully!');
      handleClose();
    } catch (error) {
      console.error('Failed to log activity:', error);
      toast.error('Failed to log activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const typeOptions = [
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'task', label: 'Task' },
    { value: 'follow-up', label: 'Follow-up' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Log Completed Activity"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Activity Type"
          error={errors.type}
          required
        >
          <select
            value={formData.type}
            onChange={handleChange('type')}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
            disabled={loading}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Title"
          error={errors.title}
          required
        >
          <input
            type="text"
            value={formData.title}
            onChange={handleChange('title')}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
            placeholder="Enter activity title..."
            disabled={loading}
            maxLength={100}
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description}
        >
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={3}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary resize-none"
            placeholder="Enter activity description..."
            disabled={loading}
            maxLength={500}
          />
        </FormField>

        <FormField
          label="Outcome"
          error={errors.outcome}
          required
        >
          <textarea
            value={formData.outcome}
            onChange={handleChange('outcome')}
            rows={3}
            className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary resize-none"
            placeholder="Describe the outcome of this activity..."
            disabled={loading}
            maxLength={500}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Related Contact"
            error={errors.contactId}
          >
            <select
              value={formData.contactId}
              onChange={handleChange('contactId')}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
              disabled={loading}
            >
              <option value="">Select a contact (optional)</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.name} - {contact.company || 'No Company'}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Related Deal"
            error={errors.dealId}
          >
            <select
              value={formData.dealId}
              onChange={handleChange('dealId')}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
              disabled={loading}
            >
              <option value="">Select a deal (optional)</option>
              {deals.map(deal => (
                <option key={deal.Id} value={deal.Id}>
                  {deal.title} - ${deal.value?.toLocaleString()}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Log Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LogActivityModal;