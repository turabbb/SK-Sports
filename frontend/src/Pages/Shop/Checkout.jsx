import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { usePlaceOrderMutation } from '../../Redux/Features/Checkout/Order';
import { clearCart } from '../../Redux/Features/Cart/CartSlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import emailService from '../../services/emailService';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  // Use Redux state for pricing instead of manual calculation
  const { totalPrice: subtotal, delivery: deliveryCharges, grandTotal: totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', province: '', zip: '', country: 'Pakistan'
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const [showModal, setShowModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState('');

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        contents: cartItems.map(item => ({
          id: item._id,
          quantity: item.quantity,
          item_price: item.price
        })),
        content_type: 'product',
        value: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        currency: 'PKR'
      });
    }
  }, [cartItems]);

  // Pakistani payment methods
  const bankAccounts = [
    {
      bankName: "Meezan Bank",
      accountTitle: "Mohammad Omer",
      accountNumber: "02010103503498",
      iban: "PK02MEZN0002010103503498"
    },
    {
      bankName: "EasyPaisa",
      accountTitle: "Khalid Zubair",
      accountNumber: "03202440328",
      iban: "Not Required"
    },
    {
      bankName: "JazzCash",
      accountTitle: "Khalid Zubair", 
      accountNumber: "03202440328",
      iban: "Not Required"
    }
  ];

  // Clear error for specific field
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate all fields
  const validateFields = () => {
    const newErrors = {};

    // Customer info validation
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Shipping address validation
    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.province) {
      newErrors.province = 'Please select a province';
    }
    if (!shippingAddress.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    }

    // Payment validation
    if (paymentMethod === 'Pay Now' && !paymentScreenshot) {
      newErrors.paymentScreenshot = 'Payment screenshot is required';
    }

    // Cart validation
    if (cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const copyToClipboard = async (text, accountType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(accountType);
      setTimeout(() => setCopiedAccount(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Send order confirmation email
  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      setEmailSending(true);
      setEmailSent(false);
      
      console.log('📧 Starting email process...');
      
      const result = await emailService.sendOrderConfirmation(
        orderData,
        customerInfo,
        shippingAddress,
        cartItems,
        totalPrice,
        paymentMethod,
        subtotal,
        deliveryCharges
      );

      if (result.success) {
        console.log('✅ Email sent successfully!');
        toast.success(result.message);
        setEmailSent(true);
      } else {
        console.error('❌ Email failed:', result.error);
        toast.warn('Order placed successfully, but email notification failed to send.');
      }

    } catch (error) {
      console.error('❌ Email service error:', error);
      toast.warn('Order placed successfully, but email notification failed to send.');
    } finally {
      setEmailSending(false);
    }
  };

  // Test email function
  const testEmail = async () => {
    if (!customerInfo.email) {
      toast.error('Please enter your email address first');
      return;
    }

    try {
      console.log('🧪 Testing email...');
      const result = await emailService.sendTestEmail(customerInfo.email);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error('Test failed: ' + result.error);
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed: ' + error.message);
    }
  };

  const handleOrderSubmit = async () => {
    try {
      // Validate all fields
      if (!validateFields()) {
        toast.error('Please fill in all required fields correctly');
        // Scroll to first error
        const firstErrorElement = document.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Prepare order data
      const formData = new FormData();
      const transformedAddress = {
        address: `${shippingAddress.street}, ${shippingAddress.province}, ${shippingAddress.zip}`,
        city: shippingAddress.city,
        country: shippingAddress.country
      };

      formData.append('customerInfo', JSON.stringify(customerInfo));
      formData.append('shippingAddress', JSON.stringify(transformedAddress));
      formData.append('orderItems', JSON.stringify(cartItems));
      // Send breakdown to backend
      formData.append('subtotal', subtotal.toString());
      formData.append('deliveryCharges', deliveryCharges.toString());
      formData.append('totalPrice', totalPrice.toString());
      formData.append('paymentMethod', paymentMethod);
      if (paymentMethod === 'Pay Now' && paymentScreenshot)
        formData.append('paymentScreenshot', paymentScreenshot);

      // Place order
      console.log('🛒 Placing order...');
      const response = await placeOrder(formData).unwrap();
      console.log('✅ Order placed successfully:', response);
      
      setOrderNumber(response.orderNumber);
      
      // Show modal first
      setShowModal(true);
      document.body.style.overflow = 'hidden';
      
      // Clear cart
      dispatch(clearCart());
      
      // Send confirmation email (don't wait for it)
      sendOrderConfirmationEmail(response);
      
    } catch (err) {
      console.error('❌ Order submission error:', err);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = '';
    navigate('/');
  };

  // Get email service status
  const emailStatus = emailService.getConfigStatus();

  return (
    <>
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl p-8 text-center max-w-md w-full shadow-2xl">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-green-700">🎉 Order Confirmed!</h2>
                
                <div className="mb-6 space-y-3">
                  <p className="text-gray-700">
                    Thank you for your order, <span className="font-semibold">{customerInfo.name}</span>!
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Order Number:</p>
                    <p className="text-xl font-bold text-green-600">#{orderNumber}</p>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm">
                    {emailSending ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Sending confirmation email...</span>
                      </div>
                    ) : emailSent ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>Confirmation email sent to <strong>{customerInfo.email}</strong></span>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <span>Check your email for order confirmation</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">
                    We'll send you updates about your order status via email and SMS.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Checkout Form */}
      <div className={`relative z-30 ${showModal ? 'pointer-events-none select-none' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>

            {/* Contact Information */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    onFocus={() => clearError('name')}
                    className={`input w-full ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.name}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    onFocus={() => clearError('email')}
                    className={`input w-full ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.email}
                    </motion.p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    onFocus={() => clearError('phone')}
                    className={`input w-full ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.phone}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    onFocus={() => clearError('street')}
                    className={`input w-full ${errors.street ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.street && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.street}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <input
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    onFocus={() => clearError('city')}
                    className={`input w-full ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.city && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.city}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <select
                    value={shippingAddress.province}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                    onFocus={() => clearError('province')}
                    className={`input w-full ${errors.province ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">Select Province</option>
                    {pakistaniProvinces.map((province) => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                  {errors.province && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.province}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <input
                    placeholder="ZIP Code"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    onFocus={() => clearError('zip')}
                    className={`input w-full ${errors.zip ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.zip && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {errors.zip}
                    </motion.p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="input w-full border-gray-300"
                  >
                    {[
                      "Pakistan", "India", "United States", "United Kingdom", "Canada",
                      "Australia", "Germany", "France", "China", "Japan",
                      "UAE", "Saudi Arabia", "Bangladesh", "Nepal", "Sri Lanka"
                    ].map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Pay Now"
                    checked={paymentMethod === 'Pay Now'}
                    onChange={() => setPaymentMethod('Pay Now')}
                  />
                  <span>Pay Now</span>
                </label>

                {/* Payment Details Banner - Shows when Pay Now is selected */}
                <AnimatePresence>
                  {paymentMethod === 'Pay Now' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        {/* Header */}
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">Payment Details</h4>
                          <p className="text-sm text-gray-600">Choose any account below to complete your payment</p>
                        </div>

                        {/* Bank Accounts Grid */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                          {bankAccounts.map((account, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="mb-3">
                                <h5 className="font-semibold text-gray-900">{account.bankName}</h5>
                                <p className="text-sm text-gray-600">{account.accountTitle}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Account Number:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-medium">{account.accountNumber}</span>
                                    <button
                                      onClick={() => copyToClipboard(account.accountNumber, `${account.bankName}-account`)}
                                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                                      title="Copy account number"
                                    >
                                      {copiedAccount === `${account.bankName}-account` ? (
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </div>
                                
                                {account.iban !== "Not Required" && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">IBAN:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-medium">{account.iban}</span>
                                      <button
                                        onClick={() => copyToClipboard(account.iban, `${account.bankName}-iban`)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                                        title="Copy IBAN"
                                      >
                                        {copiedAccount === `${account.bankName}-iban` ? (
                                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                          </svg>
                                        ) : (
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Instructions */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h6 className="font-semibold text-gray-800 mb-2">Payment Instructions:</h6>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Transfer the exact order amount (Rs. {totalPrice.toLocaleString()}) to any account above</li>
                            <li>• Take a screenshot of the successful transaction</li>
                            <li>• Upload the screenshot below before placing your order</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {paymentMethod === 'Pay Now' && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Upload Payment Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setPaymentScreenshot(e.target.files[0]);
                        clearError('paymentScreenshot');
                      }}
                      className={`w-full border p-2 rounded-md ${errors.paymentScreenshot ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.paymentScreenshot && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {errors.paymentScreenshot}
                      </motion.p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Error Message */}
            {errors.cart && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-500 rounded-lg p-4"
              >
                <p className="text-red-500 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.cart}
                </p>
              </motion.div>
            )}

            {/* Place Order Button */}
            <div className="flex justify-end">
              <button
                onClick={handleOrderSubmit}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 sticky top-6 h-fit max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">Order Summary</h3>
            <div className="space-y-6">
              {cartItems.map((item, idx) => (
                <div key={`${item._id}-${item.selectedSize || 'no-size'}-${idx}`} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p>Quantity: <span className="font-medium text-gray-700">{item.quantity}</span></p>
                        {item.selectedSize && (
                          <p>Size: <span className="font-medium text-blue-600">{item.selectedSize}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            {/* Updated pricing breakdown */}
            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges:</span>
                <span>Rs. {deliveryCharges.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-2">
                <span>Total:</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;