import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#fbfcfd] font-sans selection:bg-supabase-brand/30">
            <Head title="Sign In - SIPS" />

            <div className="w-full max-w-[400px] px-6">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-supabase-brand w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(62,207,142,0.4)] mb-6">
                        <Mail className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
                    <p className="text-sm text-slate-500 mt-2">Masuk ke Sistem Penomoran Surat</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    {status && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start text-sm font-medium text-emerald-800">
                            <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700" htmlFor="email">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-supabase-brand focus:ring-supabase-brand'} rounded-xl text-sm transition-all`}
                                    placeholder="admin@sips.com"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[13px] font-semibold text-slate-700" htmlFor="password">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[12px] font-medium text-supabase-brand hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:border-supabase-brand focus:ring-supabase-brand'} rounded-xl text-sm transition-all`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center pt-2">
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 text-supabase-brand border-slate-300 rounded focus:ring-supabase-brand"
                            />
                            <label htmlFor="remember" className="ml-2 block text-[13px] text-slate-600">
                                Ingat saya
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-supabase-brand hover:bg-supabase-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-supabase-brand disabled:opacity-50 transition-all"
                            >
                                {processing ? 'Memproses...' : 'Sign In'}
                                {!processing && <ArrowRight className="w-4 h-4 ml-2" />}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center text-[13px] text-slate-500">
                    &copy; {new Date().getFullYear()} Dewan Komisaris. All rights reserved.
                </div>
            </div>
        </div>
    );
}
