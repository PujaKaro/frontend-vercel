import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes, 
  faEye, 
  faClock, 
  faMoneyBillWave,
  faUser,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faShoppingBag,
  faFilter,
  faSearch,
  faDownload,
  faPrint
} from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

const AdminUTRPaymentsTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersQuery = query(
        collection(db, 'orders'),
        where('paymentMethod', '==', 'UPI'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(ordersQuery);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      switch (action) {
        case 'confirm':
          await updateDoc(orderRef, { 
            status: 'confirmed',
            paymentStatus: 'confirmed',
            confirmedAt: new Date()
          });
          toast.success('Payment confirmed successfully');
          break;
        case 'reject':
          await updateDoc(orderRef, { 
            status: 'rejected',
            paymentStatus: 'rejected',
            rejectedAt: new Date()
          });
          toast.success('Payment rejected');
          break;
        case 'pending':
          await updateDoc(orderRef, { 
            status: 'pending',
            paymentStatus: 'pending'
          });
          toast.success('Payment marked as pending');
          break;
        default:
          break;
      }
      
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.utrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: faClock },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: faCheck },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: faTimes }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1" />
        {status}
      </span>
    );
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">UTR Payment Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage UPI payments and UTR number confirmations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total UPI Orders</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-green-900">
                  {orders.filter(o => o.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTimes} className="text-red-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900">
                  {orders.filter(o => o.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-orange-600"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTR Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Order #{order.id.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.createdAt?.toDate ? 
                              new Date(order.createdAt.toDate()).toLocaleDateString() :
                              new Date(order.createdAt).toLocaleDateString()
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items?.length || 0} items
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                        {order.shippingAddress?.phone && (
                          <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.utrNumber ? (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {order.utrNumber}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{order.total?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOrderAction(order.id, 'confirm')}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Confirm Payment"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={() => handleOrderAction(order.id, 'reject')}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Reject Payment"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </>
                          )}
                          {order.status !== 'pending' && (
                            <button
                              onClick={() => handleOrderAction(order.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-900 p-1"
                              title="Mark as Pending"
                            >
                              <FontAwesomeIcon icon={faClock} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900">Order Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Order ID:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date:</span>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.createdAt?.toDate ? 
                          new Date(selectedOrder.createdAt.toDate()).toLocaleString() :
                          new Date(selectedOrder.createdAt).toLocaleString()
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                      <p className="text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">UTR Number:</span>
                      <p className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedOrder.utrNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900">Customer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedOrder.userName}</span>
                    </div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedOrder.userEmail}</span>
                    </div>
                    {selectedOrder.shippingAddress?.phone && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{selectedOrder.shippingAddress.phone}</span>
                      </div>
                    )}
                    {selectedOrder.shippingAddress && (
                      <div className="flex items-start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2 mt-1" />
                        <div className="text-sm text-gray-900">
                          <div>{selectedOrder.shippingAddress.address}</div>
                          <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-semibold mb-4 text-gray-900">Order Items</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-6">
                <h4 className="font-semibold mb-4 text-gray-900">Payment Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium">₹{selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Tax (18% GST):</span>
                    <span className="text-sm font-medium">₹{selectedOrder.tax?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Delivery Charges:</span>
                    <span className="text-sm font-medium">₹{selectedOrder.shippingCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200 pt-2">
                    <span className="text-sm font-semibold text-gray-900">Total:</span>
                    <span className="text-sm font-bold text-orange-600">₹{selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeOrderModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, 'confirm');
                        closeOrderModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Confirm Payment
                    </button>
                    <button
                      onClick={() => {
                        handleOrderAction(selectedOrder.id, 'reject');
                        closeOrderModal();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Payment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUTRPaymentsTab; 