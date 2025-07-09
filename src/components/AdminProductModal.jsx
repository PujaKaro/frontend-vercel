import React from 'react';

const AdminProductModal = ({ 
  showProductModal, 
  editingProduct, 
  productForm, 
  setProductForm, 
  handleProductFormChange, 
  handleSaveProduct, 
  handleCloseProductModal, 
  loading, 
  uniqueCategories 
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
      showProductModal ? 'block' : 'hidden'
    }`}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSaveProduct}>
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID (Optional)
                </label>
                <input
                  type="text"
                  name="id"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.id}
                  onChange={handleProductFormChange}
                  placeholder="Leave empty for auto-generated ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  required
                  list="product-categories"
                />
                <datalist id="product-categories">
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.brand}
                  onChange={handleProductFormChange}
                  placeholder="e.g., PujaKaro"
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
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.discount}
                  onChange={handleProductFormChange}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.stock}
                  onChange={handleProductFormChange}
                  required
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
                  value={productForm.rating}
                  onChange={handleProductFormChange}
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
                  value={productForm.reviews}
                  onChange={handleProductFormChange}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.sku}
                  onChange={handleProductFormChange}
                  placeholder="e.g., PUJA-PROD-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MPN
                </label>
                <input
                  type="text"
                  name="mpn"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.mpn}
                  onChange={handleProductFormChange}
                  placeholder="Manufacturer Part Number"
                />
              </div>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Physical Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.weight}
                  onChange={handleProductFormChange}
                  placeholder="e.g., 500g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.dimensions}
                  onChange={handleProductFormChange}
                  placeholder="e.g., 10x5x3 cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.material}
                  onChange={handleProductFormChange}
                  placeholder="e.g., Brass, Wood, etc."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL *
                </label>
                <input
                  type="text"
                  name="image"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.image}
                  onChange={handleProductFormChange}
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images (one per line)
                </label>
                <textarea
                  name="additionalImages"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.additionalImages) ? productForm.additionalImages.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      additionalImages: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg&#10;https://example.com/img3.jpg"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Descriptions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  required
                  placeholder="Brief description for product listings"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  rows="6"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.longDescription}
                  onChange={handleProductFormChange}
                  placeholder="Detailed description for product detail page"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Features & Requirements */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Features & Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  name="features"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.features) ? productForm.features.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      features: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  name="requirements"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.requirements) ? productForm.requirements.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      requirements: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Requirement 1&#10;Requirement 2"
                />
              </div>
            </div>
          </div>

          {/* Ritual Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Ritual Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.duration}
                  onChange={handleProductFormChange}
                  placeholder="e.g., 2-3 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots (one per line)
                </label>
                <textarea
                  name="availableTimeSlots"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.availableTimeSlots) ? productForm.availableTimeSlots.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      availableTimeSlots: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Morning: 6-9 AM&#10;Evening: 6-9 PM&#10;Afternoon: 12-3 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occasions (one per line)
                </label>
                <textarea
                  name="occasions"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.occasions) ? productForm.occasions.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      occasions: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="House warming&#10;Marriage&#10;Birthday&#10;Festival"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pandits (one per line)
                </label>
                <textarea
                  name="pandits"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.pandits) ? productForm.pandits.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      pandits: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Pandit 1&#10;Pandit 2&#10;Pandit 3"
                />
              </div>
            </div>
          </div>

          {/* Spiritual Content */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Spiritual Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spiritual Significance
                </label>
                <textarea
                  name="spiritualSignificance"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.spiritualSignificance}
                  onChange={handleProductFormChange}
                  placeholder="Explain the spiritual significance and benefits"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Mantras (one per line)
                </label>
                <textarea
                  name="keyMantras"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.keyMantras) ? productForm.keyMantras.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      keyMantras: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Om Namah Shivaya&#10;Om Namo Bhagavate Vasudevaya&#10;Om Gam Ganapataye Namaha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ritual Steps (one per line)
                </label>
                <textarea
                  name="ritualSteps"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={Array.isArray(productForm.ritualSteps) ? productForm.ritualSteps.join('\n') : ''}
                  onChange={(e) => {
                    setProductForm(prev => ({
                      ...prev,
                      ritualSteps: e.target.value.split('\n')
                    }));
                  }}
                  placeholder="Step 1: Sankalpa (Statement of Intent)&#10;Step 2: Setup of puja items&#10;Step 3: Invocation of the deity&#10;Step 4: Main worship ritual"
                />
              </div>
            </div>
          </div>

          {/* Care & Placement */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Care & Placement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placement Guide
                </label>
                <textarea
                  name="placementGuide"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.placementGuide}
                  onChange={handleProductFormChange}
                  placeholder="Instructions for proper placement"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Care Instructions
                </label>
                <textarea
                  name="careInstructions"
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.careInstructions}
                  onChange={handleProductFormChange}
                  placeholder="Instructions for care and maintenance"
                ></textarea>
              </div>
            </div>
          </div>

          {/* SEO Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">SEO Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.seoTitle}
                  onChange={handleProductFormChange}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  name="seoKeywords"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.seoKeywords}
                  onChange={handleProductFormChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={productForm.seoDescription}
                  onChange={handleProductFormChange}
                  placeholder="SEO optimized description (150-160 characters)"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Status & Options */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Status & Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={productForm.featured}
                  onChange={handleProductFormChange}
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  id="inStock"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={productForm.inStock}
                  onChange={handleProductFormChange}
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">
                  In Stock
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isWishlisted"
                  id="isWishlisted"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={productForm.isWishlisted}
                  onChange={handleProductFormChange}
                />
                <label htmlFor="isWishlisted" className="ml-2 block text-sm text-gray-900">
                  Wishlisted
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseProductModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal; 