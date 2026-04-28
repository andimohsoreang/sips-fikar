<?php

namespace App\Exports\Sheets;

use App\Models\Letter;
use App\Models\Department;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use Illuminate\Support\Collection;

class LettersDataSheet implements FromCollection, WithTitle, WithHeadings, WithEvents
{
    protected $deptSlug;
    protected $deptTitle;

    public function __construct($deptSlug, $deptTitle)
    {
        $this->deptSlug = $deptSlug;
        $this->deptTitle = $deptTitle;
    }

    public function collection()
    {
        $department = Department::where('slug', $this->deptSlug)
            ->orWhere('name', 'like', "%{$this->deptSlug}%")
            ->first();

        $letters = Letter::with(['documentType', 'classification', 'subClassification'])
            ->where('department_id', $department ? $department->id : 0)
            ->orderBy('sequence_number', 'asc')
            ->get();

        $data = $letters->map(function ($letter) {
            $docTypeStr = $letter->documentType ? "{$letter->documentType->code} - {$letter->documentType->name}" : '';
            $classStr = $letter->classification ? "{$letter->classification->code} - {$letter->classification->name}" : '';
            $subClassStr = $letter->subClassification ? "{$letter->subClassification->code} - {$letter->subClassification->name}" : '';

            return [
                $letter->sequence_number,
                $letter->full_number,
                $letter->letter_date,
                $letter->recipient,
                $letter->subject,
                $docTypeStr,
                $classStr,
                $subClassStr,
                'Sudah Diinput', // Default for existing letters
            ];
        });

        $lastSeq = $letters->max('sequence_number') ?? 0;
        for ($i = 1; $i <= 50; $i++) {
            $data->push([
                $lastSeq + $i, 
                '', 
                '', 
                '', 
                '', 
                '', 
                '', 
                '', 
                'Belum Diinput', // Default for new empty rows
            ]);
        }

        return $data->values();
    }

    public function headings(): array
    {
        return [
            'Nomor Urut',
            'Nomor Surat Lengkap',
            'Tanggal (YYYY-MM-DD)',
            'Tujuan',
            'Perihal',
            'Jenis Dokumen',
            'Kualifikasi',
            'Sub Kualifikasi',
            'Status Sinkronisasi Web'
        ];
    }

