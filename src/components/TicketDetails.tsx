import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader, CheckCircle, MapPin, User, Phone, Mail } from 'lucide-react';
import { fetchTicketById, updateTicketStatus } from '../lib/supabaseClient';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  contact: string;
  contact_method: string;
  reporter_name: string;
  created_at: string;
  updated_at: string;
  admin_notes: string;
}

interface TicketDetailsProps {
  ticketId: string;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticketId, onClose, onStatusUpdate }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    loadTicketDetails();
  }, [ticketId]);

  const loadTicketDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchTicketById(ticketId);
      setTicket(data);
      setNewStatus(data.status);
      setAdminNotes(data.admin_notes || '');
    } catch (err) {
      console.error('Error loading ticket:', err);
      setError('Failed to load ticket details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!ticket) return;

    try {
      setIsUpdating(true);
      setError('');
      
      await updateTicketStatus(ticket.id, newStatus, adminNotes);
      
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      // Reload ticket data
      loadTicketDetails();
      onStatusUpdate?.();
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'resolved':
      case 'complete': return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'progressive': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      case 'closed':
      case 'canceled': return 'bg-gray-100 text-gray-800';
      case 'forwarded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    switch (priorityLower) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ticket.title}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {ticket.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {updateSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">Ticket updated successfully!</p>
            </div>
          )}

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
              <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getStatusColor(ticket.status)}`}>
                {ticket.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{ticket.description}</p>
          </div>

          {/* Location and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <p className="text-gray-700">{ticket.location || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <p className="text-gray-700">{ticket.category}</p>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Reporter Information</h3>
            <div className="space-y-3">
              {ticket.reporter_name && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{ticket.reporter_name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                {ticket.contact_method === 'email' ? (
                  <Mail className="w-4 h-4 text-gray-400" />
                ) : (
                  <Phone className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    {ticket.contact_method.charAt(0).toUpperCase() + ticket.contact_method.slice(1)}
                  </p>
                  <p className="text-gray-900">{ticket.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created</p>
                <p className="text-gray-900 font-medium">{formatDate(ticket.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="text-gray-900 font-medium">{formatDate(ticket.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Update Section */}
          <div className="border-t border-gray-200 pt-4 space-y-4 bg-primary-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
            <h3 className="text-sm font-semibold text-gray-900">Update Status</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isUpdating}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="progressive">Progressive</option>
                <option value="resolved">Resolved</option>
                <option value="complete">Complete</option>
                <option value="forwarded">Forwarded</option>
                <option value="closed">Closed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this ticket..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none h-24"
                disabled={isUpdating}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating || newStatus === ticket.status}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="px-6 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
