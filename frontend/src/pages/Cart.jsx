import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, removeCartItem } from '../redux/slices/cartSlice';
import { Trash2 } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
  const { items, status } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${productId}`, { quantity });
      dispatch(fetchCart());
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your cart</h2>
        <Link to="/login" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition">Login</Link>
      </div>
    );
  }

  if (status === 'loading') return <div className="text-center py-20">Loading cart...</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/products" className="text-red-600 font-medium hover:underline">Continue Shopping</Link>
          </div>
        ) : (
          items.map(item => (
            <div key={item.product_id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-grow">
                <Link to={`/products/${item.product_id}`} className="text-lg font-bold text-gray-800 hover:text-red-600 transition">
                  {item.name}
                </Link>
                <div className="text-red-600 font-bold mt-1">₹{Number(item.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 font-medium text-gray-600">-</button>
                  <span className="px-3 border-x border-gray-300 min-w-[2.5rem] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 font-medium text-gray-600">+</button>
                </div>
                <button 
                  onClick={() => handleRemove(item.product_id)} 
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-xl font-bold text-gray-900 pb-4">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
