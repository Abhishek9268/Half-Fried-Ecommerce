import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(setCredentials({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      }));
      toast.success('Welcome back to Half Fried!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12">
      <div className="bg-white rounded-3xl shadow-2xl shadow-red-900/5 flex flex-col md:flex-row overflow-hidden max-w-5xl w-full border border-stone-100">
        
        {/* Left Side: Brand Imagery */}
        <div className="md:w-5/12 bg-stone-900 relative hidden md:block">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 hover:opacity-50 transition-opacity duration-700"
            style={{ backgroundImage: "url('/hero-indochinese.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white">
            <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
            <h2 className="text-4xl font-serif mb-4 leading-tight">Return to <br/><span className="text-red-500 italic">Flavor</span></h2>
            <p className="text-stone-300 font-light text-sm leading-relaxed max-w-xs">
              Log in to track your favorite Indo-Chinese orders and experience lightning-fast checkouts.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-20 bg-white flex flex-col justify-center relative">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="text-8xl font-serif text-red-900">HF</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-stone-900 mb-2">Welcome Back</h3>
            <p className="text-stone-500 mb-10 text-sm">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
                  <Link to="/forgot-password" className="text-xs text-red-600 font-medium hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 pr-10 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:transform-none mt-8"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-10 text-center text-sm text-stone-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 font-bold hover:underline transition-all">
                Create one now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
