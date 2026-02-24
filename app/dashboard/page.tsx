'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { getFamilies, getUsers } from '../services/api';
import { PlusCircle, Search, ChevronRight, Users, Activity } from 'lucide-react';

export default function Dashboard() {
    const [families, setFamilies] = useState<any[]>([]);
    const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                const res = await getFamilies();
                if (res.data.success) {
                    setFamilies(res.data.body);
                }
            } catch (error) {
                console.error("Failed to fetch families", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFamilies();
    }, []);

    // once families loaded compute member counts
    useEffect(() => {
        if (!families.length) return;
        const loadUsers = async () => {
            try {
                const res = await getUsers();
                if (res.data.success) {
                    const counts: Record<string, number> = {};
                    res.data.body.forEach((u: any) => {
                        const fid = u.familyId || '';
                        counts[fid] = (counts[fid] || 0) + 1;
                    });
                    setMemberCounts(counts);
                }
            } catch (err) {
                console.error('failed to fetch user counts', err);
            }
        };
        loadUsers();
    }, [families]);

    const filteredFamilies = families.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <main>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Family Directory</h1>
                            <p className="text-slate-500 mt-1 font-medium italic opacity-80">Manage your christian union member families</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search families..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
                                />
                            </div>
                            <Link href="/family/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                <PlusCircle size={20} />
                                <span>New Family</span>
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200"></div>
                            ))}
                        </div>
                    ) : filteredFamilies.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="text-slate-200" size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">No families found</h2>
                            <p className="text-slate-400 max-w-sm mx-auto font-medium">Try adjusting your search or add a new family to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFamilies.map((family) => (
                                <Link
                                    key={family._id}
                                    href={`/family/${family._id}`}
                                    className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                                                <Users size={24} />
                                            </div>
                                            {/* member count badge */}
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 italic">
                                                {memberCounts[family._id] || 0} members
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate">{family.name}</h2>
                                        <p className="text-sm font-bold text-slate-400 italic mt-1 opacity-70">@{family.username}</p>

                                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Activity size={14} className="text-blue-500" />
                                                <span>View Details</span>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
