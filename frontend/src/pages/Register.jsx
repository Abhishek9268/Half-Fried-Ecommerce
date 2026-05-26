import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Welcome to the family! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12">
      <div className="bg-white rounded-3xl shadow-2xl shadow-red-900/5 flex flex-col md:flex-row-reverse overflow-hidden max-w-5xl w-full border border-stone-100">
        
        {/* Right Side (Image): Brand Imagery */}
        <div className="md:w-5/12 bg-stone-900 relative hidden md:block">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 hover:opacity-50 transition-opacity duration-700"
            style={{ backgroundImage: "url('/hero-indochinese.png')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-end p-12 text-white text-right items-end">
            <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
            <h2 className="text-4xl font-serif mb-4 leading-tight">Join the <br/><span className="text-red-500 italic">Feast</span></h2>
            <p className="text-stone-300 font-light text-sm leading-relaxed max-w-xs">
              Create an account to start ordering the best fiery Indo-Chinese dishes directly to your table or home.
            </p>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 lg:p-20 bg-white flex flex-col justify-center relative">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 border-r-2 border-b-2 border-red-50 w-32 h-32 rounded-br-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h3>
            <p className="text-stone-500 mb-10 text-sm">Become a member in seconds.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 pr-10 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
                {loading ? 'Creating...' : 'Register Now'}
              </button>
            </form>
            
            <div className="mt-10 text-center text-sm text-stone-500">
              Already a member?{' '}
              <Link to="/login" className="text-red-600 font-bold hover:underline transition-all">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
