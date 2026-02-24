'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { LogOut, Users, BarChart3, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        router.push('/login');
    };

    const navLinks = [
        { name: 'Families', href: '/dashboard', icon: Users },
        { name: 'Metrics', href: '/metrics', icon: BarChart3 },
    ];

    if (Cookies.get('role') === 'superadmin') {
        navLinks.push({ name: 'Admins', href: '/admins', icon: ShieldCheck });
    }

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center gap-10">
                        <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-white rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
                                <Image
                                    src="/logo-blue.png"
                                    alt="TAFES Logo"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">
                                TAFES <span className="text-blue-400">FMS</span>
                            </span>
                        </Link>

                        <div className="hidden sm:flex sm:space-x-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                    >
                                        <link.icon size={18} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold border border-slate-700 hover:border-red-500/30"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
