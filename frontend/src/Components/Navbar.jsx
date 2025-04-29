import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModel from '../Pages/Shop/CartModel';
import { useLogoutUserMutation } from '../Redux/Features/Auth/Auth';
import { logout } from '../Redux/Features/Auth/AuthSlice';

const ContactPopup = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
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
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
          } bg-black/50 backdrop-blur-sm`}
        onClick={onClose}
      ></div>

      <div
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 transition-all duration-300 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
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
  const { user } = useSelector((state) => state.UserAuth);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const [scrolling, setScrolling] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error("Error logging out");
    }
  };

  const handleScroll = () => {
    setScrolling(window.scrollY > 50);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-nav sticky top-0 z-40 transition-all duration-700 ease-in-out ${scrolling ? 'bg-[#D9B9C8] shadow-lg' : 'bg-white'
        }`}
    >
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center h-full">
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

        <div className="nav__icons relative flex items-center gap-4">
          <span>
            <Link to="/search">
              <i className="ri-search-line text-xl"></i>
            </Link>
          </span>

          <span>
            <button onClick={toggleCart} className="hover:text-primary relative">
              <i className="ri-shopping-cart-2-line text-xl"></i>
              <sup className="text-xs px-1.5 text-white rounded-full bg-primary text-center absolute -top-2 -right-2">
                {totalItems}
              </sup>
            </button>
          </span>

          <span>
            <button onClick={toggleContact} className="hover:text-primary">
              <i className="ri-phone-line text-xl"></i>
            </button>
          </span>

          {/* User Dropdown */}
          {user && user.username && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full text-sm shadow-lg hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: '#C9A9B8' }}
                title={`Logged in as ${user.username}`}
              >
                {user.username[0].toUpperCase()}
              </button>


              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 text-sm text-gray-800 font-medium border-b">
                    {user.username}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {isCartOpen && <CartModel products={items} isOpen={isCartOpen} onClose={toggleCart} />}
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
};

export default Navbar;
