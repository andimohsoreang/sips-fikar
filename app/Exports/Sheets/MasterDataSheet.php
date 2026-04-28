<?php

namespace App\Exports\Sheets;

use App\Models\Department;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class MasterDataSheet implements FromArray, WithTitle, WithHeadings, WithEvents
{
    protected $deptSlug;
    protected $sheetTitle;

    public function __construct($deptSlug, $sheetTitle)
    {
        $this->deptSlug = $deptSlug;
        $this->sheetTitle = $sheetTitle;
    }

    public function array(): array
    {
        $department = Department::where('slug', $this->deptSlug)
            ->orWhere('name', 'like', "%{$this->deptSlug}%")
            ->first();

        if (!$department) {
            return [];
        }

        $docTypes = DocumentType::where('department_id', $department->id)->get()->unique('code')->values();
        $classifications = Classification::where('department_id', $department->id)->get()->unique('code')->values();
        $subClassifications = SubClassification::where('department_id', $department->id)->get()->unique('code')->values();

        $maxRows = max($docTypes->count(), $classifications->count(), $subClassifications->count());

        $data = [];
        for ($i = 0; $i < $maxRows; $i++) {
            $docTypeStr = isset($docTypes[$i]) ? $docTypes[$i]->code . ' - ' . $docTypes[$i]->name : null;
            $classStr = isset($classifications[$i]) ? $classifications[$i]->code . ' - ' . $classifications[$i]->name : null;
            $subClassStr = isset($subClassifications[$i]) ? $subClassifications[$i]->code . ' - ' . $subClassifications[$i]->name : null;

            $data[] = [
                $docTypeStr,
                $classStr,
                $subClassStr,
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Jenis Dokumen',
            'Kualifikasi',
            'Sub Kualifikasi',
        ];
    }

    public function title(): string
    {
        return $this->sheetTitle;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();
                if ($highestRow < 2) $highestRow = 2;

                $sheet->setAutoFilter("A1:C{$highestRow}");

                $borderStyle = [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => 'FFE2E8F0'], // slate-200
                        ],
                    ],
                ];
                $sheet->getStyle("A1:C{$highestRow}")->applyFromArray($borderStyle);

                // Styling Headers (Slate 700 for Master Data)
                $sheet->getStyle('A1:C1')->getFont()->setBold(true);
                $sheet->getStyle('A1:C1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                      ->getStartColor()->setARGB('FF334155'); 
                $sheet->getStyle('A1:C1')->getFont()->getColor()->setARGB('FFFFFFFF');
                
                foreach (range('A', 'C') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
