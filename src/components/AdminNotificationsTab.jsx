import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc 
} from 'firebase/firestore';
import { sendNotification, sendBulkNotification } from '../utils/firestoreUtils';
import { toast } from 'react-hot-toast';

const AdminNotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    targetType: 'all', // 'all', 'specific'
  });

  // Fetch all admin-generated notifications and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchNotifications(),
          fetchUsers()
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(notificationsQuery);
      const notificationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      
      console.log('Fetched notifications:', notificationData);
      setNotifications(notificationData);
      return notificationData;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
      return [];
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || doc.data().displayName || 'User',
        email: doc.data().email || 'No email'
      }));
      
      setUsers(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user selection change in the multiple select dropdown
  const handleUserSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedUsers(selectedOptions);
  };

  // Handle form submission to send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      if (notificationForm.targetType === 'all') {
        // Send to all users
        const userIds = users.map(user => user.id);
        
        await sendBulkNotification(
          userIds,
          notificationForm.title,
          notificationForm.message,
          { adminGenerated: true }
        );
        
        toast.success(`Notification sent to all users (${users.length})`);
      } else {
        // Send to specific users
        if (selectedUsers.length === 0) {
          toast.error('Please select at least one user');
          setSending(false);
          return;
        }
        
        await sendBulkNotification(
          selectedUsers,
          notificationForm.title,
          notificationForm.message,
          { adminGenerated: true }
        );
        
        toast.success(`Notification sent to ${selectedUsers.length} users`);
      }
      
      // Reset form and refresh data
      setNotificationForm({
        title: '',
        message: '',
        targetType: 'all',
      });
      setSelectedUsers([]);
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  // Handle deleting a notification
  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteDoc(doc(db, 'notifications', id));
        toast.success('Notification deleted');
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Failed to delete notification');
      }
    }
  };

  // Find user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} (${user.email})` : userId;
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Send Notification</h2>
              <p className="text-sm text-gray-600 mt-1">
                Send notifications to users to inform them about updates, announcements, or offers.
              </p>
            </div>
            
            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Notification Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={notificationForm.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="e.g. New Festival Discount"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={notificationForm.message}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="e.g. We're excited to announce a special discount for the upcoming festival..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center mr-6">
                    <input
                      type="radio"
                      name="targetType"
                      value="all"
                      checked={notificationForm.targetType === 'all'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      All Users ({users.length})
                    </span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="targetType"
                      value="specific"
                      checked={notificationForm.targetType === 'specific'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Specific Users
                    </span>
                  </label>
                </div>
              </div>
              
              {notificationForm.targetType === 'specific' && (
                <div>
                  <label htmlFor="users" className="block text-sm font-medium text-gray-700">Select Users</label>
                  <select
                    id="users"
                    multiple
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-48"
                    onChange={handleUserSelection}
                    value={selectedUsers}
                    size="8"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}
                      style={{
                        backgroundColor: selectedUsers.includes(user.id) ? '#fdba74' : 'transparent',
                        color: selectedUsers.includes(user.id) ? '#7c2d12' : 'inherit',
                        padding: '8px',
                        marginBottom: '2px',
                        borderRadius: '4px'
                      }}
                    >
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd key to select multiple users. {selectedUsers.length} users selected
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">
                History of notifications sent to users
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <tr key={notification.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{notification.message}</div>
                          {notification.type && (
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-2">
                              {notification.type}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getUserName(notification.userId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            notification.read ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {notification.read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No notifications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-800 mb-4">Notification Stats</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-semibold">{notifications.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Read Notifications</p>
                <p className="text-2xl font-semibold">
                  {notifications.filter(n => n.read).length}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-semibold">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-4">Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Keep notifications brief and informative</li>
                <li>• Use specific titles that grab attention</li>
                <li>• Target specific user groups when relevant</li>
                <li>• Don't send too many notifications in a short period</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsTab; 