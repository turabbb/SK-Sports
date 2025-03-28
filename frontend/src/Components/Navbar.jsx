import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartModel from '../Pages/Shop/CartModel';

const ContactPopup = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after a brief delay to ensure DOM update
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/923202440328', '_blank');
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with fade effect */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        } bg-black/50 backdrop-blur-sm`} 
        onClick={onClose}
      ></div>
      
      {/* Popup with slide-up and fade effect */}
      <div 
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 transition-all duration-300 transform ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 transition-transform duration-300 hover:scale-105">
            <i className="ri-phone-line text-3xl text-blue-600"></i>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4 transition-all duration-300 hover:scale-105">
            +92 320 2440328
          </p>
          
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-3 px-4 bg-green-500 text-white rounded-lg transition-all duration-300 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <i className="ri-whatsapp-line text-xl"></i>
            WhatsApp?
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
    const items = useSelector((state) => state.cart.items);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const [scrolling, setScrolling] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleContact = () => {
        setIsContactOpen(!isContactOpen);
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`w-nav sticky top-0 z-40 transition-all duration-700 ease-in-out ${
                scrolling ? 'bg-[#D9B9C8] shadow-lg' : 'bg-white'
            }`}
        >
            <nav className='max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-full'>
                <ul className="nav__links">
                    <li className="link">
                        <Link to="/sports">Sports</Link>
                    </li>
                    <li className="link">
                        <Link to="/sportswear">Sportswear</Link>
                    </li>
                    <li className="link">
                        <Link to="/casual">Casual</Link>
                    </li>
                    <li className="link">
                        <Link to="/accessories">Accessories</Link>
                    </li>
                </ul>

                <div className="nav__logo">
                    <Link to="/" className="font-bold text-xl text-gray-800">
                        SK Sports<span>.</span>
                    </Link>
                </div>

                <div className="nav__icons relative">
                    <span>
                        <Link to="/search">
                            <i className="ri-search-line"></i>
                        </Link>
                    </span>

                    <span>
                        <button onClick={toggleCart} className="hover:text-primary">
                            <i className="ri-shopping-cart-2-line"></i>
                            <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
                                {totalItems}
                            </sup>
                        </button>
                    </span>

                    <span>
                        <button onClick={toggleContact} className="hover:text-primary">
                            <i className="ri-phone-line"></i>
                        </button>
                    </span>
                </div>
            </nav>

            {isCartOpen && <CartModel products={items} isOpen={isCartOpen} onClose={toggleCart} />}
            <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </header>
    );
};

export default Navbar;