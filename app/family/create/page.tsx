'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { createFamily } from '../../services/api';
import { useRouter } from 'next/navigation';
import { UserPlus, ChevronRight, Save, Key, UserCheck, AlertCircle } from 'lucide-react';

export default function CreateFamily() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await createFamily({ name, username, password });
            if (res.data.success) {
                router.push('/dashboard');
            } else {
                setError(res.data.error || 'Failed to initialize family entity');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Connectivity failure during initialization');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-12">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Family Onboarding</h1>
                        <p className="text-slate-500 font-bold italic text-sm mt-1 uppercase tracking-widest opacity-80 flex items-center gap-2">
                            <span>Core Directory</span>
                            <ChevronRight size={14} className="text-slate-300" />
                            <span className="text-blue-600">New Unit Initialization</span>
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-head-shake shadow-sm">
                        <AlertCircle size={20} />
                        <p className="font-bold text-sm italic">{error}</p>
                    </div>
                )}

                <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-full -mr-24 -mt-24 opacity-60"></div>

                    <form onSubmit={handleSubmit} className="p-10 relative z-10 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Entity Descriptive Name</label>
                                <div className="relative">
                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:font-normal placeholder:opacity-40"
                                        placeholder="Enter Family name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Archive Username (Identity)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:font-normal placeholder:opacity-40"
                                        placeholder="ndikum_fam26"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Access Pass-Key (Secure)</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:font-normal placeholder:opacity-40"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                            <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed max-w-[200px]">
                                Once initialized, this entity will have immediate access to the mobile interface.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center gap-3 uppercase tracking-widest text-sm italic"
                            >
                                {loading ? 'Initializing...' : (
                                    <>
                                        <Save size={20} />
                                        Commit Record
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] italic transition-colors"
                    >
                        ← Cancel and Abort
                    </button>
                </div>
            </div>
        </div>
    );
}
