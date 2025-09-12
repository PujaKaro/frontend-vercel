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

          {/* Service Tiers Management */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Service Tiers
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({(pujaForm.serviceTiers ? Object.keys(pujaForm.serviceTiers).length : 0)} tiers)
              </span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure different service tiers (Basic, Premium, Deluxe) with multiple options and pricing.
            </p>
            
            {/* Service Tiers */}
            {pujaForm.serviceTiers && Object.entries(pujaForm.serviceTiers).map(([tierKey, tier]) => (
              <div key={tierKey} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800 capitalize">{tier.name}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newTiers = { ...pujaForm.serviceTiers };
                      delete newTiers[tierKey];
                      setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Tier
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={tier.name || ''}
                      onChange={(e) => {
                        const newTiers = { ...pujaForm.serviceTiers };
                        newTiers[tierKey] = { ...newTiers[tierKey], name: e.target.value };
                        setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                      }}
                      placeholder="e.g., Basic Service"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={tier.price || ''}
                      onChange={(e) => {
                        const newTiers = { ...pujaForm.serviceTiers };
                        newTiers[tierKey] = { ...newTiers[tierKey], price: parseInt(e.target.value) || 0 };
                        setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                      }}
                      placeholder="2500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={tier.description || ''}
                    onChange={(e) => {
                      const newTiers = { ...pujaForm.serviceTiers };
                      newTiers[tierKey] = { ...newTiers[tierKey], description: e.target.value };
                      setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                    }}
                    placeholder="Brief description of this service tier"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                  <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={(tier.features || []).join('\n')}
                    onChange={(e) => {
                      const newTiers = { ...pujaForm.serviceTiers };
                      newTiers[tierKey] = { 
                        ...newTiers[tierKey], 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      };
                      setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                    }}
                    placeholder="1 Experienced Pandit&#10;Basic Puja Samagri&#10;2 Hours Duration"
                  />
                </div>
                
                {/* Service Options */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Service Options</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newTiers = { ...pujaForm.serviceTiers };
                        const newOption = {
                          id: `${tierKey}-${Date.now()}`,
                          name: '',
                          price: tier.price || 0,
                          description: '',
                          duration: '',
                          pandits: 1,
                          features: []
                        };
                        newTiers[tierKey] = {
                          ...newTiers[tierKey],
                          options: [...(newTiers[tierKey].options || []), newOption]
                        };
                        setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Option
                    </button>
                  </div>
                  
                  {(tier.options || []).map((option, optionIndex) => (
                    <div key={option.id} className="border border-gray-200 rounded p-3 mb-2 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Option Name</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={option.name || ''}
                            onChange={(e) => {
                              const newTiers = { ...pujaForm.serviceTiers };
                              newTiers[tierKey].options[optionIndex] = { ...option, name: e.target.value };
                              setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                            }}
                            placeholder="e.g., Standard Basic"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={option.price || ''}
                            onChange={(e) => {
                              const newTiers = { ...pujaForm.serviceTiers };
                              newTiers[tierKey].options[optionIndex] = { ...option, price: parseInt(e.target.value) || 0 };
                              setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                            }}
                            placeholder="2500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={option.duration || ''}
                            onChange={(e) => {
                              const newTiers = { ...pujaForm.serviceTiers };
                              newTiers[tierKey].options[optionIndex] = { ...option, duration: e.target.value };
                              setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                            }}
                            placeholder="e.g., 2 hours"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Number of Pandits</label>
                          <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={option.pandits || ''}
                            onChange={(e) => {
                              const newTiers = { ...pujaForm.serviceTiers };
                              newTiers[tierKey].options[optionIndex] = { ...option, pandits: parseInt(e.target.value) || 1 };
                              setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                            }}
                            placeholder="1"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          value={option.description || ''}
                          onChange={(e) => {
                            const newTiers = { ...pujaForm.serviceTiers };
                            newTiers[tierKey].options[optionIndex] = { ...option, description: e.target.value };
                            setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                          }}
                          placeholder="Brief description of this option"
                        />
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Features (comma-separated)</label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            value={(option.features || []).join(', ')}
                            onChange={(e) => {
                              const newTiers = { ...pujaForm.serviceTiers };
                              newTiers[tierKey].options[optionIndex] = { 
                                ...option, 
                                features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                              };
                              setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                            }}
                            placeholder="Basic samagri, Standard prasad, Simple decoration"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newTiers = { ...pujaForm.serviceTiers };
                            newTiers[tierKey].options = newTiers[tierKey].options.filter((_, idx) => idx !== optionIndex);
                            setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                          }}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Add New Tier Buttons */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  const newTiers = { ...(pujaForm.serviceTiers || {}) };
                  const tierKey = `tier_${Date.now()}`;
                  newTiers[tierKey] = {
                    name: 'New Service Tier',
                    price: 0,
                    description: '',
                    features: [],
                    options: []
                  };
                  setPujaForm(prev => ({ ...prev, serviceTiers: newTiers }));
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
              >
                + Add Service Tier
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const sampleTiers = {
                    basic: {
                      name: 'Basic Service',
                      price: 2500,
                      description: 'Essential puja service with standard offerings',
                      features: ['1 Experienced Pandit', 'Basic Puja Samagri', '2 Hours Duration', 'Standard Prasad', 'Basic Decoration'],
                      options: [
                        {
                          id: 'basic-1',
                          name: 'Standard Basic',
                          price: 2500,
                          description: 'Complete basic puja with essential rituals',
                          duration: '2 hours',
                          pandits: 1,
                          features: ['Basic samagri', 'Standard prasad', 'Simple decoration']
                        }
                      ]
                    },
                    premium: {
                      name: 'Premium Service',
                      price: 4000,
                      description: 'Enhanced puja service with premium offerings',
                      features: ['2 Experienced Pandits', 'Premium Puja Samagri', '3 Hours Duration', 'Premium Prasad', 'Beautiful Decoration', 'Photography Session'],
                      options: [
                        {
                          id: 'premium-1',
                          name: 'Standard Premium',
                          price: 4000,
                          description: 'Complete premium puja with enhanced rituals',
                          duration: '3 hours',
                          pandits: 2,
                          features: ['Premium samagri', 'Quality prasad', 'Beautiful decoration', 'Basic photography']
                        }
                      ]
                    },
                    deluxe: {
                      name: 'Deluxe Service',
                      price: 8000,
                      description: 'Luxury puja service with royal offerings',
                      features: ['3 Senior Pandits', 'Royal Puja Samagri', '4+ Hours Duration', 'Luxury Prasad', 'Royal Decoration', 'Professional Photography & Video', 'Live Streaming Option'],
                      options: [
                        {
                          id: 'deluxe-1',
                          name: 'Royal Deluxe',
                          price: 8000,
                          description: 'Royal puja experience with luxury amenities',
                          duration: '4 hours',
                          pandits: 3,
                          features: ['Royal samagri', 'Luxury prasad', 'Royal decoration', 'Professional photography', 'Video recording']
                        }
                      ]
                    }
                  };
                  setPujaForm(prev => ({ ...prev, serviceTiers: sampleTiers }));
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Load Sample Tiers
              </button>
            </div>
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