import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
          {!success ? (
            <>
              <h3 className="text-3xl font-bold text-stone-900 mb-2">Reset Password</h3>
              <p className="text-stone-500 mb-8 text-sm leading-relaxed">
                Please enter and confirm your new secure password below to restore your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center">
                    <Lock size={12} className="mr-1.5" /> New Password
                  </label>
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

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center">
                    <Lock size={12} className="mr-1.5" /> Confirm Password
                  </label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-b-2 border-stone-200 bg-transparent px-2 py-3 focus:outline-none focus:border-red-600 transition-colors text-stone-800 placeholder-stone-300"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-red-600/30 disabled:opacity-50 disabled:transform-none mt-8"
                >
                  {loading ? 'Updating password...' : 'Update Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Password Updated!</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                Your password has been successfully reset. You will be redirected to the sign in page shortly.
              </p>
              <Link 
                to="/login"
                className="inline-flex items-center text-sm text-red-600 font-bold hover:underline transition-colors"
              >
                <ArrowLeft size={16} className="mr-1.5" /> Go to Login now
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
