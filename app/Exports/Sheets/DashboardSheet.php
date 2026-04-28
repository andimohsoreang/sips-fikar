<?php

namespace App\Exports\Sheets;

use App\Models\Letter;
use App\Models\Department;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class DashboardSheet implements FromArray, WithTitle, WithEvents
{
    public function array(): array
    {
        $departments = Department::all();
        $stats = [];
        
        $stats[] = ['SISTEM INFORMASI PERSURATAN (SIPS) - OFFLINE TRACKER'];
        $stats[] = [''];
        $stats[] = ['Tanggal Ekspor:', now()->format('d F Y H:i:s')];
        $stats[] = [''];
        $stats[] = ['RINGKASAN TOTAL SURAT TERDAFTAR'];
        $stats[] = ['Bidang / Departemen', 'Total Surat'];
        
        $grandTotal = 0;
        foreach ($departments as $dept) {
            $count = Letter::where('department_id', $dept->id)->count();
            $stats[] = [$dept->name, $count];
            $grandTotal += $count;
        }
        
        $stats[] = ['Total Keseluruhan', $grandTotal];
        $stats[] = [''];
        $stats[] = ['PANDUAN PENGGUNAAN SINGKAT'];
        $stats[] = ['1. Gunakan sheet "Sekretariat Dekom", "KAPR", atau "KNR" untuk mencatat surat secara offline.'];
        $stats[] = ['2. Cukup pilih Jenis, Kualifikasi, dan Sub Kualifikasi dari dropdown yang tersedia.'];
        $stats[] = ['3. Nomor surat akan TERBENTUK OTOMATIS setelah Jenis Dokumen dipilih.'];
        $stats[] = ['4. Jangan lupa mengisi kolom Tanggal (Format: YYYY-MM-DD) agar nomor surat sempurna.'];

        return $stats;
    }

    public function title(): string
    {
        return 'Dashboard & Panduan';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                
                // Styling Title
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getFont()->getColor()->setARGB('FF3ECF8E'); // Supabase green
                
                // Styling Table Headers
                $sheet->getStyle('A5:B6')->getFont()->setBold(true);
                $sheet->getStyle('A5:B5')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF334155');
                $sheet->getStyle('A5:B5')->getFont()->getColor()->setARGB('FFFFFFFF');
                $sheet->getStyle('A6:B6')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFF1F5F9');
                
                // Borders for table
                $totalRows = 6 + \App\Models\Department::count() + 1; // 6 header rows + depts + grand total
                $sheet->getStyle("A5:B{$totalRows}")->applyFromArray([
                    'borders' => [
                        'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFE2E8F0']],
                    ],
                ]);
                
                // Grand total bold
                $sheet->getStyle("A{$totalRows}:B{$totalRows}")->getFont()->setBold(true);

                // Styling Guide
                $guideStart = $totalRows + 2;
                $sheet->getStyle("A{$guideStart}")->getFont()->setBold(true)->setSize(12);

                // Auto sizes
                $sheet->getColumnDimension('A')->setWidth(45);
                $sheet->getColumnDimension('B')->setAutoSize(true);
            },
        ];
    }
}
