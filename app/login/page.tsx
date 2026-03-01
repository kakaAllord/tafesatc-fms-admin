'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { login } from '../services/api';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login({ username, password });
            if (res.data.success) {
                Cookies.set('token', res.data.body.token);
                Cookies.set('role', res.data.body.role);
                router.push('/dashboard');
            } else {
                setError(res.data.error || 'Invalid credentials. Please try again.');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Connection failed. Please check your internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-900 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="relative p-8 bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto border border-slate-100 mx-4">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-20 h-20 shrink-0 relative bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100">
                        <Image
                            src="/logo-blue.png"
                            alt="TAFES Logo"
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
                        <p className="text-slate-500 mt-2 font-medium">Family Management System</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 animate-head-shake">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2 ml-1 italic opacity-80">Username</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all font-medium placeholder-slate-400"
                                placeholder="Enter admin username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 text-sm font-bold mb-2 ml-1 italic opacity-80">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all font-medium placeholder-slate-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-400 text-sm font-medium italic">
                        © 2026 TAFES ATC
                    </p>
                </div>
            </div>
        </div>
    );
}
