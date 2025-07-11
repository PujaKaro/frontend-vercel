import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faEdit, faTrash, faPlus, faHome, faBriefcase } from '@fortawesome/free-solid-svg-icons';

const SavedAddressesModal = ({ isOpen, onClose, addresses, onEditAddress, onDeleteAddress, onAddAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    type: 'home' // home, work, other
  });

  if (!isOpen) return null;

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.address) {
      onAddAddress({
        ...newAddress,
        id: Date.now().toString() // Generate temporary ID
      });
      setNewAddress({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        type: 'home'
      });
      setShowAddForm(false);
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return <FontAwesomeIcon icon={faHome} className="text-blue-500" />;
      case 'work':
        return <FontAwesomeIcon icon={faBriefcase} className="text-green-500" />;
      default:
        return <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500" />;
    }
  };

  const getAddressTypeLabel = (type) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      default:
        return 'Other';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Saved Addresses</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4">
          {/* Add New Address Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-4 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Address
          </button>

          {/* Add Address Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-md font-semibold mb-3 text-gray-800">Add New Address</h3>
              
              {/* Address Type Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'home', label: 'Home', icon: faHome },
                    { value: 'work', label: 'Work', icon: faBriefcase },
                    { value: 'other', label: 'Other', icon: faMapMarkerAlt }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewAddress({ ...newAddress, type: type.value })}
                      className={`flex items-center px-3 py-2 rounded-md border transition-colors ${
                        newAddress.type === type.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <FontAwesomeIcon icon={type.icon} className="mr-2" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddress.name || !newAddress.address}
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Address
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing Addresses */}
          {addresses && addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((address, index) => (
                <div key={address.id || index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {getAddressTypeIcon(address.type || 'other')}
                        <h3 className="font-medium text-gray-800 ml-2">{address.name}</h3>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                          {getAddressTypeLabel(address.type || 'other')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{address.address}</p>
                      {address.city && (
                        <p className="text-gray-500 text-xs">{address.city}, {address.state} {address.pincode}</p>
                      )}
                      {address.phone && (
                        <p className="text-gray-500 text-xs mt-1">📞 {address.phone}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={() => onEditAddress(address)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </button>
                      <button
                        onClick={() => onDeleteAddress(address.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-300 text-4xl mb-4" />
              <p className="text-gray-500 mb-4">No saved addresses found</p>
              <p className="text-gray-400 text-sm">Click "Add New Address" to get started</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesModal; 