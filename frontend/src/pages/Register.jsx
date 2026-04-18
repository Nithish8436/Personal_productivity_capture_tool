import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, User as UserIcon, CheckCircle2, CloudLightning, ShieldCheck, Phone as PhoneIcon } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password, phone);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-nordic-bg flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-nordic-teal/20 rounded-full blur-[120px] pointer-events-none animate-ring-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-5%] w-[40%] h-[40%] bg-nordic-mint/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] h-auto min-h-[600px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 flex flex-row-reverse m-4 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Right Side: Branding & Art (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-bl from-nordic-navy via-[#1e3c4a] to-[#24525d] relative overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-nordic-teal/20 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Curator <span className="text-nordic-mint">.</span>
            </h1>
            <p className="mt-4 text-nordic-mint/80 font-medium text-lg leading-relaxed max-w-sm">
              Join the elite circle of hyper-productive individuals. Start mapping your success today.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <CloudLightning size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">Lightning Fast Sync</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <CheckCircle2 size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">Track Every Milestone</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-inner">
                <ShieldCheck size={20} className="text-nordic-mint" />
              </div>
              <p className="text-sm font-semibold">Bank-grade Security</p>
            </div>
          </div>
        </div>

        {/* Left Side: Register Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-[380px] w-full mx-auto">
            
            <div className="lg:hidden text-center mb-10">
               <h1 className="text-3xl font-black text-nordic-navy tracking-tight">
                Curator<span className="text-nordic-mint">.</span>
              </h1>
              <p className="mt-2 text-sm text-nordic-muted font-medium">Your productivity engine.</p>
            </div>

            <h2 className="text-3xl font-black text-nordic-navy mb-2">Create Account</h2>
            <p className="text-nordic-muted font-medium text-sm mb-8">Set up your profile to start organizing.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-600 text-sm font-semibold animate-in slide-in-from-right-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-nordic-navy uppercase tracking-wider ml-1 relative z-10 transition-colors"
                  style={{ color: focusedInput === 'name' ? 'var(--color-nordic-teal)' : 'var(--color-nordic-navy)' }}
                >
                  Full Name
                </label>
                <div className={`relative transition-all duration-300 rounded-xl overflow-hidden ${focusedInput === 'name' ? 'ring-4 ring-nordic-mint/20 shadow-lg' : 'shadow-sm'}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedInput === 'name' ? 'text-nordic-teal' : 'text-slate-400'}`}>
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-sm font-semibold text-nordic-navy placeholder:text-slate-400 placeholder:font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* Email Input */}
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

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-nordic-navy uppercase tracking-wider ml-1 relative z-10 transition-colors"
                  style={{ color: focusedInput === 'phone' ? 'var(--color-nordic-teal)' : 'var(--color-nordic-navy)' }}
                >
                  Phone Number
                </label>
                <div className={`relative transition-all duration-300 rounded-xl overflow-hidden ${focusedInput === 'phone' ? 'ring-4 ring-nordic-mint/20 shadow-lg' : 'shadow-sm'}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${focusedInput === 'phone' ? 'text-nordic-teal' : 'text-slate-400'}`}>
                    <PhoneIcon size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedInput('phone')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="+1234567890"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all text-sm font-semibold text-nordic-navy placeholder:text-slate-400 placeholder:font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
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
                </div>
                <p className="text-[0.65rem] font-medium text-slate-400 ml-1 mt-1">Must be at least 6 characters long.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-2 bg-nordic-navy text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-6 overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? 'Setting up...' : 'Create Account'} 
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />}
                </span>
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-semibold text-nordic-muted">
                Already part of the network?{' '}
                <Link to="/login" className="text-nordic-teal font-bold hover:text-nordic-navy transition-colors pb-0.5 border-b-2 border-nordic-mint/30 hover:border-nordic-mint">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
