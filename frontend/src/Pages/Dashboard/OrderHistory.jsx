import React, { useState, useMemo } from 'react';
import { useFetchAllOrdersQuery } from "../../Redux/Features/Checkout/Order";

const OrderHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: orders = [], isLoading, error, refetch } = useFetchAllOrdersQuery();

  const trackingStages = [
    { status: 'Order Received', icon: '🕐', color: 'blue' },
    { status: 'Processing', icon: '📦', color: 'yellow' },
    { status: 'In Transit', icon: '🚛', color: 'purple' },
    { status: 'Delivered', icon: '✅', color: 'green' }
  ];

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.trackingStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort orders
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.totalPrice - a.totalPrice;
        case 'lowest':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    return sorted;
  }, [orders, filterStatus, sortBy, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(order => order.trackingStatus === 'Delivered').length;
    const pendingOrders = orders.filter(order => order.trackingStatus !== 'Delivered').length;

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders
    };
  }, [orders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    const stage = trackingStages.find(s => s.status === status);
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[stage?.color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const stage = trackingStages.find(s => s.status === status);
    return stage?.icon || '📋';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">Unable to fetch order history. Please try again.</p>
            <button 
              onClick={refetch}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Management Dashboard</h1>
          <p className="text-lg text-gray-600">Monitor and manage all store orders</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">PKR {stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Order Received">Order Received</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredAndSortedOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No orders match your current filters.' 
                  : 'No orders have been placed yet.'
                }
              </p>
            </div>
          ) : (
            filteredAndSortedOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {getStatusIcon(order.trackingStatus)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.trackingStatus)}`}>
                        {order.trackingStatus}
                      </span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          PKR {order.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">👤</span>
                        Customer Details
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Name:</strong> {order.customerInfo?.name || order.shippingAddress?.name}</p>
                        <p><strong>Email:</strong> {order.customerInfo?.email}</p>
                        <p><strong>Phone:</strong> {order.customerInfo?.phone}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">📍</span>
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        <p>{order.shippingAddress?.country}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <span className="mr-2">💳</span>
                        Payment Details
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs ${
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </p>
                        {order.paidAt && (
                          <p><strong>Paid At:</strong> {formatDate(order.paidAt)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🛍️</span>
                      Order Items ({order.orderItems?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.title}</h5>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × PKR {item.price?.toLocaleString()} = 
                              <strong className="ml-1">PKR {(item.quantity * item.price)?.toLocaleString()}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-2xl text-blue-600">PKR {order.totalPrice?.toLocaleString()}</span>
                    </div>
                    
                    {order.isDelivered && (
                      <div className="mt-2 text-sm text-green-600 flex items-center">
                        <span className="mr-1">✅</span>
                        Delivered on {formatDate(order.deliveredAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total Revenue Summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-2">Total Store Revenue</h2>
          <p className="text-5xl font-bold mb-4">PKR {stats.totalRevenue?.toLocaleString()}</p>
          <p className="text-lg opacity-90">
            From {stats.totalOrders} orders • {stats.deliveredOrders} delivered • {stats.pendingOrders} pending
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-2xl font-bold">{((stats.deliveredOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%</p>
              <p className="text-sm opacity-90">Delivery Rate</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-2xl font-bold">PKR {(stats.totalRevenue / stats.totalOrders || 0).toLocaleString()}</p>
              <p className="text-sm opacity-90">Average Order Value</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-2xl font-bold">PKR {(stats.totalRevenue / stats.deliveredOrders || 0).toLocaleString()}</p>
              <p className="text-sm opacity-90">Revenue per Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;