import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../Redux/Features/Cart/CartSlice';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Use Redux state instead of manual calculation
    const { selectedItems, totalPrice: subtotal, delivery: deliveryCharges, grandTotal } = useSelector((store) => store.cart);

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckout = () => {
        onClose(); // Close the cart modal
        navigate("/checkout"); // Navigate to checkout page
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }} 
            className='bg-primary-light mt-5 rounded-lg shadow-lg p-6'
        >
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>📦 Order Summary</h2>
            <p className='text-gray-700'>Items Quantity: <span className='font-medium'>{selectedItems}</span></p>
            <p className='text-gray-700'>Subtotal: <span className='font-medium'>Rs. {subtotal.toLocaleString()}</span></p>
            <p className='text-gray-700'>Delivery Charges: <span className='font-medium'>Rs. {deliveryCharges.toLocaleString()}</span></p>
            <h3 className='text-lg font-bold mt-3 border-t pt-3'>Grand Total: <span className='text-green-600'>Rs. {grandTotal.toLocaleString()}</span></h3>
            
            <div className='mt-5 flex flex-col gap-3'>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); handleClearCart(); }}
                    className='bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-md'
                >
                    <i className="ri-delete-bin-6-line"></i> Clear Cart
                </motion.button>

                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCheckout}
                    className='bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-md'
                >
                    <i className="ri-bank-card-line"></i> Checkout
                </motion.button>
            </div>
        </motion.div>
    );
};

export default OrderSummary;