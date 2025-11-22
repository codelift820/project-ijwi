import React, { useState } from 'react';
import { Send, MapPin, Camera, Phone, MessageSquare, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { submitSupportTicket } from '../lib/supabaseClient';

const ReportIssue: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium',
    contact: '',
    contactMethod: 'phone',
    reporterName: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');

  const categories = [
    'Infrastructure',
    'Healthcare',
    'Education',
    'Water & Sanitation',
    'Transportation',
    'Public Safety',
    'Environment',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await submitSupportTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        priority: formData.priority,
        contact: formData.contact,
        contact_method: formData.contactMethod,
        reporter_name: formData.reporterName
      });

      if (result.data && result.data.length > 0) {
        setTicketId(result.data[0].id);
        setIsSubmitted(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          priority: 'medium',
          contact: '',
          contactMethod: 'phone',
          reporterName: ''
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 p-8 rounded-xl border border-green-200">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Report Submitted Successfully!</h2>
          <p className="text-green-700 mb-4">
            Your issue has been logged with reference ID: <strong>{ticketId.slice(0, 8).toUpperCase()}</strong>
          </p>
          <p className="text-sm text-green-600">
            You will receive updates via your preferred contact method. Expected response time: 2-5 business days.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-8 rounded-xl border border-red-200">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Submission Failed</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => setError('')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Community Issue</h1>
          <p className="text-gray-600">
            Help us address community concerns by providing detailed information about the issue you've encountered.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reporter Name */}
          <div>
            <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="reporterName"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Brief summary of the issue"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="low">Low - General improvement</option>
                <option value="medium">Medium - Affects daily life</option>
                <option value="high">High - Urgent attention needed</option>
                <option value="critical">Critical - Emergency situation</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="District, Sector, Cell, or specific address"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Provide a detailed description of the issue, including when it started, how it affects the community, and any other relevant information..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <select
                id="contactMethod"
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <div className="relative">
                {formData.contactMethod === 'email' ? (
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                )}
                <input
                  type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder={formData.contactMethod === 'email' ? 'your@email.com' : '+250 XXX XXX XXX'}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors cursor-pointer">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload photos or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB each (max 3 photos)
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important Information:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• All reports are reviewed by local authorities</li>
                  <li>• You will receive updates on the progress of your issue</li>
                  <li>• False or misleading reports may result in account suspension</li>
                  <li>• For emergencies, please contact emergency services directly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin">
                  <Send className="w-5 h-5" />
                </div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;