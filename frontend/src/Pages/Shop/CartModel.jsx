import React from 'react';
import OrderSummary from './OrderSummary';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../Redux/Features/Cart/CartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const CartModel = ({ products, isOpen, onClose }) => {
    const dispatch = useDispatch();

    const handleQuantity = (type, id) => {
        dispatch(updateQuantity({ type, id }));
    };

    const handleRemove = (e, id) => {
        e.preventDefault();
        dispatch(removeFromCart({ id }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed z-[1000] inset-0 bg-black bg-opacity-40 backdrop-blur-lg transition-opacity"
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="fixed right-0 top-0 md:w-1/3 w-full bg-white h-full shadow-2xl rounded-l-2xl overflow-y-auto p-5 flex flex-col"
                    >
                        <div className='flex justify-between items-center mb-6'>
                            <h4 className='text-2xl font-semibold text-gray-800'>🛒 Your Cart</h4>
                            <button onClick={onClose} className='text-gray-600 hover:text-gray-900 text-2xl'>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div className='cart-items space-y-4 flex-grow overflow-y-auto'>
                            {products.length === 0 ? (
                                <div className="text-center text-gray-500 flex flex-col items-center gap-2">
                                    <i className="ri-shopping-cart-2-line text-5xl"></i>
                                    <p>Your Cart is Empty</p>
                                </div>
                            ) : (
                                products.map((item, index) => (
                                    <motion.div
                                        key={`${item.id}-${index}`}  // <-- key fixed here
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className='flex items-center bg-white shadow-lg p-4 rounded-lg transform hover:scale-105 transition-all'
                                    >
                                        <img src={item.image} className='size-14 object-cover rounded-lg mr-4' alt={item.name} />
                                        <div className='flex-1'>
                                            <h5 className='text-lg font-medium text-gray-900'>{item.name}</h5>
                                            <p className='text-gray-600 text-sm'>Rs. {Number(item.price)}</p>
                                        </div>
                                        <div className='flex items-center'>
                                            <button onClick={() => handleQuantity('decrement', item.id)} className='size-8 bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-white rounded-full flex items-center justify-center transition-all'>-</button>
                                            <span className='mx-3 font-semibold text-lg'>{item.quantity}</span>
                                            <button onClick={() => handleQuantity('increment', item.id)} className='size-8 bg-gray-200 text-gray-700 hover:bg-green-400 hover:text-white rounded-full flex items-center justify-center transition-all'>+</button>
                                        </div>
                                        <button onClick={(e) => handleRemove(e, item.id)} className='ml-4 text-red-500 hover:text-red-800 text-xl transition-all'>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {products.length > 0 && <OrderSummary onClose={onClose}/>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartModel;
