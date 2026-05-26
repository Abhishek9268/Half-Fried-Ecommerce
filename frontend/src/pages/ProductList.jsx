import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../redux/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products${search ? `?search=${search}` : ''}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch menu items', err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAddToCart = async (e, product_id) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to order');
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { product_id, quantity: 1 });
      dispatch(fetchCart());
      toast.success('Added to order!');
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  return (
    <div className="py-16 min-h-screen relative overflow-hidden bg-white font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-100 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-red-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block inline-flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-[2px] bg-red-500 rounded-full"></span>
              Authentic Fusion
            </span>
            <h2 className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 tracking-tight">Our Masterpieces</h2>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              Indulge in a vibrant selection of fiery Indo-Chinese specialties, prepared fresh to order with our signature wok technique and premium ingredients.
            </p>
          </div>
          
          <div className="w-full md:w-96 group relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none z-20">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <div className="absolute inset-0 bg-red-100 rounded-full opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500"></div>
            <input 
              type="text" 
              placeholder="Search signatures (e.g. Chilli Paneer)..." 
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 shadow-xl rounded-full focus:outline-none focus:border-red-400 focus:bg-white transition-all text-sm text-slate-900 placeholder-slate-400 relative z-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} className="animate-pulse bg-white border border-slate-100 rounded-[2rem] p-5 shadow-lg">
                <div className="w-full h-56 bg-slate-100 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-100 w-3/4 mb-4 rounded-md"></div>
                <div className="h-4 bg-slate-100 w-full mb-2 rounded-md"></div>
                <div className="h-4 bg-slate-100 w-2/3 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] p-5 shadow-xl hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden"
              >
                {/* Image Box */}
                <Link to={`/products/${product.id}`} className="block relative w-full h-56 mb-6 overflow-hidden rounded-2xl bg-slate-100">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-red-900/50 bg-red-50">
                      <span className="text-5xl mb-3 block transform group-hover:rotate-12 transition-transform duration-500">🥢</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-red-400">Half Fried</span>
                    </div>
                  )}
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Quick view badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-red-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    View Details
                  </div>
                </Link>

                {/* Content Box */}
                <div className="flex flex-col flex-grow relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/products/${product.id}`} className="transition-colors flex-grow pr-2">
                      <h3 className="text-2xl font-serif text-slate-900 group-hover:text-red-600 transition-colors leading-tight">{product.name}</h3>
                    </Link>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-1 flex-grow leading-relaxed">
                    {product.description || 'Our signature recipe bursting with authentic Indo-Chinese flavors.'}
                  </p>
                  
                  <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-slate-900">₹{Number(product.price).toFixed(2)}</span>
                    </div>
                    
                    {/* Quick Add Button */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product.id)}
                      className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white shadow-sm hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)] transition-all duration-300 transform group-hover:scale-110 active:scale-95"
                      title="Quick Add to Order"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-40 text-center bg-white rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-red-50 blur-[100px]"></div>
                <span className="text-7xl mb-8 block text-slate-300 relative z-10 animate-bounce cursor-default">🍜</span>
                <h3 className="text-3xl font-serif text-slate-900 mb-4 relative z-10">No masterpieces found</h3>
                <p className="text-slate-500 text-lg max-w-md mx-auto relative z-10">We couldn't find any active menu items matching your search criteria. Please try a different flavor profile.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
