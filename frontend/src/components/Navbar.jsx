import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-serif text-2xl border-2 border-red-700 shadow-inner group-hover:bg-red-700 transition-colors shrink-0">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-serif font-bold text-gray-900 tracking-wide uppercase leading-none">Half Fried</span>
              <span className="text-[9px] md:text-[10px] text-red-600 font-bold tracking-widest uppercase mt-1">Authentic Indo-Chinese</span>
            </div>
          </Link>

          {/* Mobile Right Side: Cart + Hamburger */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative text-gray-600 hover:text-red-700 transition-colors" onClick={closeMenu}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-yellow-500 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              className="text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm uppercase tracking-wide font-bold text-gray-600 hover:text-red-700 transition-colors">
              Our Menu
            </Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-red-700 transition-colors pr-2">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-yellow-500 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-5 border-l border-gray-200 pl-6">
                <Link to={user.role === 'admin' ? '/admin' : '/orders'} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-700 transition-colors">
                  <User className="w-4 h-4" /> {user.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
                <Link to="/register" className="bg-red-600 text-white text-sm uppercase tracking-wider px-6 py-2.5 rounded hover:bg-red-700 transition-colors shadow-sm font-bold">
                  Order Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white space-y-4">
            <Link 
              to="/products" 
              className="block px-4 py-2 text-base uppercase tracking-wide font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors rounded-lg"
              onClick={closeMenu}
            >
              Our Menu
            </Link>
            
            {user ? (
              <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
                <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</div>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/orders'} 
                  className="flex items-center gap-3 px-4 py-2 text-base font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  <User className="w-5 h-5" /> {user.name} Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-base font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 mt-2 space-y-3 px-4 flex flex-col">
                <Link 
                  to="/login" 
                  className="w-full py-3 text-center text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full py-3 text-center bg-red-600 text-white text-sm uppercase tracking-wider rounded-lg hover:bg-red-700 transition-colors shadow-sm font-bold"
                  onClick={closeMenu}
                >
                  Order Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
