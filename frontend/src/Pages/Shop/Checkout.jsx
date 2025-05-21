import { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePlaceOrderMutation } from '../../Redux/Features/Checkout/Order';
import { toast } from 'react-toastify';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    province: '',
    zip: '',
    country: 'Pakistan'
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleOrderSubmit = async () => {
    try {
      // Validation
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        return toast.error('Please fill in all contact information');
      }
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.province || !shippingAddress.zip) {
        return toast.error('Please fill in all shipping address fields');
      }
      if (paymentMethod === 'Pay Now' && !paymentScreenshot) {
        return toast.error('Please upload a payment screenshot');
      }
      if (cartItems.length === 0) {
        return toast.error('Your cart is empty');
      }

      // Create FormData
      const formData = new FormData();
      
      const transformedAddress = {
        address: `${shippingAddress.street}, ${shippingAddress.province}, ${shippingAddress.zip}`,
        city: shippingAddress.city,
        country: shippingAddress.country
      };

      // Append data to FormData
      formData.append('customerInfo', JSON.stringify(customerInfo));
      formData.append('shippingAddress', JSON.stringify(transformedAddress));
      formData.append('orderItems', JSON.stringify(cartItems));
      formData.append('totalPrice', totalPrice.toString());
      formData.append('paymentMethod', paymentMethod);
      
      if (paymentMethod === 'Pay Now' && paymentScreenshot) {
        formData.append('paymentScreenshot', paymentScreenshot);
      }

      console.log("Submitting order data:");
      console.log("- Customer Info:", customerInfo);
      console.log("- Shipping Address:", transformedAddress);
      console.log("- Payment Method:", paymentMethod);
      console.log("- Total Price:", totalPrice);

      const response = await placeOrder(formData).unwrap();
      console.log("Order created successfully:", response);
      setOrderId(response._id);
      setShowModal(true);
    } catch (err) {
      console.error("Order creation error:", err);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className={`relative ${showModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
      {/* Main Checkout Form */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>

          {/* Contact Info */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="input" />
              <input type="email" placeholder="Email Address" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="input" />
              <input type="tel" placeholder="Phone Number" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="input md:col-span-2" />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Street Address" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} className="input md:col-span-2" />
              <input placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="input" />
              <input placeholder="Province" value={shippingAddress.province} onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })} className="input" />
              <input placeholder="ZIP Code" value={shippingAddress.zip} onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} className="input" />
              <select value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="input md:col-span-2">
                {["Pakistan", "India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "China", "Japan", "UAE", "Saudi Arabia", "Bangladesh", "Nepal", "Sri Lanka"].map((country) => (
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
                <input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value="Pay Now" checked={paymentMethod === 'Pay Now'} onChange={() => setPaymentMethod('Pay Now')} />
                <span>Pay Now</span>
              </label>
              {paymentMethod === 'Pay Now' && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
                  <input type="file" accept="image/*" onChange={(e) => setPaymentScreenshot(e.target.files[0])} className="w-full border p-2 rounded-md" />
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
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 sticky top-6 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
          <div className="space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border" />
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-700">Rs. {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>Rs. 0</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal After Order Success */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white rounded-xl p-8 text-center max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Thank you for placing the order!</h2>
            <p className="text-gray-700 mb-2">An email has been sent to you with your order details.</p>
            <p className="text-gray-800 font-semibold">Order ID: <span className="text-green-600">{orderId}</span></p>
            <button
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => window.location.reload()}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;