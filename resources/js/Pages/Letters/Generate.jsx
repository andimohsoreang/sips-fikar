import React, { useState } from 'react';
import SupabaseLayout from '@/Layouts/SupabaseLayout';
import { Head } from '@inertiajs/react';
import {
    FileText, Calendar, Hash, Paperclip, Shield, AlignLeft,
    Users, Clock, MapPin, ClipboardList, Shirt, UserCheck,
    Plus, Trash2, Printer, Download, ChevronRight, ArrowLeft
} from 'lucide-react';
import { router } from '@inertiajs/react';

// ────────────────────────────────────────────────
// Helper
// ────────────────────────────────────────────────
function toIndonesianDate(dateStr) {
    if (!dateStr) return '';
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, color = 'supabase' }) {
    const colors = {
        supabase: 'bg-supabase-brand/10 text-supabase-brand border-supabase-brand/20',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        slate: 'bg-slate-50 text-slate-600 border-slate-200',
    };
    return (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${colors[color]} mb-5`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}

function FormField({ label, required, error, children, hint }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {label} {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-[10px] text-slate-400">{hint}</p>}
            {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
        </div>
    );
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand outline-none 
                transition-all placeholder:text-slate-400 ${className}`}
        />
    );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand outline-none 
                transition-all resize-none placeholder:text-slate-400"
        />
    );
}

