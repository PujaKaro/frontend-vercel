import React from 'react';

const AdminPujaModal = ({ 
  showPujaModal, 
  editingPuja, 
  pujaForm, 
  setPujaForm, 
  handlePujaFormChange, 
  handleSavePuja, 
  handleClosePujaModal, 
  loading 
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
      showPujaModal ? 'block' : 'hidden'
    }`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingPuja ? 'Edit Puja Service' : 'Add New Puja Service'}
        </h2>
        <form onSubmit={handleSavePuja}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puja ID (Optional)
              </label>
              <input
                type="text"
                name="id"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.id}
                onChange={handlePujaFormChange}
                placeholder="Leave empty for auto-generated ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puja Name *
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.name}
                onChange={handlePujaFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.category}
                onChange={handlePujaFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.price}
                onChange={handlePujaFormChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.duration}
                onChange={handlePujaFormChange}
                placeholder="e.g., 2-3 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.rating}
                onChange={handlePujaFormChange}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reviews Count
              </label>
              <input
                type="number"
                name="reviews"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.reviews}
                onChange={handlePujaFormChange}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={pujaForm.image}
                onChange={handlePujaFormChange}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={pujaForm.description}
              onChange={handlePujaFormChange}
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              name="longDescription"
              rows="6"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={pujaForm.longDescription}
              onChange={handlePujaFormChange}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements (comma-separated)
            </label>
            <input
              type="text"
              name="requirements"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={(pujaForm.requirements || []).join(', ')}
              onChange={(e) => setPujaForm(prev => ({
                ...prev,
                requirements: e.target.value.split(',').map(req => req.trim()).filter(req => req)
              }))}
              placeholder="Requirement 1, Requirement 2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Time Slots (comma-separated)
            </label>
            <input
              type="text"
              name="availableTimeSlots"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={(pujaForm.availableTimeSlots || []).join(', ')}
              onChange={(e) => setPujaForm(prev => ({
                ...prev,
                availableTimeSlots: e.target.value.split(',').map(slot => slot.trim()).filter(slot => slot)
              }))}
              placeholder="Morning: 6-9 AM, Evening: 6-9 PM"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occasions (comma-separated)
            </label>
            <input
              type="text"
              name="occasions"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={(pujaForm.occasions || []).join(', ')}
              onChange={(e) => setPujaForm(prev => ({
                ...prev,
                occasions: e.target.value.split(',').map(occasion => occasion.trim()).filter(occasion => occasion)
              }))}
              placeholder="House warming, Marriage, Birthday"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pandits (comma-separated)
            </label>
            <input
              type="text"
              name="pandits"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={(pujaForm.pandits || []).join(', ')}
              onChange={(e) => setPujaForm(prev => ({
                ...prev,
                pandits: e.target.value.split(',').map(pandit => pandit.trim()).filter(pandit => pandit)
              }))}
              placeholder="Pandit 1, Pandit 2"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClosePujaModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Puja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPujaModal; 