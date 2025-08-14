import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';

const AdminCodesTabs = ({ 
  activeCodesTab, 
  setActiveCodesTab, 
  stats, 
  handleCreateReferralCode, 
  handleToggleReferralStatus, 
  newReferralCode, 
  setNewReferralCode, 
  isCreatingCode, 
  handleCreateCouponCode, 
  newCouponCode, 
  handleCouponInputChange, 
  selectedUsers, 
  setNewCouponCode, 
  handleUserSelection, 
  allUsers, 
  isCreatingCoupon, 
  handleToggleCouponStatus
}) => {
  return (
    <div>
      {/* Tab Navigation for Codes Section */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveCodesTab('referrals')}
            className={`py-3 px-6 border-b-2 ${
              activeCodesTab === 'referrals' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-600 hover:border-gray-300'
            }`}
          >
            Manage Referrals
          </button>
          <button
            onClick={() => setActiveCodesTab('coupons')}
            className={`py-3 px-6 border-b-2 ${
              activeCodesTab === 'coupons' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-600 hover:border-gray-300'
            }`}
          >
            Manage Coupons
          </button>
        </nav>
      </div>

      {activeCodesTab === 'referrals' && (
        <>
          {/* Analytics for Referrals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Total Uses</h3>
              <p className="text-2xl font-bold">{stats.referrals.reduce((total, ref) => total + (ref.totalUsed || 0), 0)}</p>
              <p className="text-sm opacity-80">Across all users</p>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-300 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Discount Given</h3>
              <p className="text-2xl font-bold">₹{stats.totalDiscountsGiven.toLocaleString()}</p>
              <p className="text-sm opacity-80">Total savings provided</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Revenue Generated</h3>
              <p className="text-2xl font-bold">₹{stats.totalReferralRevenue.toLocaleString()}</p>
              <p className="text-sm opacity-80">From referral bookings</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Referral Code</h2>
            <form onSubmit={handleCreateReferralCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Referral Code</label>
                <input
                  type="text"
                  name="code"
                  value={newReferralCode.code}
                  onChange={(e) => setNewReferralCode({...newReferralCode, code: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                <input
                  type="number"
                  name="discountPercentage"
                  min="1"
                  max="100"
                  value={newReferralCode.discountPercentage}
                  onChange={(e) => setNewReferralCode({...newReferralCode, discountPercentage: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newReferralCode.description}
                  onChange={(e) => setNewReferralCode({...newReferralCode, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isCreatingCode}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {isCreatingCode ? 'Creating...' : 'Create Referral Code'}
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <h2 className="text-xl font-semibold p-6 border-b">Referral Codes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount %
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{referral.code}</div>
                          <div className="text-sm text-gray-500">{referral.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">
                          {referral.discountPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-gray-900">{referral.totalUsed || 0}</div>
                          <div className="text-sm text-gray-500">
                            ₹{(referral.totalDiscountGiven || 0).toLocaleString()} saved
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          ₹{(referral.totalRevenueGenerated || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${referral.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {referral.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleReferralStatus(referral.id, referral.isActive)}
                          className={`mr-2 ${
                            referral.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <FontAwesomeIcon 
                            icon={referral.isActive ? faBan : faCheck} 
                            className="mr-1"
                          />
                          {referral.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeCodesTab === 'coupons' && (
        <>
          {/* Analytics for Coupons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Total Coupons Issued</h3>
              <p className="text-2xl font-bold">{stats.totalCouponsIssued}</p>
              <p className="text-sm opacity-80">All active and inactive</p>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-300 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Total Redeemed</h3>
              <p className="text-2xl font-bold">{stats.totalCouponsRedeemed}</p>
              <p className="text-sm opacity-80">Successfully used coupons</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-white mb-1">Discount Given</h3>
              <p className="text-2xl font-bold">₹{stats.totalCouponDiscounts.toLocaleString()}</p>
              <p className="text-sm opacity-80">Total savings provided</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Coupon Code</h2>
            </div>
            <form onSubmit={handleCreateCouponCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  type="text"
                  name="code"
                  value={newCouponCode.code}
                  onChange={handleCouponInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                <input
                  type="number"
                  name="discountPercentage"
                  min="1"
                  max="100"
                  value={newCouponCode.discountPercentage}
                  onChange={handleCouponInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newCouponCode.description}
                  onChange={handleCouponInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="limitedUsage"
                      name="usageLimit"
                      checked={newCouponCode.usageLimit === 'limited'}
                      onChange={() => setNewCouponCode(prev => ({ 
                        ...prev, 
                        usageLimit: 'limited' 
                      }))}
                      className="h-4 w-4 text-orange-600 rounded"
                    />
                    <label htmlFor="limitedUsage" className="ml-2 block text-sm text-gray-700">
                      One-time use per user (default)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="unlimitedUsage"
                      name="usageLimit"
                      checked={newCouponCode.usageLimit === 'unlimited'}
                      onChange={() => setNewCouponCode(prev => ({ 
                        ...prev, 
                        usageLimit: 'unlimited' 
                      }))}
                      className="h-4 w-4 text-orange-600 rounded"
                    />
                    <label htmlFor="unlimitedUsage" className="ml-2 block text-sm text-gray-700">
                      Unlimited usage (can be used multiple times)
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Choose whether users can use this coupon once or multiple times
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="selectAllUsers"
                    name="userSelection"
                    checked={newCouponCode.selectAllUsers}
                    onChange={() => setNewCouponCode(prev => ({ ...prev, selectAllUsers: true }))}
                    className="h-4 w-4 text-orange-600 rounded"
                  />
                  <label htmlFor="selectAllUsers" className="ml-2 block text-sm text-gray-700">
                    Valid for all users
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="selectIndividualUsers"
                    name="userSelection"
                    checked={!newCouponCode.selectAllUsers}
                    onChange={() => setNewCouponCode(prev => ({ ...prev, selectAllUsers: false }))}
                    className="h-4 w-4 text-orange-600 rounded"
                  />
                  <label htmlFor="selectIndividualUsers" className="ml-2 block text-sm text-gray-700">
                    Valid for selected users
                  </label>
                </div>
              </div>
              
              {!newCouponCode.selectAllUsers && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Users</label>
                  <select 
                    multiple 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-48"
                    onChange={handleUserSelection}
                    required={!newCouponCode.selectAllUsers}
                    value={selectedUsers}
                    size="10"
                  >
                    {allUsers.map(user => (
                      <option 
                        key={user.id} 
                        value={user.id}
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
              
              <button
                type="submit"
                disabled={isCreatingCoupon}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {isCreatingCoupon ? 'Creating...' : 'Create Coupon Code'}
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b">Coupon Codes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount %
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage Limit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Uses
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coupon.discountPercentage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {coupon.assignedUsers ? (
                            <span className="flex items-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 mr-2">
                                Specific
                              </span>
                              {coupon.assignedUsers.length} specific users
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                                Global
                              </span>
                              All users
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.usageLimit === 'unlimited' ? 'Unlimited' : 'One-time per user'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.totalUsed || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{(coupon.totalRevenueGenerated || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          coupon.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleCouponStatus(coupon.id, coupon.isActive)}
                          className={`mr-2 ${
                            coupon.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <FontAwesomeIcon 
                            icon={coupon.isActive ? faBan : faCheck} 
                            className="mr-1"
                          />
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stats.coupons.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No coupon codes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCodesTabs; 