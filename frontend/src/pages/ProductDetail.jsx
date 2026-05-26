import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(addToCart({ product_id: product.id, quantity })).unwrap();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/2 h-96 md:h-auto bg-gray-100 flex items-center justify-center p-8">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
        <div>
          <span className="text-sm text-indigo-600 font-semibold tracking-wider uppercase">{product.category_name || 'Uncategorized'}</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
        <div className="text-3xl font-bold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold disabled:opacity-50"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300 font-medium w-12 text-center">{quantity}</span>
            <button 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button 
            className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
