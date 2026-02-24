'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getMetrics, getFamilies, getAttendanceRange } from '../services/api';
import { Calendar, Users, BarChart3, TrendingUp, UserCheck, UserX, Search } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function Metrics() {
    const [families, setFamilies] = useState<any[]>([]);
    const [selectedFamily, setSelectedFamily] = useState('');
    // default to today's date range
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ present: 0, absent: 0, count: 0 });

    useEffect(() => {
        getFamilies().then(res => {
            if (res.data.success) setFamilies(res.data.body);
        });
    }, []);

    // fetch available attendance range whenever family filter changes
    useEffect(() => {
        const loadRange = async () => {
            try {
                const res = await getAttendanceRange(selectedFamily || undefined);
                if (res.data.success) {
                    const { minDate: min, maxDate: max } = res.data.body;
                    setMinDate(min);
                    setMaxDate(max);
                    // if today falls outside of the available range, clamp the default dates
                    if (min && (today < min || today > max)) {
                        setStartDate(min);
                        setEndDate(max);
                    }
                }
            } catch (err) {
                console.error('failed to fetch attendance range', err);
            }
        };
        loadRange();
    }, [selectedFamily]);

    const fetchMetricsData = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const res = await getMetrics({
                familyId: selectedFamily || undefined,
                startDate,
                endDate
            });
            if (res.data.success) {
                const data = res.data.body.map((m: any) => ({
                    date: new Date(m._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    present: m.totalPresent,
                    absent: m.totalAbsent,
                    rawDate: m._id
                }));
                setMetrics(data);

                // Calculate summary
                let totalP = 0, totalA = 0;
                data.forEach((d: any) => {
                    totalP += d.present;
                    totalA += d.absent;
                });
                setSummary({ present: totalP, absent: totalA, count: data.length });
            }
        } catch (error) {
            console.error("Failed to fetch metrics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchMetricsData();
        }
    }, [startDate, endDate, selectedFamily]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Analysis</h1>
                        <p className="text-slate-500 mt-1 font-medium italic opacity-80">Monitor family participation patterns</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Family Filter</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    value={selectedFamily}
                                    onChange={(e) => setSelectedFamily(e.target.value)}
                                    className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">All Families</option>
                                    {families.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Date Range</label>
                            <div className="flex items-center gap-2">
                                        <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={minDate || undefined}
                                        max={maxDate || undefined}
                                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <span className="text-slate-300 font-bold">→</span>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={minDate || undefined}
                                        max={maxDate || undefined}
                                        className="pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!startDate || !endDate ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Search className="text-blue-500/40" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Select a date range</h2>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium italic">Please choose the time period you want to analyze for the {selectedFamily ? families.find(f => f._id === selectedFamily)?.name : 'entire community'}.</p>
                    </div>
                ) : loading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200"></div>)}
                        </div>
                        <div className="h-96 bg-white rounded-3xl border border-slate-200"></div>
                    </div>
                ) : metrics.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <BarChart3 className="text-slate-200" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">No activity found</h2>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium italic text-sm">No attendance records were found for the selected family and date range.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                    <UserCheck size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Present</p>
                                    <p className="text-3xl font-black text-slate-800">{summary.present}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                                <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                                    <UserX size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Absent</p>
                                    <p className="text-3xl font-black text-slate-800">{summary.absent}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg. Attendance</p>
                                    <p className="text-3xl font-black text-slate-800">{(summary.present / summary.count).toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Attendance Trend</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Present</div>
                                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200"></div> Absent</div>
                                </div>
                            </div>

                            <div className="h-[450px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '20px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                padding: '16px'
                                            }}
                                            itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#1e293b' }}
                                            labelStyle={{ fontWeight: 900, color: '#3b82f6', marginBottom: '8px', fontSize: '13px' }}
                                            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="present"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorPresent)"
                                            dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }}
                                            name="Present"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* List View */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Daily Breakdown</h3>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase italic tracking-widest">
                                    {metrics.length} Days Recorded
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic">Date</th>
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic">Status</th>
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic text-right font-black">Present Count</th>
                                            <th className="px-8 py-5 font-black text-slate-400 uppercase text-[11px] tracking-widest italic text-right font-black">Absent Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {metrics.map((m, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-4 text-sm font-bold text-slate-700">{new Date(m.rawDate).toDateString()}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${m.present > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                        {m.present > 0 ? 'Active participation' : 'No attendance recorded'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right font-black text-slate-900 text-lg">
                                                    {m.present}
                                                </td>
                                                <td className="px-8 py-4 text-right font-black text-slate-900 text-lg">
                                                    {m.absent}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