    public function title(): string
    {
        return $this->deptTitle;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $maxRow = 1000;

                $masterSheetName = 'MasterData';
                if ($this->deptSlug === 'sekretariat') $masterSheetName = 'MasterSekretariat';
                if ($this->deptSlug === 'kapr') $masterSheetName = 'MasterKAPR';
                if ($this->deptSlug === 'knr') $masterSheetName = 'MasterKNR';

                for ($row = 2; $row <= $maxRow; $row++) {
                    
                    // Date Validation (C)
                    $validationDate = $sheet->getCell("C{$row}")->getDataValidation();
                    $validationDate->setType(DataValidation::TYPE_DATE);
                    $validationDate->setErrorStyle(DataValidation::STYLE_STOP);
                    $validationDate->setAllowBlank(true);
                    $validationDate->setShowInputMessage(true);
                    $validationDate->setShowErrorMessage(true);
                    $validationDate->setErrorTitle('Format Salah');
                    $validationDate->setError('Harap masukkan format tanggal yang valid (YYYY-MM-DD).');
                    $validationDate->setOperator(DataValidation::OPERATOR_GREATERTHANOREQUAL);
                    $validationDate->setFormula1('Date(2020,1,1)');

                    // Jenis Dokumen (F)
                    $validationJenis = $sheet->getCell("F{$row}")->getDataValidation();
                    $validationJenis->setType(DataValidation::TYPE_LIST);
                    $validationJenis->setErrorStyle(DataValidation::STYLE_INFORMATION);
                    $validationJenis->setAllowBlank(true);
                    $validationJenis->setShowDropDown(true);
                    $validationJenis->setFormula1("{$masterSheetName}!\$A\$2:\$A\$50");

                    // Kualifikasi (G)
                    $validationKual = $sheet->getCell("G{$row}")->getDataValidation();
                    $validationKual->setType(DataValidation::TYPE_LIST);
                    $validationKual->setErrorStyle(DataValidation::STYLE_INFORMATION);
                    $validationKual->setAllowBlank(true);
                    $validationKual->setShowDropDown(true);
                    $validationKual->setFormula1("{$masterSheetName}!\$B\$2:\$B\$50");

                    // Sub Kualifikasi (H)
                    $validationSub = $sheet->getCell("H{$row}")->getDataValidation();
                    $validationSub->setType(DataValidation::TYPE_LIST);
                    $validationSub->setErrorStyle(DataValidation::STYLE_INFORMATION);
                    $validationSub->setAllowBlank(true);
                    $validationSub->setShowDropDown(true);
                    $validationSub->setFormula1("{$masterSheetName}!\$C\$2:\$C\$100");

                    // Status Sinkronisasi Web (I)
                    $validationSync = $sheet->getCell("I{$row}")->getDataValidation();
                    $validationSync->setType(DataValidation::TYPE_LIST);
                    $validationSync->setErrorStyle(DataValidation::STYLE_INFORMATION);
                    $validationSync->setAllowBlank(true);
                    $validationSync->setShowDropDown(true);
                    $validationSync->setFormula1('"Belum Diinput,Sudah Diinput"');

                    $existingVal = $sheet->getCell("B{$row}")->getValue();
                    if ($existingVal === null || $existingVal === '') {
                        $extF = 'IFERROR(LEFT(F'.$row.', FIND(" - ", F'.$row.') - 1), F'.$row.')';
                        $extG = 'IFERROR(LEFT(G'.$row.', FIND(" - ", G'.$row.') - 1), G'.$row.')';
                        $extH = 'IFERROR(LEFT(H'.$row.', FIND(" - ", H'.$row.') - 1), H'.$row.')';

                        $formula = '=IF(F'.$row.'="", "", '.$extF.' & "/" & '.$extG.' & "/" & '.$extH.' & "-" & RIGHT(YEAR(C'.$row.'), 2) & "-" & TEXT(MONTH(C'.$row.'), "00") & "-" & A'.$row.')';
                        $sheet->setCellValue('B'.$row, $formula);
                    }
                }

                // Styling
                $sheet->setAutoFilter('A1:I1000');

                $borderStyle = [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['argb' => 'FFE2E8F0'], // slate-200
                        ],
                    ],
                ];
                $sheet->getStyle('A1:I1000')->applyFromArray($borderStyle);

                // Conditional Formatting for missing data warning and completion
                $conditionalStyles = [];
                // Warning: Has Number but missing Tanggal, Tujuan, or Perihal
                $condWarning = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $condWarning->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_EXPRESSION);
                $condWarning->setConditions(['AND($B2<>"", OR($C2="", $D2="", $E2=""))']);
                $condWarning->getStyle()->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getEndColor()->setARGB('FFFFEDD5'); // orange-100
                $conditionalStyles[] = $condWarning;

                // Success: All filled
                $condSuccess = new \PhpOffice\PhpSpreadsheet\Style\Conditional();
                $condSuccess->setConditionType(\PhpOffice\PhpSpreadsheet\Style\Conditional::CONDITION_EXPRESSION);
                $condSuccess->setConditions(['AND($B2<>"", $C2<>"", $D2<>"", $E2<>"")']);
                $condSuccess->getStyle()->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getEndColor()->setARGB('FFECFDF5'); // emerald-50
                $conditionalStyles[] = $condSuccess;

                $sheet->getStyle('A2:I1000')->setConditionalStyles($conditionalStyles);

                // Header Styling
                $sheet->getStyle('A1:I1')->getFont()->setBold(true);
                $sheet->getStyle('A1:I1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                      ->getStartColor()->setARGB('FF3ECF8E'); // Supabase brand green
                $sheet->getStyle('A1:I1')->getFont()->getColor()->setARGB('FFFFFFFF');
                
                foreach (range('A', 'I') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                // SHEET PROTECTION
                $sheet->getProtection()->setSheet(true);
                $sheet->getProtection()->setSort(true);
                $sheet->getProtection()->setAutoFilter(true);
                $sheet->getProtection()->setFormatCells(true);
                
                // Unlock input columns C through I
                $sheet->getStyle('C2:I1000')->getProtection()->setLocked(\PhpOffice\PhpSpreadsheet\Style\Protection::PROTECTION_UNPROTECTED);
            },
        ];
    }
}
