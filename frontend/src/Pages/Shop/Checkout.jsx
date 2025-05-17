import { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePlaceOrderMutation } from '../../Redux/Features/Checkout/Order';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', province: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [placeOrder] = usePlaceOrderMutation();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleOrderSubmit = async () => {
    const formData = new FormData();
    formData.append('customerInfo', JSON.stringify(customerInfo));
    formData.append('shippingAddress', JSON.stringify(shippingAddress));
    formData.append('orderItems', JSON.stringify(cartItems));
    formData.append('totalPrice', totalPrice);
    formData.append('paymentMethod', paymentMethod);
    if (paymentScreenshot) formData.append('paymentScreenshot', paymentScreenshot);

    try {
      await placeOrder(formData).unwrap();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Customer Info</h3>
          <input
            type="text"
            placeholder="Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <textarea
            placeholder="Street"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            placeholder="Province"
            value={shippingAddress.province}
            onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
          <input
            placeholder="ZIP Code"
            value={shippingAddress.zip}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
            className="mb-2 w-full p-2 border rounded"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="Cash on Delivery"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={() => setPaymentMethod("Cash on Delivery")}
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="radio"
              id="paynow"
              name="payment"
              value="Pay Now"
              checked={paymentMethod === "Pay Now"}
              onChange={() => setPaymentMethod("Pay Now")}
            />
            <label htmlFor="paynow">Pay Now</label>
          </div>

          {paymentMethod === 'Pay Now' && (
            <div className="mb-2">
              <label htmlFor="screenshot">Upload Screenshot:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                className="w-full mt-1"
              />
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
          <p><strong>Name:</strong> {customerInfo.name}</p>
          <p><strong>Email:</strong> {customerInfo.email}</p>
          <p><strong>Phone:</strong> {customerInfo.phone}</p>
          <p><strong>Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.zip}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Total:</strong> Rs. {totalPrice}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded">
            Back
          </button>
        )}
        {step < 4 && (
          <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">
            Next
          </button>
        )}
        {step === 4 && (
          <button onClick={handleOrderSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
