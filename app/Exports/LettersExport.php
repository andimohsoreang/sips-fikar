<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\Sheets\LettersDataSheet;
use App\Exports\Sheets\MasterDataSheet;
use App\Exports\Sheets\DashboardSheet;

class LettersExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        return [
            new DashboardSheet(),
            new LettersDataSheet('sekretariat', 'Sekretariat Dekom'),
            new LettersDataSheet('kapr', 'KAPR'),
            new LettersDataSheet('knr', 'KNR'),
            new MasterDataSheet('sekretariat', 'MasterSekretariat'),
            new MasterDataSheet('kapr', 'MasterKAPR'),
            new MasterDataSheet('knr', 'MasterKNR'),
        ];
    }
}
