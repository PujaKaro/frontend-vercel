import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload, faEye, faPhone, faUser, faCalendar, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

const AdminLeadsTab = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load leads from Firestore
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const leadsQuery = query(collection(db, 'NEW_LEADS'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(leadsQuery);
      
      const leadsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt?.seconds * 1000) || new Date()
      }));
      
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Delete a lead
  const deleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'NEW_LEADS', leadId));
        setLeads(leads.filter(lead => lead.id !== leadId));
        toast.success('Lead deleted successfully');
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Filter and sort leads
  const filteredAndSortedLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === 'all') return matchesSearch;
      if (filterStatus === 'today') {
        const today = new Date();
        const leadDate = new Date(lead.createdAt);
        return matchesSearch && 
          leadDate.getDate() === today.getDate() &&
          leadDate.getMonth() === today.getMonth() &&
          leadDate.getFullYear() === today.getFullYear();
      }
      if (filterStatus === 'thisWeek') {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const leadDate = new Date(lead.createdAt);
        return matchesSearch && leadDate >= weekAgo;
      }
      if (filterStatus === 'thisMonth') {
        const today = new Date();
        const leadDate = new Date(lead.createdAt);
        return matchesSearch && 
          leadDate.getMonth() === today.getMonth() &&
          leadDate.getFullYear() === today.getFullYear();
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Export leads to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedLeads.map(lead => [
        `"${lead.name || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.email || ''}"`,
        `"${formatDate(lead.createdAt)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Leads exported successfully');
  };

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  // Statistics
  const totalLeads = leads.length;
  const todayLeads = leads.filter(lead => {
    const today = new Date();
    const leadDate = new Date(lead.createdAt);
    return leadDate.getDate() === today.getDate() &&
           leadDate.getMonth() === today.getMonth() &&
           leadDate.getFullYear() === today.getFullYear();
  }).length;
  const thisWeekLeads = leads.filter(lead => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const leadDate = new Date(lead.createdAt);
    return leadDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600">Manage and track all leads from the website</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Leads</p>
              <p className="text-2xl font-bold text-gray-900">{todayLeads}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <FontAwesomeIcon icon={faCalendar} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{thisWeekLeads}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <FontAwesomeIcon icon={faCalendar} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="createdAt">Date</option>
              <option value="name">Name</option>
              <option value="phone">Phone</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedLeads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all' ? 'No leads match your filters' : 'No leads found'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {lead.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                          {lead.phone || 'N/A'}
                        </div>
                        {lead.email && (
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Call"
                        >
                          <FontAwesomeIcon icon={faPhone} />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {filteredAndSortedLeads.length} of {leads.length} leads
      </div>
    </div>
  );
};

export default AdminLeadsTab; 