import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Package, Users, ShoppingBag, PlusCircle, CheckCircle, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [dateFilter, setDateFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  // Product Form State
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: ''
  });
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load real orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      const price = parseFloat(productData.price);
      if (isNaN(price)) throw new Error("Price must be a number");
      
      await api.post('/products', {
        ...productData,
        price,
        stock: 999, // default stock
        category_id: productData.category_id ? parseInt(productData.category_id) : null
      });
      toast.success('Menu item added successfully!');
      setProductData({ name: '', description: '', price: '', image_url: '', category_id: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to add item');
    } finally {
      setAddingProduct(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-medium">Loading Dashboard Data...</div>;

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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Restaurant Dashboard</h2>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all"
            title="Switch User / Logout"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Switch Account</span>
          </button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Order Management
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Menu Control
          </button>
        </div>
      </div>
      
      {activeTab === 'orders' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-rose-100 p-4 rounded-xl text-rose-600"><ShoppingBag className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Sales</p>
                <p className="text-3xl font-extrabold text-slate-900">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl text-orange-600"><Package className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-extrabold text-slate-900">{filteredOrders.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-amber-100 p-4 rounded-xl text-amber-600"><Users className="w-8 h-8" /></div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Customers</p>
                <p className="text-3xl font-extrabold text-slate-900">Manage</p>
              </div>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Daily Sales Activity (Click to filter)</h3>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setDateFilter('')}
                className={`px-5 py-3 rounded-xl border text-left transition-all ${
                  dateFilter === '' ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' : 'border-slate-200 hover:border-rose-300 shadow-sm'
                }`}
              >
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">All Time</p>
                <p className="text-lg font-extrabold text-slate-900">{orders.length} Orders</p>
                <p className="text-xs font-semibold text-slate-400">₹{totalRevenue.toFixed(2)} Total</p>
              </button>
              
              {Object.entries(dailyStats).map(([date, stats]) => (
                <button 
                  key={date}
                  onClick={() => setDateFilter(date)}
                  className={`px-5 py-3 rounded-xl border text-left transition-all min-w-[140px] ${
                    dateFilter === date ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' : 'border-slate-200 hover:border-rose-300 shadow-sm bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">{date}</p>
                  <p className="text-lg font-extrabold text-slate-900">₹{stats.revenue.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-rose-600 bg-rose-100 inline-block px-2 py-0.5 rounded-full mt-1.5">{stats.count} Sales</p>
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {dateFilter ? `Orders for ${dateFilter}` : 'Recent Kitchen Orders'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-sm font-mono font-medium text-slate-500">#{order.id}</td>
                      <td className="p-4 text-sm font-bold text-slate-900">{order.user_name || 'Guest'}</td>
                      <td className="p-4 text-sm text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-bold text-slate-900">₹{Number(order.base_total).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {(order.status === 'Paid' || order.status === 'Pending') && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                          >
                            Mark Served
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-500 font-medium">No kitchen orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-2xl mx-auto">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <PlusCircle className="text-rose-500" />
            <h3 className="text-xl font-bold text-slate-800">Add New Menu Item</h3>
          </div>
          <form onSubmit={handleAddProduct} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Item Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="e.g. Truffle Mushroom Risotto"
                value={productData.name}
                onChange={(e) => setProductData({...productData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Detailed Description</label>
              <textarea 
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="Describe the ingredients and flavor profile..."
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Price (₹)</label>
                <input 
                  required
                  type="number"
                  step="0.01" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="24.99"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Category ID (Optional)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="1 = Appetizers, 2 = Mains..."
                  value={productData.category_id}
                  onChange={(e) => setProductData({...productData, category_id: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2">Image URL</label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="https://example.com/images/pasta.jpg"
                value={productData.image_url}
                onChange={(e) => setProductData({...productData, image_url: e.target.value})}
              />
              <p className="text-xs text-slate-400 mt-2">Paste a high-quality food image URL to make your menu appealing!</p>
            </div>

            <button 
              disabled={addingProduct}
              type="submit" 
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {addingProduct ? 'Adding item...' : 'Add to Menu'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
