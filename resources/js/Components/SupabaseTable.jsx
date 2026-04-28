import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText, MoreVertical } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export default function SupabaseTable({ 
    columns, 
    data, 
    searchPlaceholder = "Search...", 
    itemsPerPage = 10 
}) {
    const { departments } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bidangFilter, setBidangFilter] = useState('all');

    // Filter logic
    const filteredData = useMemo(() => {
        let result = data;

        // Apply Bidang Filter
        if (bidangFilter !== 'all') {
            result = result.filter(item => item.department === bidangFilter);
        }

        // Apply Search
        if (searchQuery) {
            result = result.filter(item => {
                return Object.values(item).some(val => 
                    String(val).toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
        }
        
        return result;
    }, [data, searchQuery, bidangFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // Handle search change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    return (
        <div className="flex flex-col space-y-5">
            {/* Table Header / Filter & Search */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Bidang Switcher (Pills) */}
                    {data.length > 0 && data[0].hasOwnProperty('department') && (
                        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit shrink-0">
                            <button
                                onClick={() => {
                                    setBidangFilter('all');
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                                    bidangFilter === 'all'
                                    ? 'bg-white text-supabase-brand shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Semua Bidang
                            </button>
                            {departments.map((dept) => (
                                <button
                                    key={dept.id}
                                    onClick={() => {
                                        setBidangFilter(dept.slug);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                                        bidangFilter === dept.slug
                                        ? 'bg-white text-supabase-brand shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {dept.slug === 'sekretariat' ? 'Sekretariat' : dept.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        {paginatedData.length} dari {filteredData.length} hasil
                    </div>
                </div>

                <div className="relative max-w-xl w-full group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-supabase-brand transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-supabase-brand/10 focus:border-supabase-brand block w-full pl-11 p-3 outline-none transition-all shadow-sm group-hover:border-slate-300" 
                        placeholder={searchPlaceholder} 
                    />
                </div>
            </div>

            {/* Table Body */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} scope="col" className={`px-6 py-5 font-bold ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? paginatedData.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors group">
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} className={`px-6 py-5 ${col.className || ''}`}>
                                        {col.cell ? col.cell(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-4 bg-slate-50 rounded-2xl">
                                            <FileText className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 tracking-tight">Tidak ada data ditemukan</p>
                                            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            <div className="flex items-center space-x-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                            currentPage === i + 1 
                                            ? 'bg-supabase-brand text-white shadow-sm' 
                                            : 'text-slate-500 hover:bg-white hover:border-slate-200 border border-transparent'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
