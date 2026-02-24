'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAdmins, createAdmin, deleteAdmin } from '../services/api';
import { Trash2, ShieldCheck, UserPlus, ShieldAlert, Key, UserIcon, CheckCircle2 } from 'lucide-react';

export default function ManageAdmins() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchAdmins = async () => {
        try {
            const res = await getAdmins();
            if (res.data.success) {
                setAdmins(res.data.body);
            }
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsCreating(true);
        try {
            const res = await createAdmin({ username, password });
            if (res.data.success) {
                setSuccess(`${username} authorized successfully`);
                setUsername('');
                setPassword('');
                fetchAdmins();
            } else {
                setError(res.data.error || "Authorization failed");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Authorization failed");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Revoke access for ${name}? This action is permanent.`)) return;
        try {
            const res = await deleteAdmin(id);
            if (res.data.success) {
                fetchAdmins();
            } else {
                alert(res.data.error || "Operation failed");
            }
        } catch (err: any) {
            alert(err.response?.data?.error || "Operation failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 shrink-0 border border-slate-800">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Security Center</h1>
                        <p className="text-slate-500 font-bold italic text-sm mt-1 uppercase tracking-widest opacity-80">
                            Coordinate Administrative Access Levels
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-head-shake">
                        <ShieldAlert size={20} />
                        <p className="font-bold text-sm italic">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-blue-50 border border-blue-100 text-blue-600 p-4 rounded-2xl mb-8 flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <p className="font-bold text-sm italic">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Access Creation */}
                    <div className="lg:col-span-1 border-r-0 lg:border-r border-slate-200 lg:pr-10 h-fit">
                        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden mb-8">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <UserPlus size={18} className="text-slate-400" />
                                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">New Security Entity</h2>
                            </div>
                            <form onSubmit={handleCreate} className="p-8 space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Universal Identifier</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:font-normal placeholder:opacity-40" placeholder="e.g. system_admin" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Access Protocol (Pass)</label>
                                        <div className="relative">
                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:font-normal placeholder:opacity-40" placeholder="••••••••••••" required />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={isCreating} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-6 text-xs uppercase tracking-widest italic">
                                    {isCreating ? 'Authorizing...' : 'Expand Control Group'}
                                </button>
                            </form>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] italic opacity-40 mb-3">Security Advisory</p>
                            <p className="text-sm font-bold opacity-90 leading-relaxed italic pr-4 italic">
                                Administrative credentials grant full override capabilities. Revoke access immediately if an entity is compromised.
                            </p>
                        </div>
                    </div>

                    {/* Registry List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">Authorized Registry</h3>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest border border-slate-200">
                                    {admins.length} Units Active
                                </span>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center animate-pulse text-slate-400 font-bold italic">Gathering personnel data...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/30">
                                            <tr>
                                                <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic">Identifier</th>
                                                <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic">Clearance</th>
                                                <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic text-right">Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {admins.map(admin => (
                                                <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-200">
                                                                <UserIcon size={14} />
                                                            </div>
                                                            <span className="font-black text-slate-800 tracking-tight">{admin.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border italic ${admin.role === 'superadmin'
                                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {admin.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button
                                                            onClick={() => handleDelete(admin._id, admin.username)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {admins.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-bold italic opacity-60">
                                                        No additional authorized personnel localized.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
