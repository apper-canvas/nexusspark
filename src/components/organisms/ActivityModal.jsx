import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { contactService } from "@/services/api/contactService";
import { dealsService } from "@/services/api/dealsService";

const ActivityModal = ({ isOpen, onClose, onSave, activity = null }) => {
  const [formData, setFormData] = useState({
    type: 'call',
    title: '',
    description: '',
    priority: 'normal',
    dueDate: '',
    contactId: '',
    dealId: '',
    assignedTo: 'Current User'
  });
  
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadContacts();
      loadDeals();
      
      if (activity) {
        // Editing existing activity
        setFormData({
          type: activity.type || 'call',
          title: activity.title || '',
          description: activity.description || '',
          priority: activity.priority || 'normal',
          dueDate: activity.dueDate ? activity.dueDate.split('T')[0] : '',
          contactId: activity.contactId || '',
          dealId: activity.dealId || '',
          assignedTo: activity.assignedTo || 'Current User'
        });
      } else {
        // Creating new activity
        setFormData({
          type: 'call',
          title: '',
          description: '',
          priority: 'normal',
          dueDate: formatTodayDate(),
          contactId: '',
          dealId: '',
          assignedTo: 'Current User'
        });
      }
      setErrors({});
    }
  }, [isOpen, activity]);

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
    
    // Auto-populate contact name when contact is selected
    if (field === 'contactId' && value) {
      const selectedContact = contacts.find(c => c.Id === parseInt(value));
      if (selectedContact) {
        setFormData(prev => ({
          ...prev,
          contactName: selectedContact.name
        }));
      }
    }
    
    // Auto-populate deal title when deal is selected
    if (field === 'dealId' && value) {
      const selectedDeal = deals.find(d => d.Id === parseInt(value));
      if (selectedDeal) {
        setFormData(prev => ({
          ...prev,
          dealTitle: selectedDeal.title
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
        priority: formData.priority,
        dueDate: new Date(formData.dueDate + 'T12:00:00Z').toISOString(),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        contactName: selectedContact ? selectedContact.name : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        dealTitle: selectedDeal ? selectedDeal.title : null,
        assignedTo: formData.assignedTo.trim()
      };
      
      await onSave(activityData);
      toast.success(activity ? 'Activity updated successfully!' : 'Activity created successfully!');
      handleClose();
    } catch (error) {
      console.error('Failed to save activity:', error);
      toast.error('Failed to save activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const formatTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const typeOptions = [
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'task', label: 'Task' },
    { value: 'follow-up', label: 'Follow-up' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={activity ? 'Edit Activity' : 'Create New Activity'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            label="Priority"
            error={errors.priority}
          >
            <select
              value={formData.priority}
              onChange={handleChange('priority')}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
              disabled={loading}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Contact"
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
            label="Deal"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Due Date"
            error={errors.dueDate}
            required
          >
            <input
              type="date"
              value={formData.dueDate}
              onChange={handleChange('dueDate')}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
              disabled={loading}
              min={formatTodayDate()}
            />
          </FormField>

          <FormField
            label="Assigned To"
            error={errors.assignedTo}
          >
            <input
              type="text"
              value={formData.assignedTo}
              onChange={handleChange('assignedTo')}
              className="input-focus w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary"
              placeholder="Enter assignee name..."
              disabled={loading}
              maxLength={50}
            />
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
            {loading ? 'Saving...' : (activity ? 'Update Activity' : 'Create Activity')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityModal;