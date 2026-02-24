'use client';
import { useEffect, useState, use } from 'react';
import Navbar from '../../components/Navbar';
import { getFamily, updateFamily, addUser, getUsers, getCourses } from '../../services/api';
import { useRouter } from 'next/navigation';
import {
    UserPlus,
    Settings,
    Users as UsersIcon,
    Save,
    GraduationCap,
    ChevronRight,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

export default function FamilyDetails({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [family, setFamily] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Family State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Add Parent State
    const [parentName, setParentName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [level, setLevel] = useState('4');
    const [isParent, setIsParent] = useState(true); // toggle for parent/child

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [famRes, memRes, courseRes] = await Promise.all([
                    getFamily(id),
                    getUsers(id),
                    getCourses()
                ]);

                if (famRes.data.success) {
                    setFamily(famRes.data.body);
                    setName(famRes.data.body.name);
                    setUsername(famRes.data.body.username);
                }
                if (memRes.data.success) setMembers(memRes.data.body);
                if (courseRes.data.success) setCourses(courseRes.data.body);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdateFamily = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsUpdating(true);
        try {
            const res = await updateFamily(id, { name, username, password: password || undefined });
            if (res.data.success) {
                setSuccess("Family profile updated successfully");
                setPassword('');
            } else {
                setError(res.data.error || "Update failed");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddParent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsAdding(true);
        try {
            // use generic addUser so we can pass isParent flag
            const res = await addUser({
                name: parentName,
                courseId,
                level,
                familyId: id,
                isParent
            });
            if (res.data.success) {
                setSuccess(`${parentName} added to family!`);
                setParentName('');
                setIsParent(true);
                const memRes = await getUsers(id);
                if (memRes.data.success) setMembers(memRes.data.body);
            } else {
                setError(res.data.error || "Failed to add member");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add member");
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-20 text-center animate-pulse text-slate-400 font-bold italic">
                Gathering family intelligence...
            </div>
        </div>
    );

    if (!family) return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-20 text-center text-slate-500 font-bold italic">
                Family not found in archives.
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-10 overflow-hidden">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
                        <UsersIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{family.name}</h1>
                        <p className="text-slate-400 font-bold italic text-sm mt-1 uppercase tracking-widest opacity-70 flex items-center gap-2">
                            <ChevronRight size={14} className="text-slate-300" />
                            <span>@{family.username}</span>
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-head-shake shadow-sm">
                        <AlertCircle size={20} />
                        <p className="font-bold text-sm italic">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm">
                        <CheckCircle2 size={20} />
                        <p className="font-bold text-sm italic">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Settings Panel */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <Settings size={20} className="text-slate-400" />
                                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">Family Settings</h2>
                            </div>
                            <form onSubmit={handleUpdateFamily} className="p-8 space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Family Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:font-normal" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username (Login)</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:font-normal" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Encryption Key (Password)</label>
                                    <input type="password" value={password} placeholder="••••••••••••" onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-blue-500/10" />
                                    <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Leave blank to keep current password</p>
                                </div>
                                <button type="submit" disabled={isUpdating} className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-widest italic">
                                    {isUpdating ? 'Synchronizing...' : (
                                        <>
                                            <Save size={18} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Member Management */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Add Parent Section */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden p-8 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8 flex items-center gap-3">
                                    <UserPlus className="text-emerald-500" size={28} />
                                    Add new member
                                </h2>

                                <form onSubmit={handleAddParent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* type toggle */}
                                    <div className="md:col-span-2 flex items-center gap-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity type</label>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setIsParent(true)} className={`px-3 py-1 rounded-full text-sm font-semibold ${isParent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                                Parent
                                            </button>
                                            <button type="button" onClick={() => setIsParent(false)} className={`px-3 py-1 rounded-full text-sm font-semibold ${!isParent ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                                Child
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Member's Name</label>
                                        <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500/10" placeholder="Enter member's name" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Course</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700" required>
                                                <option value="">Choose Course</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Academic Level</label>
                                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700" required>
                                            {["4", "5", "6", "7_1", "7_2", "8"].map(l => <option key={l} value={l}>Level {l.replace('_', '.')}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 mt-4 text-right">
                                        <button type="submit" disabled={isAdding} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] uppercase tracking-widest italic text-xs mb-0">
                                            {isAdding ? 'Adding Entity...' : 'Add Member'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">Member Hierarchy</h3>
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase italic tracking-wider">
                                    {members.length} Members in Total
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic">Entity Name</th>
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic text-center">Designation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {members.map(member => (
                                            <tr key={member._id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{member.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                                                        Level {member.level?.replace('_', '.')} • {member.courseId?.name || 'Unassigned'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl italic ${member.isParent ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {member.isParent ? 'Parent' : 'Child'}
                                                    </span>
                                                </td>
                                                
                                            </tr>
                                        ))}
                                        {members.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-bold italic opacity-60">
                                                    Zero members in this family.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
