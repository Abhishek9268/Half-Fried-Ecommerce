import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, User, ShoppingBag, Settings, Menu, X, MapPin, Mail, Phone, ExternalLink, UserPlus } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateFilter, setDateFilter] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/orders' : '/orders/myorders';
        const res = await api.get(endpoint);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setOrders([]);
      }
    };
    fetchMyOrders();
    // Optional: Real-time sync polling
    const intervalId = setInterval(fetchMyOrders, 10000); // Polling every 10s for real-time sync
    return () => clearInterval(intervalId);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', id: 'dashboard', icon: Home },
    { name: 'My Orders', id: 'orders', icon: ShoppingBag },
    { name: 'Profile Account', id: 'profile', icon: User },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header (Top Nav Replacement for Mobile) */}
      <div className="md:hidden bg-stone-900 text-white flex items-center justify-between p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">HF</div>
          <span className="font-serif font-bold text-xl tracking-wide">Half Fried</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-stone-900 text-white w-64 flex flex-col shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Left Side Branding */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-stone-800">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-red-500/30">HF</div>
          <div>
            <h1 className="font-serif font-bold text-2xl tracking-wide text-white">Half Fried</h1>
            <p className="text-xs text-stone-400">Dashboard Portal</p>
          </div>
        </div>

        {/* Cleaned Up Menu Customization */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const className = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left ${isActive ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-stone-300 hover:bg-stone-800 hover:text-white'}`;
            const iconClassName = isActive ? 'text-white' : 'text-stone-400 group-hover:text-white';
            
            if (item.path) {
              return (
                <Link key={item.name} to={item.path} className={className} onClick={() => setIsSidebarOpen(false)}>
                  <item.icon size={18} className={iconClassName} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            }
            return (
              <button key={item.name} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={className}>
                <item.icon size={18} className={iconClassName} />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout & Account Menu */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link 
            to="/register"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-stone-300 hover:bg-stone-800 hover:text-white transition-all duration-200 group"
          >
            <UserPlus size={18} className="text-stone-400 group-hover:text-white" />
            <span className="font-medium text-sm">Add New Account</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-stone-300 hover:bg-red-600 hover:text-white transition-all duration-200 group"
          >
            <LogOut size={18} className="text-stone-400 group-hover:text-white" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 overflow-hidden">
        
        {/* Top Navigation Bar */}
        <header className="hidden md:flex bg-white h-20 items-center justify-between px-8 border-b border-stone-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-stone-800">Welcome, {user?.name || 'Guest'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-stone-500 hover:text-red-600 border border-stone-200 px-4 py-2 rounded-lg hover:border-red-200 transition-colors flex items-center gap-2">
              <ExternalLink size={14} /> Back to Website
            </Link>
            <div className="bg-stone-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-stone-600 border-2 border-stone-200">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Display Area */}
        <main className="flex-1 px-4 py-8 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (() => {
              const filteredOrders = dateFilter 
                ? orders.filter(o => new Date(o.created_at).toLocaleDateString() === dateFilter)
                : orders;

              const totalRevenue = filteredOrders.reduce((acc, order) => {
                if (order.status === 'Paid' || order.status === 'Delivered') {
                  return acc + parseFloat(order.base_total);
                }
                return acc;
              }, 0);

              const dailyStats = orders.reduce((acc, order) => {
                const date = new Date(order.created_at).toLocaleDateString();
                if (!acc[date]) {
                  acc[date] = { count: 0, revenue: 0 };
                }
                acc[date].count += 1;
                if (order.status === 'Paid' || order.status === 'Delivered') {
                  acc[date].revenue += parseFloat(order.base_total);
                }
                return acc;
              }, {});

              return (
              <>
                {/* User Related Data Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-1">Dashboard ID</p>
                    <p className="text-lg font-bold text-stone-900 truncate">{user?.email}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Member
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-1">Total Orders</p>
                    <p className="text-2xl font-black text-stone-900">{filteredOrders.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                    <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-1">Member Since</p>
                    <p className="text-lg font-bold text-stone-900">2026</p>
                  </div>
                </div>

                {/* Daily Activity */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                  <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Daily Order Activity (Click to filter)</h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setDateFilter('')}
                      className={`px-5 py-3 rounded-xl border text-left transition-all ${
                        dateFilter === '' ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-stone-200 hover:border-red-300 shadow-sm'
                      }`}
                    >
                      <p className="text-xs font-bold text-stone-500 uppercase mb-1">All Time</p>
                      <p className="text-lg font-extrabold text-stone-900">{orders.length} Orders</p>
                      <p className="text-xs font-semibold text-stone-400">₹{totalRevenue.toFixed(2)} Total</p>
                    </button>
                    
                    {Object.entries(dailyStats).map(([date, stats]) => (
                      <button 
                        key={date}
                        onClick={() => setDateFilter(date)}
                        className={`px-5 py-3 rounded-xl border text-left transition-all min-w-[140px] ${
                          dateFilter === date ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-stone-200 hover:border-red-300 shadow-sm bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-stone-500 uppercase mb-1">{date}</p>
                        <p className="text-lg font-extrabold text-stone-900">₹{stats.revenue.toFixed(2)}</p>
                        <p className="text-xs font-semibold text-red-600 bg-red-100 inline-block px-2 py-0.5 rounded-full mt-1.5">{stats.count} Orders</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Sections */}
                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-stone-100 bg-white">
                    <h3 className="text-xl font-bold text-stone-900">
                      {dateFilter ? `Recent Order Activity for ${dateFilter}` : 'Recent Order Activity'}
                    </h3>
                  </div>
                  <div className="p-8">
                    {filteredOrders.length > 0 ? (
                      <div className="space-y-4">
                        {filteredOrders.slice(0, 3).map(order => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-red-100 hover:bg-red-50/30 transition-colors group">
                            <div>
                              <p className="font-bold text-stone-800">Order #{order.id}</p>
                              <p className="text-sm text-stone-500">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center gap-4">
                              <span className="font-black text-stone-900">₹{order.base_total}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        {filteredOrders.length > 3 && (
                          <div className="text-center pt-4">
                            <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-red-600 hover:text-red-700">View All Orders &rarr;</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-stone-200 mb-4" />
                        <p className="text-stone-500 font-medium pb-2">You haven't placed any orders yet.</p>
                        <Link to="/products" className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition">Explore Nu-Asian Menu</Link>
                      </div>
                    )}
                  </div>
                </div>
              </>
              );
            })()}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-stone-100 bg-white">
                  <h3 className="text-xl font-bold text-stone-900">My Complete Order History</h3>
                </div>
                <div className="p-8">
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-red-100 hover:bg-red-50/30 transition-colors group">
                          <div>
                            <p className="font-bold text-stone-800">Order #{order.id}</p>
                            <p className="text-sm text-stone-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center gap-4">
                            <span className="font-black text-stone-900">₹{order.base_total}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-stone-200 mb-4" />
                      <p className="text-stone-500 font-medium pb-2">You haven't placed any orders yet.</p>
                      <Link to="/products" className="inline-block bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition">Explore Nu-Asian Menu</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-2xl font-bold text-stone-900 mb-6">Profile Account</h3>
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Full Name</label>
                    <p className="mt-1 text-lg font-medium text-stone-900">{user?.name || 'Guest User'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Dashboard ID (Email)</label>
                    <p className="mt-1 text-lg font-medium text-stone-900">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Role</label>
                     <p className="mt-1 inline-block px-3 py-1 bg-stone-100 text-stone-800 text-sm font-bold rounded-md">{user?.role === 'admin' ? 'Administrator' : 'Standard Member'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-2xl font-bold text-stone-900 mb-6">Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-stone-100">
                    <div>
                      <p className="font-bold text-stone-900">Email Notifications</p>
                      <p className="text-sm text-stone-500">Receive order status updates via email.</p>
                    </div>
                    <button className="w-12 h-6 bg-red-600 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-stone-100">
                    <div>
                      <p className="font-bold text-stone-900">SMS Alerts</p>
                      <p className="text-sm text-stone-500">Get text messages for deliveries.</p>
                    </div>
                    <button className="w-12 h-6 bg-stone-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400">
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                    </button>
                  </div>
                  <div className="pt-4">
                     <button className="px-6 py-2 bg-stone-900 text-white border border-stone-900 font-bold rounded-lg hover:bg-stone-800 shadow-md transition-all">
                       Save Preferences
                     </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>


      </div>

    </div>
  );
};

export default Dashboard;
