import React, { useState, useEffect } from 'react';
import { BarChart3, MapPin, Search, Loader } from 'lucide-react';
import { fetchSupportTickets, getTicketStatistics } from '../lib/supabaseClient';
import TicketDetails from './TicketDetails';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: string;
  location: string;
  created_at: string;
  priority: string;
  reporter_name: string;
}

const Dashboard: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const ticketsData = await fetchSupportTickets();
        const statsData = await getTicketStatistics();
        
        setTickets(ticketsData || []);
        setDashboardStats(statsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Format stats for display
  const statsDisplay = [
    { title: 'Total Reports', value: dashboardStats.total.toString(), change: '+12%', color: 'blue' },
    { title: 'Resolved', value: dashboardStats.resolved.toString(), change: '+8%', color: 'green' },
    { title: 'In Progress', value: dashboardStats.inProgress.toString(), change: '+15%', color: 'yellow' },
    { title: 'Pending', value: dashboardStats.pending.toString(), change: '-5%', color: 'red' },
  ];

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    switch (priorityLower) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Dashboard</h1>
        <p className="text-gray-600">
          Real-time insights into community issues and their resolution progress
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Transportation">Transportation</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Environment">Environment</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Issues ({filteredTickets.length})</h2>
        </div>
        {filteredTickets.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No tickets found matching your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} title={`${ticket.priority} Priority`}></div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ticket.location || 'N/A'}
                      </span>
                      <span>{ticket.category}</span>
                      <span>{formatDate(ticket.created_at)}</span>
                      {ticket.reporter_name && (
                        <span>By {ticket.reporter_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">ID: {ticket.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="ml-4 text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicketId && (
        <TicketDetails 
          ticketId={selectedTicketId} 
          onClose={() => setSelectedTicketId(null)}
          onStatusUpdate={() => {
            // Reload dashboard data when ticket status is updated
            const loadData = async () => {
              try {
                const ticketsData = await fetchSupportTickets();
                const statsData = await getTicketStatistics();
                setTickets(ticketsData || []);
                setDashboardStats(statsData);
              } catch (err) {
                console.error('Error reloading dashboard data:', err);
              }
            };
            loadData();
          }}
        />
      )}

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Resolution Time</span>
              <span className="font-semibold text-gray-900">4.2 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Community Satisfaction</span>
              <span className="font-semibold text-primary-600">4.7/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issue Categories</h3>
          <div className="space-y-3">
            {[
              { category: 'Infrastructure', count: 847, percentage: 30 },
              { category: 'Water & Sanitation', count: 623, percentage: 22 },
              { category: 'Healthcare', count: 456, percentage: 16 },
              { category: 'Education', count: 389, percentage: 14 },
              { category: 'Public Safety', count: 312, percentage: 11 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;