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
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

  // Pakistani payment methods
  const bankAccounts = [
    {
      bankName: "Meezan Bank",
      accountTitle: "Your Business Name",
      accountNumber: "11223344556677",
      iban: "PK24MEZN0000112233445566"
    },
    {
      bankName: "EasyPaisa",
      accountTitle: "Your Business Name",
      accountNumber: "03001234567",
      iban: "Not Required"
    },
    {
      bankName: "JazzCash",
      accountTitle: "Your Business Name", 
      accountNumber: "03007654321",
      iban: "Not Required"
    }
  ];

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
        paymentMethod
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
      // Validation
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone)
        return toast.error('Please fill in all contact information');
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.province || !shippingAddress.zip)
        return toast.error('Please fill in all shipping address fields');
      if (paymentMethod === 'Pay Now' && !paymentScreenshot)
        return toast.error('Please upload a payment screenshot');
      if (cartItems.length === 0)
        return toast.error('Your cart is empty');

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
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="input"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="input md:col-span-2"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="input md:col-span-2"
                />
                <input
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="input"
                />
                <input
                  placeholder="Province"
                  value={shippingAddress.province}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                  className="input"
                />
                <input
                  placeholder="ZIP Code"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                  className="input"
                />
                <select
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="input md:col-span-2"
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
                      onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

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
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
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