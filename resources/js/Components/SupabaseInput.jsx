import { useState } from 'react';

export default function SupabaseInput({ label, type = 'text', value, onChange, placeholder, error, required = false, ...props }) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`bg-white border ${error ? 'border-red-400' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand block w-full p-3 outline-none transition-all placeholder:text-slate-300 shadow-sm`}
                {...props}
            />
            {error && <span className="text-[10px] text-red-500 font-semibold ml-1">{error}</span>}
        </div>
    );
}

export function SupabaseTextarea({ label, value, onChange, placeholder, error, required = false, rows = 4, ...props }) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`bg-white border ${error ? 'border-red-400' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand block w-full p-3 outline-none transition-all placeholder:text-slate-300 shadow-sm resize-none`}
                {...props}
            />
            {error && <span className="text-[10px] text-red-500 font-semibold ml-1">{error}</span>}
        </div>
    );
}

export function SupabaseSelect({ label, value, onChange, options, error, required = false, ...props }) {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                className={`bg-white border ${error ? 'border-red-400' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand block w-full p-3 outline-none transition-all shadow-sm cursor-pointer`}
                {...props}
            >
                <option value="">Pilih opsi...</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
            {error && <span className="text-[10px] text-red-500 font-semibold ml-1">{error}</span>}
        </div>
    );
}export function SupabaseCombobox({ label, value, onChange, options, error, required = false, placeholder, ...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value || '');

    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (name) => {
        setSearchTerm(name);
        setIsOpen(false);
        // Simulate event for onChange
        onChange({ target: { value: name } });
    };

    return (
        <div className="flex flex-col space-y-2 w-full relative">
            {label && (
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative group">
                <input
                    type="text"
                    value={searchTerm}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onChange(e);
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    className={`bg-white border ${error ? 'border-red-400' : 'border-slate-200'} text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand block w-full p-3 outline-none transition-all placeholder:text-slate-300 shadow-sm`}
                    {...props}
                />
                
                {isOpen && filteredOptions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-60 overflow-y-auto p-1.5">
                            {filteredOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleSelect(opt.name)}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-supabase-brand rounded-xl transition-all flex items-center justify-between group"
                                >
                                    <span>{opt.name}</span>
                                    <div className="opacity-0 group-hover:opacity-100 bg-supabase-brand/10 text-supabase-brand text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        Pilih
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {error && <span className="text-[10px] text-red-500 font-semibold ml-1">{error}</span>}
            <p className="text-[9px] text-slate-400 ml-1 italic">Ketik untuk mencari atau masukkan secara manual.</p>
        </div>
    );
}
