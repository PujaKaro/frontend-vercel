import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash, faUser, faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const AdminUserDetailModal = ({ 
  viewingUser, 
  setViewingUser, 
  showUserModal, 
  setShowUserModal, 
  handleUserAction 
}) => {
  if (!viewingUser) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
      showUserModal ? 'block' : 'hidden'
    }`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={() => setShowUserModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{viewingUser.name}</h3>
                <p className="text-gray-600">{viewingUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{viewingUser.email}</span>
              </div>
              {viewingUser.phone && (
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{viewingUser.phone}</span>
                </div>
              )}
              {viewingUser.address && (
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{viewingUser.address}</span>
                </div>
              )}
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Joined: {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* User Status & Role */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              Account Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Role:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  viewingUser.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {viewingUser.role}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  viewingUser.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {viewingUser.status}
                </span>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Activity Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{viewingUser.orderCount || 0}</div>
                <div className="text-sm text-gray-600">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {viewingUser.lastLogin ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Last Login</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {viewingUser.photoURL ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Profile Photo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {viewingUser.phone ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Phone Added</div>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleUserAction(viewingUser.id, 'edit')}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                Edit User
              </button>
              
              {viewingUser.role === 'user' ? (
                <button
                  onClick={() => handleUserAction(viewingUser.id, 'promote')}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
                  Promote to Admin
                </button>
              ) : (
                <button
                  onClick={() => handleUserAction(viewingUser.id, 'demote')}
                  className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  Demote to User
                </button>
              )}
              
              {viewingUser.status === 'active' ? (
                <button
                  onClick={() => handleUserAction(viewingUser.id, 'deactivate')}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleUserAction(viewingUser.id, 'activate')}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  Activate
                </button>
              )}
              
              <button
                onClick={() => handleUserAction(viewingUser.id, 'delete')}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                Delete User
              </button>
            </div>
          </div>

          {/* Additional Info */}
          {(viewingUser.city || viewingUser.state || viewingUser.pincode) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Location Details</h4>
              <div className="space-y-2">
                {viewingUser.city && (
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">City: {viewingUser.city}</span>
                  </div>
                )}
                {viewingUser.state && (
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">State: {viewingUser.state}</span>
                  </div>
                )}
                {viewingUser.pincode && (
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Pincode: {viewingUser.pincode}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewingUser.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Notes</h4>
              <p className="text-sm text-gray-600">{viewingUser.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowUserModal(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailModal; 