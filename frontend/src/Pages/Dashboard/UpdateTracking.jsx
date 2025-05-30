import React, { useState } from 'react';
import { Eye, Package, Truck, CheckCircle, Clock, X, Edit } from 'lucide-react';
import { useFetchAllOrdersQuery, useUpdateTrackingMutation } from '../../Redux/Features/Checkout/Order';

const UpdateTracking = () => {
  const { data: orders = [], isLoading, error, refetch } = useFetchAllOrdersQuery();
  const [updateTracking, { isLoading: updateLoading }] = useUpdateTrackingMutation();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  const trackingStatuses = [
    { value: 'Order Received', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'Processing', icon: Package, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { value: 'In Transit', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { value: 'Delivered', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' }
  ];

  const getStatusIcon = (status) => {
    const statusInfo = trackingStatuses.find(s => s.value === status);
    if (!statusInfo) return Clock;
    return statusInfo.icon;
  };

  const getStatusColor = (status) => {
    const statusInfo = trackingStatuses.find(s => s.value === status);
    return statusInfo ? statusInfo.color : 'text-gray-500';
  };

  const getStatusBg = (status) => {
    const statusInfo = trackingStatuses.find(s => s.value === status);
    return statusInfo ? statusInfo.bg : 'bg-gray-50';
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.trackingStatus);
    setNote('');
    setShowModal(true);
  };

  const handleUpdateTracking = async () => {
    if (!newStatus || !selectedOrder) return;
    
    try {
      await updateTracking({
        id: selectedOrder._id,
        trackingStatus: newStatus,
        note: note || `Order status updated to ${newStatus}`
      }).unwrap();
      
      setShowModal(false);
      setSelectedOrder(null);
      refetch(); // Refresh the orders list
    } catch (error) {
      console.error('Failed to update tracking:', error);
      alert('Failed to update tracking status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Orders</h2>
          <p>{error?.message || 'Failed to fetch orders'}</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Order Tracking</h1>
          <p className="text-gray-600">Manage and update the tracking status of all orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500">There are no orders to display at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.trackingStatus);
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusBg(order.trackingStatus)}`}>
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(order.trackingStatus)}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(order.trackingStatus)} ${getStatusColor(order.trackingStatus)}`}>
                        {order.trackingStatus}
                      </span>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Customer:</span>
                      <p className="text-gray-600">{order.customerInfo?.name}</p>
                      <p className="text-gray-600">{order.customerInfo?.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Items:</span>
                      <p className="text-gray-600">{order.orderItems?.length} item(s)</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total:</span>
                      <p className="text-gray-600 font-semibold">Rs. {order.totalPrice?.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Order Details and Tracking Update */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details - #{selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Name:</span> {selectedOrder.customerInfo?.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.customerInfo?.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.customerInfo?.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Shipping Address:</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.shippingAddress?.address}<br/>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items with Sizes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <p>
                              Quantity: {item.quantity} × Rs. {item.price?.toFixed(0)}
                            </p>
                            {/* ✅ DISPLAY SIZE */}
                            {item.size && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            Rs. {(item.quantity * item.price)?.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking History */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tracking History</h3>
                  <div className="space-y-3">
                    {selectedOrder.trackingHistory?.map((track, index) => {
                      const StatusIcon = getStatusIcon(track.status);
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getStatusBg(track.status)}`}>
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(track.status)}`} />
                          </div>
                          <div>
                            <p className="font-medium">{track.status}</p>
                            <p className="text-sm text-gray-600">{track.note}</p>
                            <p className="text-xs text-gray-500">{formatDate(track.updatedAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Update Tracking Section */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Edit className="h-5 w-5 mr-2" />
                    Update Tracking Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {trackingStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note (Optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note about this status update..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={handleUpdateTracking}
                      disabled={updateLoading || newStatus === selectedOrder.trackingStatus}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {updateLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Edit className="h-5 w-5" />
                          <span>Update Tracking</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTracking;