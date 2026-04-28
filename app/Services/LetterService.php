<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;
use Carbon\Carbon;

class LetterService
{
    public function generateFullNumber($data)
    {
        $type = DocumentType::findOrFail($data['document_type_id'])->code;
        $class = Classification::findOrFail($data['classification_id'])->code;
        $sub = SubClassification::findOrFail($data['sub_classification_id'])->code;

        $date = Carbon::parse($data['letter_date']);
        $year = $date->format('y');
        $month = $date->format('m');

        $sequence = $data['sequence_number'] ?? null;

        if (!$sequence) {
            $lastLetter = Letter::whereYear('letter_date', $date->year)
                ->whereMonth('letter_date', $date->month)
                ->max('sequence_number');

            $sequence = $lastLetter ? $lastLetter + 1 : 1;
        }

        $paddedSequence = str_pad($sequence, 1, '0', STR_PAD_LEFT);
        
        $fullNumber = "{$type}/{$class}/{$sub}-{$year}-{$month}-{$paddedSequence}";

        return [
            'full_number' => $fullNumber,
            'sequence_number' => $sequence
        ];
    }

    public function getNextSequence(Carbon $date)
    {
        $lastSeq = Letter::whereYear('letter_date', $date->year)
            ->whereMonth('letter_date', $date->month)
            ->max('sequence_number') ?? 0;

        return $lastSeq + 1;
    }
}
