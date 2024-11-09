import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/user/userSlice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Trips', href: '/trips' },
    { label: 'Account', href: '/account' },
    { label: 'About us', href: '/about' }
  ];
const dispatch = useDispatch()
const handleLogout = () => {
  dispatch(logout());
};

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-lg">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="rounded-full w-30 h-30  "  />
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TravaLog
              </h1>
              <span className="text-xs text-gray-300 hidden sm:block">Explore the World</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-gray-300 hover:text-white transition-colors duration-200 py-2 text-sm uppercase tracking-wider font-medium group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ))}
           <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  
                >
                 
                  Logout
                </button>
          </div>

          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg">
            <div className="flex flex-col space-y-2 px-4 py-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;