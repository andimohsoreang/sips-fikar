import React, { Fragment } from 'react';
import { X } from 'lucide-react';

export default function SupabaseModal({ 
    show, 
    onClose, 
    title, 
    children, 
    maxWidth = 'md' 
}) {
    if (!show) return null;

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all w-full ${maxWidthClass} relative z-10`}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function SupabaseDeleteModal({ show, onClose, onConfirm, title, message, processing }) {
    return (
        <SupabaseModal show={show} onClose={onClose} title={title} maxWidth="sm">
            <div className="space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
                
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {processing ? 'Menghapus...' : 'Hapus Data'}
                    </button>
                </div>
            </div>
        </SupabaseModal>
    );
}
