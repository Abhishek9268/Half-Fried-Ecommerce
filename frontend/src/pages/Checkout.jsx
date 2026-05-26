import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../redux/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { QrCode, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { items, user } = useSelector(state => ({ ...state.cart, ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Convert to INR explicitly to avoid confusion visually, assuming the app is Indian
  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  const upiId = '9555299933-2@ybl';
  const payeeName = 'Abhishek';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${subtotal.toFixed(2)}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // 1. Create order in our DB (This also clears the cart backend-side)
      const orderPayload = {
        items: items.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.price })),
        baseTotal: subtotal
      };
      
      await api.post('/orders', orderPayload);
      
      toast.success('Order placed successfully! Pending payment verification.');
      dispatch(fetchCart()); // clear local cart state
      navigate('/orders');
      
    } catch (err) {
      toast.error('Failed to create order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="text-center py-20 text-gray-600">Your cart is empty.</div>;
  }

  if (showQR) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Scan to Pay</h2>
        <p className="text-gray-500">Open GPay, PhonePe, or Paytm and scan the QR below</p>
        
        <div className="flex justify-center bg-gray-50 py-6 rounded-xl border border-gray-200">
          <img src={qrCodeUrl} alt="UPI QR Code" className="w-64 h-64 object-contain shadow-sm border border-gray-200 bg-white p-2 rounded-lg" />
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-bold text-gray-900">Amount: ₹ {subtotal.toFixed(2)}</p>
          <p className="text-sm font-mono text-gray-500">UPI ID: {upiId}</p>
        </div>

        <button 
          onClick={handleConfirmPayment}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              I have paid ₹ {subtotal.toFixed(2)}
            </>
          )}
        </button>
        <button 
          onClick={() => setShowQR(false)}
          className="w-full text-gray-500 hover:text-gray-900 underline text-sm transition"
        >
          Cancel and go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Checkout Details</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-700">Shipping To:</p>
            <p className="text-gray-900 font-bold">{user?.name}</p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4 border-b pb-4">
          {items.map(item => (
            <div key={item.product_id} className="flex justify-between text-sm text-gray-600">
              <span className="truncate w-40">{item.name} x {item.quantity}</span>
              <span>₹ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-xl mb-6">
          <span>Total</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => setShowQR(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition"
        >
          <QrCode className="w-6 h-6" />
          Pay via UPI
        </button>
      </div>
    </div>
  );
};

export default Checkout;
