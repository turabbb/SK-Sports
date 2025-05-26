import React, { useState } from 'react';
import { useFetchOrderByNumberQuery } from "../../Redux/Features/Checkout/Order";

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [searchOrderNumber, setSearchOrderNumber] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const { data: trackingData, isLoading, error, refetch } = useFetchOrderByNumberQuery(searchOrderNumber, {
        skip: !searchOrderNumber
    });

    const trackingStages = [
        { status: 'Order Received', icon: '🕐', color: 'blue', description: 'Your order has been received and confirmed' },
        { status: 'Processing', icon: '📦', color: 'yellow', description: 'Your order is being prepared for shipment' },
        { status: 'In Transit', icon: '🚛', color: 'purple', description: 'Your order is on its way to you' },
        { status: 'Delivered', icon: '✅', color: 'green', description: 'Your order has been successfully delivered' }
    ];

    const handleInputChange = (e) => {
        let value = e.target.value.toUpperCase();

        // Just remove special characters except dashes and keep alphanumeric
        value = value.replace(/[^A-Z0-9-]/g, '');

        // Optional: Set a reasonable max length for order numbers
        if (value.length > 20) {
            value = value.substring(0, 20);
        }

        setOrderNumber(value);
    };

    const handleSearch = () => {
        if (orderNumber.length >= 5) { // Minimum reasonable order number length
            setSearchOrderNumber(orderNumber);
            setHasSearched(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getStageStatus = (stage) => {
        if (!trackingData) return 'pending';

        const currentStageIndex = trackingStages.findIndex(s => s.status === trackingData.trackingStatus);
        const stageIndex = trackingStages.findIndex(s => s.status === stage);

        if (stageIndex < currentStageIndex) return 'completed';
        if (stageIndex === currentStageIndex) return 'current';
        return 'pending';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (color, status) => {
        const colors = {
            blue: {
                bg: status === 'current' ? 'bg-blue-500' : status === 'completed' ? 'bg-blue-500' : 'bg-gray-200',
                text: status === 'current' ? 'text-blue-600' : status === 'completed' ? 'text-blue-600' : 'text-gray-400',
                border: status === 'current' ? 'border-blue-500' : status === 'completed' ? 'border-blue-500' : 'border-gray-300'
            },
            yellow: {
                bg: status === 'current' ? 'bg-yellow-500' : status === 'completed' ? 'bg-yellow-500' : 'bg-gray-200',
                text: status === 'current' ? 'text-yellow-600' : status === 'completed' ? 'text-yellow-600' : 'text-gray-400',
                border: status === 'current' ? 'border-yellow-500' : status === 'completed' ? 'border-yellow-500' : 'border-gray-300'
            },
            purple: {
                bg: status === 'current' ? 'bg-purple-500' : status === 'completed' ? 'bg-purple-500' : 'bg-gray-200',
                text: status === 'current' ? 'text-purple-600' : status === 'completed' ? 'text-purple-600' : 'text-gray-400',
                border: status === 'current' ? 'border-purple-500' : status === 'completed' ? 'border-purple-500' : 'border-gray-300'
            },
            green: {
                bg: status === 'current' ? 'bg-green-500' : status === 'completed' ? 'bg-green-500' : 'bg-gray-200',
                text: status === 'current' ? 'text-green-600' : status === 'completed' ? 'text-green-600' : 'text-gray-400',
                border: status === 'current' ? 'border-green-500' : status === 'completed' ? 'border-green-500' : 'border-gray-300'
            }
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Enter your complete order number (e.g., SPS-241125-00001)
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="max-w-md mx-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Order Number
                        </label>
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your order number"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono tracking-wider"
                                maxLength={17}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={orderNumber.length < 10 || isLoading}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                                ) : (
                                    'Track'
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Format: SPS-YYMMDD-NNNNN (e.g., SPS-241125-00001)
                        </p>
                    </div>
                </div>

                {/* Results Section */}
                {hasSearched && (
                    <>
                        {isLoading && (
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Searching for your order...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
                                <p className="text-gray-600 mb-4">
                                    We couldn't find an order with the number "{searchOrderNumber}".
                                </p>
                                <p className="text-sm text-gray-500">
                                    Please check your order number and try again, or contact our support team if you need assistance.
                                </p>
                            </div>
                        )}

                        {trackingData && (
                            <div className="space-y-8">
                                {/* Order Summary */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Order #{trackingData.orderNumber}
                                        </h2>
                                        <p className="text-gray-600">
                                            Placed on {formatDate(trackingData.createdAt)}
                                        </p>
                                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                                            <span className="text-2xl mr-2">
                                                {trackingStages.find(s => s.status === trackingData.trackingStatus)?.icon}
                                            </span>
                                            <span className="font-semibold text-blue-700">
                                                {trackingData.trackingStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative mb-12">
                                        <div className="flex justify-between items-center">
                                            {trackingStages.map((stage, index) => {
                                                const status = getStageStatus(stage.status);
                                                const colors = getStatusColor(stage.color, status);

                                                return (
                                                    <div key={stage.status} className="flex flex-col items-center relative z-10">
                                                        <div className={`w-12 h-12 rounded-full border-4 ${colors.border} ${colors.bg} flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300`}>
                                                            {status === 'completed' ? '✓' : status === 'current' ? stage.icon : index + 1}
                                                        </div>
                                                        <div className="mt-3 text-center max-w-24">
                                                            <p className={`text-sm font-medium ${colors.text}`}>
                                                                {stage.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Progress Line */}
                                        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-10">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${((trackingStages.findIndex(s => s.status === trackingData.trackingStatus)) / (trackingStages.length - 1)) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tracking History */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h3>
                                    <div className="space-y-4">
                                        {trackingData.trackingHistory?.map((track, index) => {
                                            const stageInfo = trackingStages.find(s => s.status === track.status);
                                            return (
                                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                                    <div className="text-2xl">
                                                        {stageInfo?.icon || '📋'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-semibold text-gray-900">{track.status}</h4>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(track.updatedAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-sm">
                                                            {track.note || stageInfo?.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white rounded-2xl shadow-xl p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Items</h3>
                                    <div className="space-y-4">
                                        {trackingData.orderItems?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                Rs. {trackingData.totalPrice?.toFixed(0)}
                                            </span>
                                        </div>
                                        {trackingData.isDelivered && (
                                            <p className="text-sm text-green-600 mt-2">
                                                ✅ Delivered on {formatDate(trackingData.deliveredAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Help Section */}
                {!hasSearched && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-4">
                            Can't find your order number? Check your email confirmation or contact our support team.
                        </p>
                        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Contact Support
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;