function Select({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand outline-none 
                transition-all cursor-pointer"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function Generate({ auth, letter }) {
    const letterDate = letter.letter_date ? toIndonesianDate(letter.letter_date) : '';

    const [form, setForm] = useState({
        tanggal: letterDate,
        nomor: letter.full_number || '',
        lampiran: '-',
        klasifikasi: 'Terbatas',
        perihal: letter.subject || '',
        kepada: letter.recipient || '',
        hari_tanggal: '',
        waktu: '10:00 WIB sampai dengan Selesai',
        tempat: '',
        agenda: '',
        dresscode: 'Batik',
        nama_penandatangan: '',
        jabatan_penandatangan: 'Komisaris Utama',
        tembusan: ['', ''],
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitAction, setSubmitAction] = useState('print');

    const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const setTembusan = (idx, value) => {
        const updated = [...form.tembusan];
        updated[idx] = value;
        setForm(prev => ({ ...prev, tembusan: updated }));
    };

    const addTembusan = () => setForm(prev => ({ ...prev, tembusan: [...prev.tembusan, ''] }));

    const removeTembusan = (idx) => {
        const updated = form.tembusan.filter((_, i) => i !== idx);
        setForm(prev => ({ ...prev, tembusan: updated }));
    };

    const validate = () => {
        const e = {};
        if (!form.tanggal) e.tanggal = 'Tanggal wajib diisi';
        if (!form.nomor) e.nomor = 'Nomor surat wajib diisi';
        if (!form.klasifikasi) e.klasifikasi = 'Klasifikasi wajib diisi';
        if (!form.perihal) e.perihal = 'Perihal wajib diisi';
        if (!form.kepada) e.kepada = 'Kepada wajib diisi';
        if (!form.hari_tanggal) e.hari_tanggal = 'Hari dan tanggal rapat wajib diisi';
        if (!form.waktu) e.waktu = 'Waktu rapat wajib diisi';
        if (!form.tempat) e.tempat = 'Tempat rapat wajib diisi';
        if (!form.agenda) e.agenda = 'Agenda rapat wajib diisi';
        if (!form.nama_penandatangan) e.nama_penandatangan = 'Nama penandatangan wajib diisi';
        if (!form.jabatan_penandatangan) e.jabatan_penandatangan = 'Jabatan penandatangan wajib diisi';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (action) => {
        if (!validate()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setIsSubmitting(true);
        setSubmitAction(action);

        const routeName = action === 'export' ? 'letters.export' : 'letters.print';

        // For print: open in new tab; for export: direct download
        const form_data = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                v.forEach((item, i) => form_data.append(`${k}[${i}]`, item));
            } else {
                form_data.append(k, v);
            }
        });

        // Submit form via standard POST to get the view / PDF response
        const frm = document.createElement('form');
        frm.method = 'POST';
        frm.action = route(routeName, letter.id);
        frm.target = action === 'print' ? '_blank' : '_self';

        // CSRF
        const csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_token';
        csrf.value = document.querySelector('meta[name="csrf-token"]')?.content || '';
        frm.appendChild(csrf);

        // Fields
        Object.entries(form).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                v.forEach((item, i) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `${k}[${i}]`;
                    input.value = item;
                    frm.appendChild(input);
                });
            } else {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = k;
                input.value = v;
                frm.appendChild(input);
            }
        });

        document.body.appendChild(frm);
        frm.submit();
        document.body.removeChild(frm);

        setTimeout(() => setIsSubmitting(false), 1500);
    };

    const klasifikasiOptions = [
        { value: 'Terbatas', label: 'Terbatas' },
        { value: 'Umum', label: 'Umum' },
        { value: 'Rahasia', label: 'Rahasia' },
        { value: 'Sangat Rahasia', label: 'Sangat Rahasia' },
    ];

    return (
        <SupabaseLayout user={auth.user} header="Generate Surat">
            <Head title="Generate Surat" />

            <div className="max-w-3xl mx-auto space-y-8">
                {/* ── Page Header ── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a
                            href={route('letters.index')}
                            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </a>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Generate Surat Undangan Rapat</h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Isi formulir di bawah untuk mencetak atau mengekspor surat.
                            </p>
                        </div>
                    </div>

                    {/* Surat metadata badge */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-supabase-brand/10 text-supabase-brand rounded-xl text-xs font-bold uppercase tracking-widest border border-supabase-brand/20">
                        <FileText className="w-3.5 h-3.5" />
                        {letter.full_number}
                    </div>
                </div>

                {/* Error banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                        <p className="text-sm font-bold text-red-700 mb-1">⚠️ Harap lengkapi field yang diperlukan:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {Object.values(errors).map((e, i) => (
                                <li key={i} className="text-xs text-red-600">{e}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ── Section 1: Header Surat ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                    <SectionHeader icon={FileText} label="Header Surat" color="slate" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Tanggal Surat" required error={errors.tanggal} hint="Format: 26 Januari 2026">
                            <Input
                                value={form.tanggal}
                                onChange={e => set('tanggal', e.target.value)}
                                placeholder="Contoh: 26 Januari 2026"
                            />
                        </FormField>

                        <FormField label="Nomor Surat" required error={errors.nomor}>
                            <Input
                                value={form.nomor}
                                onChange={e => set('nomor', e.target.value)}
                                placeholder="Contoh: SRT/UND/KR-26-01-1"
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Lampiran">
                            <Input
                                value={form.lampiran}
                                onChange={e => set('lampiran', e.target.value)}
                                placeholder="Contoh: - atau 1 (satu) lembar"
                            />
                        </FormField>

                        <FormField label="Klasifikasi" required error={errors.klasifikasi}>
                            <Select
                                value={form.klasifikasi}
                                onChange={e => set('klasifikasi', e.target.value)}
                                options={klasifikasiOptions}
                            />
                        </FormField>
                    </div>

                    <FormField label="Perihal" required error={errors.perihal}>
                        <Input
                            value={form.perihal}
                            onChange={e => set('perihal', e.target.value)}
                            placeholder="Contoh: Undangan Rapat Bulanan Dewan Komisaris dengan Direksi"
                        />
                    </FormField>

                    <FormField label="Kepada Yth." required error={errors.kepada}>
                        <Textarea
                            value={form.kepada}
                            onChange={e => set('kepada', e.target.value)}
                            placeholder="Contoh: Direksi PT Reska Multi Usaha"
                            rows={2}
                        />
                    </FormField>
                </div>

                {/* ── Section 2: Detail Rapat ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                    <SectionHeader icon={Calendar} label="Detail Rapat" color="supabase" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Hari dan Tanggal" required error={errors.hari_tanggal} hint="Format: Selasa, 27 Januari 2026">
                            <Input
                                value={form.hari_tanggal}
                                onChange={e => set('hari_tanggal', e.target.value)}
                                placeholder="Contoh: Selasa, 27 Januari 2026"
                            />
                        </FormField>

                        <FormField label="Waktu" required error={errors.waktu}>
                            <Input
                                value={form.waktu}
                                onChange={e => set('waktu', e.target.value)}
                                placeholder="Contoh: 10:00 WIB sampai dengan Selesai"
                            />
                        </FormField>
                    </div>

                    <FormField label="Tempat" required error={errors.tempat}>
                        <Textarea
                            value={form.tempat}
                            onChange={e => set('tempat', e.target.value)}
                            placeholder="Contoh: Ruang Rapat Utama Kantor Pusat PT Reska Multi Usaha"
                            rows={2}
                        />
                    </FormField>

                    <FormField label="Agenda" required error={errors.agenda}>
                        <Textarea
                            value={form.agenda}
                            onChange={e => set('agenda', e.target.value)}
                            placeholder="Contoh: Laporan Kinerja Nataru, Program RKAP/RKAO Tahun 2026"
                            rows={3}
                        />
                    </FormField>

                    <FormField label="Dresscode">
                        <Input
                            value={form.dresscode}
                            onChange={e => set('dresscode', e.target.value)}
                            placeholder="Contoh: Batik, Business Formal"
                        />
                    </FormField>
                </div>

                {/* ── Section 3: Penandatangan ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                    <SectionHeader icon={UserCheck} label="Penandatangan" color="indigo" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField label="Nama Penandatangan" required error={errors.nama_penandatangan}>
                            <Input
                                value={form.nama_penandatangan}
                                onChange={e => set('nama_penandatangan', e.target.value)}
                                placeholder="Contoh: REVIANDI"
                            />
                        </FormField>

                        <FormField label="Jabatan Penandatangan" required error={errors.jabatan_penandatangan}>
                            <Input
                                value={form.jabatan_penandatangan}
                                onChange={e => set('jabatan_penandatangan', e.target.value)}
                                placeholder="Contoh: Komisaris Utama"
                            />
                        </FormField>
                    </div>
                </div>

                {/* ── Section 4: Tembusan ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                    <SectionHeader icon={Users} label="Tembusan (Opsional)" color="slate" />

                    <div className="space-y-3">
                        {form.tembusan.map((t, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 w-5 text-right flex-shrink-0">{i + 1}.</span>
                                <Input
                                    value={t}
                                    onChange={e => setTembusan(i, e.target.value)}
                                    placeholder={`Contoh: Vice President Corporate Secretary`}
                                />
                                {form.tembusan.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTembusan(i)}
                                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addTembusan}
                        className="flex items-center gap-2 text-xs font-bold text-supabase-brand hover:text-supabase-brand-hover transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Tembusan
                    </button>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-8">
                    <a
                        href={route('letters.index')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </a>

                    <button
                        type="button"
                        onClick={() => handleSubmit('export')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-2xl hover:bg-indigo-100 transition-all disabled:opacity-60"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSubmit('print')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-supabase-brand rounded-2xl hover:bg-supabase-brand-hover transition-all shadow-md shadow-supabase-brand/30 disabled:opacity-60"
                    >
                        <Printer className="w-4 h-4" />
                        {isSubmitting ? 'Mempersiapkan...' : 'Preview & Cetak'}
                    </button>
                </div>
            </div>
        </SupabaseLayout>
    );
}
