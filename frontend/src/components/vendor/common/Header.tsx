import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/vendor/vendorSlice';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Trips', href: '/trips' },
    { label: 'Account', href: '/account' },
    { label: 'About us', href: '/about' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/vendor'); // Navigate to login page after logout
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold">
            AVL Travells
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors duration-200 py-2 text-sm uppercase tracking-wider font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MessageCircle size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="text-left text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};