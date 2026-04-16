import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Sparkles, Activity, Layers } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-nordic-bg flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-nordic-mint/20 rounded-full blur-[120px] pointer-events-none animate-ring-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-nordic-teal/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] h-auto min-h-[600px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 flex m-4 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Branding & Art (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-nordic-navy via-[#1e3c4a] to-nordic-teal relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-nordic-mint/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/3"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Curator <span className="text-nordic-mint">.</span>
            </h1>
            <p className="mt-4 text-nordic-mint/80 font-medium text-lg leading-relaxed max-w-sm">
              Your intelligent productivity engine. Master your focus, organize your thoughts, and conquer your day.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <Sparkles size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">AI-Powered Insights</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <Layers size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">Smart Task Decomposition</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <Activity size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">Real-time Analytics</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-[380px] w-full mx-auto">
            
            <div className="lg:hidden text-center mb-10">
               <h1 className="text-3xl font-black text-nordic-navy tracking-tight">
                Curator<span className="text-nordic-mint">.</span>
              </h1>
              <p className="mt-2 text-sm text-nordic-muted font-medium">Your productivity engine.</p>
            </div>

            <h2 className="text-3xl font-black text-nordic-navy mb-2">Welcome back</h2>
            <p className="text-nordic-muted font-medium text-sm mb-8">Enter your details to access your dashboard.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-600 text-sm font-semibold animate-in slide-in-from-right-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-nordic-navy uppercase tracking-wider ml-1 relative z-10 transition-colors"
                  style={{ color: focusedInput === 'email' ? 'var(--color-nordic-teal)' : 'var(--color-nordic-navy)' }}
                >
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 rounded-xl overflow-hidden ${focusedInput === 'email' ? 'ring-4 ring-nordic-mint/20 shadow-lg' : 'shadow-sm'}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedInput === 'email' ? 'text-nordic-teal' : 'text-slate-400'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-sm font-semibold text-nordic-navy placeholder:text-slate-400 placeholder:font-medium focus:bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-nordic-navy uppercase tracking-wider ml-1 relative z-10 transition-colors"
                  style={{ color: focusedInput === 'password' ? 'var(--color-nordic-teal)' : 'var(--color-nordic-navy)' }}
                >
                  Password
                </label>
                <div className={`relative transition-all duration-300 rounded-xl overflow-hidden ${focusedInput === 'password' ? 'ring-4 ring-nordic-mint/20 shadow-lg' : 'shadow-sm'}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedInput === 'password' ? 'text-nordic-teal' : 'text-slate-400'}`}>
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-sm font-semibold text-nordic-navy placeholder:text-slate-400 placeholder:tracking-widest focus:bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                     <span className="text-xs font-bold text-nordic-mint hover:text-nordic-teal cursor-pointer transition-colors">Forgot?</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-2 bg-nordic-navy text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-4 overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? 'Authenticating...' : 'Sign In'} 
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />}
                </span>
              </button>
            </form>
            
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-semibold text-nordic-muted">
                New to Curator?{' '}
                <Link to="/register" className="text-nordic-teal font-bold hover:text-nordic-navy transition-colors pb-0.5 border-b-2 border-nordic-mint/30 hover:border-nordic-mint">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
