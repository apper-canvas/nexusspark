import { format } from "date-fns";
import Modal from "@/components/molecules/Modal";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const ContactDetailModal = ({ contact, isOpen, onClose }) => {
  if (!contact) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Contact Header */}
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{contact.name}</h3>
            <p className="text-slate-500">{contact.company || "No company"}</p>
            <Badge variant="success" className="mt-1">Active</Badge>
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <h4 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">Email</p>
                <p className="text-sm text-slate-900">{contact.email}</p>
              </div>
            </div>
            
            {contact.phone && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <p className="text-sm text-slate-900">{contact.phone}</p>
                </div>
              </div>
            )}

            {contact.company && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="Building2" className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Company</p>
                  <p className="text-sm text-slate-900">{contact.company}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <ApperIcon name="Calendar" className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">Last Contact</p>
                <p className="text-sm text-slate-900">
                  {contact.lastContactDate 
                    ? format(new Date(contact.lastContactDate), "MMMM dd, yyyy")
                    : "Never contacted"
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        {contact.notes && (
          <Card>
            <h4 className="text-lg font-medium text-slate-900 mb-4">Notes</h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{contact.notes}</p>
          </Card>
        )}

        {/* Interaction History Placeholder */}
        <Card>
          <h4 className="text-lg font-medium text-slate-900 mb-4">Recent Interactions</h4>
          <div className="text-center py-8">
            <ApperIcon name="MessageCircle" className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No interactions yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Interaction tracking will be available soon.
            </p>
          </div>
        </Card>

        {/* Metadata */}
        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
            <div>
              <span className="font-medium">Created:</span> {format(new Date(contact.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {format(new Date(contact.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactDetailModal;