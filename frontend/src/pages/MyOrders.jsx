import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { Package } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/orders' : '/orders/myorders';
        const res = await api.get(endpoint);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [user]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your orders...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">{order.id}</span></p>
                <p className="text-sm text-gray-500">Placed On: <span className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span></p>
                <p className="text-xl font-bold text-gray-900 mt-2">${Number(order.base_total).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
                {order.razorpay_order_id && (
                  <p className="text-xs text-gray-400 mt-2 font-mono">Ref: {order.razorpay_order_id.substring(0, 15)}...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
