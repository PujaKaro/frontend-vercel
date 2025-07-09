import React from 'react';

const AdminPanditModal = ({ 
  showPanditModal, 
  editingPandit, 
  panditForm, 
  setPanditForm, 
  handlePanditFormChange, 
  handleSavePandit, 
  handleClosePanditModal, 
  loading 
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
      showPanditModal ? 'block' : 'hidden'
    }`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingPandit ? 'Edit Pandit' : 'Add New Pandit'}
        </h2>
        <form onSubmit={handleSavePandit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pandit ID (Optional)
              </label>
              <input
                type="text"
                name="id"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.id}
                onChange={handlePanditFormChange}
                placeholder="Leave empty for auto-generated ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pandit Name *
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.name}
                onChange={handlePanditFormChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.location}
                onChange={handlePanditFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.experience}
                onChange={handlePanditFormChange}
                min="0"
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
                value={panditForm.rating}
                onChange={handlePanditFormChange}
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
                value={panditForm.reviews}
                onChange={handlePanditFormChange}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.contactNumber}
                onChange={handlePanditFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.email}
                onChange={handlePanditFormChange}
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
                value={panditForm.image}
                onChange={handlePanditFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specializations (comma-separated)
              </label>
              <input
                type="text"
                name="specializations"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={(panditForm.specializations || []).join(', ')}
                onChange={(e) => setPanditForm(prev => ({
                  ...prev,
                  specializations: e.target.value.split(',').map(spec => spec.trim()).filter(spec => spec)
                }))}
                placeholder="Marriage, Griha Pravesh, Satyanarayan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                name="languages"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={(panditForm.languages || []).join(', ')}
                onChange={(e) => setPanditForm(prev => ({
                  ...prev,
                  languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang)
                }))}
                placeholder="Hindi, Sanskrit, English"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={panditForm.description}
              onChange={handlePanditFormChange}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="availability"
                id="availability"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={panditForm.availability}
                onChange={handlePanditFormChange}
              />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                Available for bookings
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClosePanditModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Pandit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanditModal; 