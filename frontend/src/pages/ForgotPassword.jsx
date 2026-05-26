import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, AlertCircle, Sparkles } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToken('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setToken(res.data.token);
      setSuccess(true);
      toast.success('Reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-2xl shadow-red-900/5 max-w-md w-full border border-stone-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Visual Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[100px] -z-0 opacity-40 pointer-events-none"></div>

        <div className="relative z-10">
          <Link 
            to="/login" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-red-600 transition-colors mb-8"
          >
            <ArrowLeft size={14} className="mr-2" /> Back to Sign In
          </Link>

          {!success ? (
            <>
              <h3 className="text-3xl font-bold text-stone-900 mb-2">Forgot Password?</h3>
              <p className="text-stone-500 mb-8 text-sm leading-relaxed">
                Enter your email address below, and we'll generate a secure reset link to restore your access.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center">
                    <Mail size={12} className="mr-1.5" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:transform-none mt-8"
                >
                  {loading ? 'Generating link...' : 'Send Reset Instructions'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Link Generated!</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                We've simulated sending a reset email. For local testing, use the developer toolbox below.
              </p>

              {token && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 text-left mb-8">
                  <h4 className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-2 flex items-center">
                    <AlertCircle size={14} className="mr-1.5" /> Developer Sandbox Tool
                  </h4>
                  <p className="text-xs text-amber-700 mb-4 leading-relaxed">
                    Click the link below to access the secure password reset screen directly:
                  </p>
                  <Link 
                    to={`/reset-password/${token}`}
                    className="block w-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-center font-bold py-3 px-4 rounded-xl text-xs transition-all border border-amber-300/50 truncate"
                  >
                    Reset Password Now
                  </Link>
                </div>
              )}

              <button 
                onClick={() => { setSuccess(false); setEmail(''); setToken(''); }}
                className="text-stone-500 hover:text-red-600 text-sm font-bold transition-colors"
              >
                Request another link
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
