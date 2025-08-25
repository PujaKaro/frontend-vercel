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
        
        {/* Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>New!</strong> You can now add detailed timeline steps and expandable sections that will be displayed in the mobile app. 
            Use the "Load Sample" buttons below to get started quickly.
          </p>
        </div>
        
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

          {/* Puja Timeline Section */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Puja Timeline 
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({(pujaForm.pujaTimeline || []).length} steps)
              </span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add the steps and timeline for this puja. These will be displayed in the mobile app.
            </p>
            
            {(pujaForm.pujaTimeline || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p>No timeline steps added yet.</p>
                <p className="text-sm">Click "Add Timeline Step" or "Load Sample Timeline" to get started.</p>
              </div>
            ) : (
              (pujaForm.pujaTimeline || []).map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={step.title || ''}
                      onChange={(e) => {
                        const newTimeline = [...(pujaForm.pujaTimeline || [])];
                        newTimeline[index] = { ...newTimeline[index], title: e.target.value };
                        setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                      }}
                      placeholder="e.g., Pre-Puja Preparation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={step.duration || ''}
                      onChange={(e) => {
                        const newTimeline = [...(pujaForm.pujaTimeline || [])];
                        newTimeline[index] = { ...newTimeline[index], duration: e.target.value };
                        setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                      }}
                      placeholder="e.g., 30 mins"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (Material Icon name)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={step.icon || ''}
                      onChange={(e) => {
                        const newTimeline = [...(pujaForm.pujaTimeline || [])];
                        newTimeline[index] = { ...newTimeline[index], icon: e.target.value };
                        setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                      }}
                      placeholder="e.g., settings, home, auto_stories"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use Material Icons like: settings, home, auto_stories, celebration, lightbulb, etc.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={step.color || 'blue'}
                      onChange={(e) => {
                        const newTimeline = [...(pujaForm.pujaTimeline || [])];
                        newTimeline[index] = { ...newTimeline[index], color: e.target.value };
                        setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                      }}
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="orange">Orange</option>
                      <option value="purple">Purple</option>
                      <option value="teal">Teal</option>
                      <option value="red">Red</option>
                      <option value="pink">Pink</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={step.description || ''}
                    onChange={(e) => {
                      const newTimeline = [...(pujaForm.pujaTimeline || [])];
                      newTimeline[index] = { ...newTimeline[index], description: e.target.value };
                      setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                    }}
                    placeholder="Describe what happens in this step..."
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    const newTimeline = [...(pujaForm.pujaTimeline || [])];
                    newTimeline.splice(index, 1);
                    setPujaForm(prev => ({ ...prev, pujaTimeline: newTimeline }));
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove Step
                </button>
              </div>
            ))
            )}
            
            <button
              type="button"
              onClick={() => {
                const newStep = {
                  title: '',
                  description: '',
                  icon: 'settings',
                  duration: '',
                  color: 'blue'
                };
                setPujaForm(prev => ({
                  ...prev,
                  pujaTimeline: [...(prev.pujaTimeline || []), newStep]
                }));
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm mr-2"
            >
              + Add Timeline Step
            </button>
            
            <button
              type="button"
              onClick={() => {
                const sampleTimeline = [
                  {
                    title: 'Pre-Puja Preparation',
                    description: 'Our team arrives 30 minutes early to set up the sacred space',
                    icon: 'settings',
                    duration: '30 mins',
                    color: 'blue'
                  },
                  {
                    title: 'Sacred Space Setup',
                    description: 'Arrangement of puja samagri, lighting of diyas, and preparation of havan kund',
                    icon: 'home',
                    duration: '15 mins',
                    color: 'green'
                  },
                  {
                    title: 'Main Puja Ceremony',
                    description: 'Performance of traditional Vedic rituals and mantras',
                    icon: 'auto_stories',
                    duration: '1 Hour',
                    color: 'orange'
                  },
                  {
                    title: 'Prasad Distribution',
                    description: 'Blessed prasad is distributed to all family members',
                    icon: 'celebration',
                    duration: '15 mins',
                    color: 'purple'
                  },
                  {
                    title: 'Post-Puja Guidance',
                    description: 'Spiritual guidance and recommendations for continued practice',
                    icon: 'lightbulb',
                    duration: '10 mins',
                    color: 'teal'
                  }
                ];
                setPujaForm(prev => ({
                  ...prev,
                  pujaTimeline: sampleTimeline
                }));
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Load Sample Timeline
            </button>
          </div>

          {/* Expandable Sections */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Expandable Sections
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({(pujaForm.expandableSections || []).length} sections)
              </span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Add expandable sections that users can tap to learn more about the puja.
            </p>
            
            {(pujaForm.expandableSections || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p>No expandable sections added yet.</p>
                <p className="text-sm">Click "Add Expandable Section" or "Load Sample Sections" to get started.</p>
              </div>
            ) : (
              (pujaForm.expandableSections || []).map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={section.title || ''}
                    onChange={(e) => {
                      const newSections = [...(pujaForm.expandableSections || [])];
                      newSections[index] = { ...newSections[index], title: e.target.value };
                      setPujaForm(prev => ({ ...prev, expandableSections: newSections }));
                    }}
                    placeholder="e.g., Legends and Fables"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Content *
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={section.content || ''}
                    onChange={(e) => {
                      const newSections = [...(pujaForm.expandableSections || [])];
                      newSections[index] = { ...newSections[index], content: e.target.value };
                      setPujaForm(prev => ({ ...prev, expandableSections: newSections }));
                    }}
                    placeholder="Write the content for this section..."
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    const newSections = [...(pujaForm.expandableSections || [])];
                    newSections.splice(index, 1);
                    setPujaForm(prev => ({ ...prev, expandableSections: newSections }));
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove Section
                </button>
              </div>
            ))
            )}
            
            <button
              type="button"
              onClick={() => {
                const newSection = {
                  title: '',
                  content: ''
                };
                setPujaForm(prev => ({
                  ...prev,
                  expandableSections: [...(prev.expandableSections || []), newSection]
                }));
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm mr-2"
            >
              + Add Expandable Section
            </button>
            
            <button
              type="button"
              onClick={() => {
                const sampleSections = [
                  {
                    title: 'Legends and Fables',
                    content: 'Traditional stories and legends associated with this puja, passed down through generations. These tales explain the spiritual significance and historical context of the ritual, helping devotees understand the deeper meaning behind each step.'
                  },
                  {
                    title: 'Religious Philosophy',
                    content: 'The spiritual and philosophical significance of this ritual in Hindu tradition. This section explores the metaphysical aspects, the connection between the physical and spiritual realms, and how the puja helps in spiritual growth and purification.'
                  },
                  {
                    title: 'Puja Vidhi',
                    content: 'Step-by-step procedure and methodology of the puja as prescribed in ancient texts. This includes the proper sequence of mantras, hand gestures (mudras), and offerings that ensure the ritual is performed correctly and effectively.'
                  },
                  {
                    title: 'Samagri',
                    content: 'Complete list of materials and items required for the puja. This includes sacred items like flowers, incense, ghee, sacred threads, and other ritual essentials that are necessary for the proper performance of the ceremony.'
                  },
                  {
                    title: 'Cultural Acceptance',
                    content: 'Cultural significance and acceptance across different regions of India. This section highlights how the puja is celebrated in various communities, regional variations in customs, and the unifying spiritual principles that connect all traditions.'
                  }
                ];
                setPujaForm(prev => ({
                  ...prev,
                  expandableSections: sampleSections
                }));
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Load Sample Sections
            </button>
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