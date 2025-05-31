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
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6 m-4 transition-all duration-300 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <i className="ri-close-line text-lg sm:text-xl"></i>
        </button>

        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 transition-transform duration-300 hover:scale-105">
            <i className="ri-phone-line text-2xl sm:text-3xl text-blue-600"></i>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 transition-all duration-300 hover:scale-105">
            +92 320 2440328
          </p>

          <button
            onClick={handleWhatsAppClick}
            className="w-full py-2.5 sm:py-3 px-4 bg-green-500 text-white rounded-lg transition-all duration-300 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <i className="ri-whatsapp-line text-lg sm:text-xl"></i>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
      setDropdownOpen(false);
      setMobileMenuOpen(false);
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

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-700 ease-in-out ${scrolling ? 'bg-[#D9B9C8] shadow-lg' : 'bg-white'
          }`}
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 lg:h-20">
          {/* Desktop Navigation Links - Hidden on Mobile */}
          <ul className="hidden lg:flex nav__links space-x-1">
            <li className="link">
              <Link to="/sports" className="hover:text-primary transition-colors">Sports</Link>
            </li>
            <li className="link">
              <Link to="/sportswear" className="hover:text-primary transition-colors">Sportswear</Link>
            </li>
            <li className="link">
              <Link to="/casual" className="hover:text-primary transition-colors">Casual</Link>
            </li>
            <li className="link">
              <Link to="/accessories" className="hover:text-primary transition-colors">Accessories</Link>
            </li>
          </ul>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-700 hover:text-primary transition-colors"
          >
            <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>

          {/* Logo - Centered on mobile, left on desktop */}
          <div className="nav__logo flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="font-bold text-lg sm:text-xl text-gray-800">
              SK Sports<span>.</span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="nav__icons relative flex items-center gap-3 sm:gap-4">
            {/* Search - Hidden on small mobile */}
            <span className="hidden sm:block">
              <Link to="/search" className="hover:text-primary transition-colors">
                <i className="ri-search-line text-lg sm:text-xl"></i>
              </Link>
            </span>

            {/* Cart */}
            <span>
              <button onClick={toggleCart} className="hover:text-primary relative transition-colors">
                <i className="ri-shopping-cart-2-line text-lg sm:text-xl"></i>
                <sup className="text-xs px-1.5 text-white rounded-full bg-primary text-center absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center">
                  {totalItems}
                </sup>
              </button>
            </span>

            {/* Contact */}
            <span>
              <button onClick={toggleContact} className="hover:text-primary transition-colors">
                <i className="ri-phone-line text-lg sm:text-xl"></i>
              </button>
            </span>

            {/* User Dropdown */}
            {user && user.username && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white font-semibold rounded-full text-xs sm:text-sm shadow-lg hover:scale-105 transition-transform duration-300"
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
                      onClick={() => setDropdownOpen(false)}
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
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link to="/" className="font-bold text-xl text-gray-800" onClick={closeMobileMenu}>
              SK Sports<span>.</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sports"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                  onClick={closeMobileMenu}
                >
                  <i className="ri-football-line mr-3"></i>
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  to="/sportswear"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                  onClick={closeMobileMenu}
                >
                  <i className="ri-shirt-line mr-3"></i>
                  Sportswear
                </Link>
              </li>
              <li>
                <Link
                  to="/casual"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                  onClick={closeMobileMenu}
                >
                  <i className="ri-t-shirt-line mr-3"></i>
                  Casual
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                  onClick={closeMobileMenu}
                >
                  <i className="ri-handbag-line mr-3"></i>
                  Accessories
                </Link>
              </li>
              
              {/* Mobile-only Search */}
              <li className="sm:hidden">
                <Link
                  to="/search"
                  className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
                  onClick={closeMobileMenu}
                >
                  <i className="ri-search-line mr-3"></i>
                  Search
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Section */}
          {user && user.username && (
            <div className="border-t p-6">
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full text-sm mr-3"
                  style={{ backgroundColor: '#C9A9B8' }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{user.username}</span>
              </div>
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && <CartModel products={items} isOpen={isCartOpen} onClose={toggleCart} />}
      
      {/* Contact Popup */}
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Navbar;