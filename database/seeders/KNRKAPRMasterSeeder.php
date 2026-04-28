<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;

class KNRKAPRMasterSeeder extends Seeder
{
    public function run(): void
    {
        $departments = ['kapr', 'knr'];

        foreach ($departments as $dept) {
            // 1. Create Document Types
            $types = [
                ['name' => 'Keputusan', 'code' => 'KEP'],
                ['name' => 'Surat', 'code' => 'SRT'],
                ['name' => 'Risalah Rapat', 'code' => 'RIS'],
                ['name' => 'Laporan', 'code' => 'LAP'],
            ];

            foreach ($types as $type) {
                DocumentType::updateOrCreate(
                    ['department' => $dept, 'code' => $type['code']],
                    ['name' => $type['name']]
                );
            }

            // 2. Create Classifications
            $classifications = [
                ['name' => 'Tanggapan', 'code' => 'TAG'],
                ['name' => 'Persetujuan', 'code' => 'APP'],
                ['name' => 'Keputusan', 'code' => 'DEC'],
                ['name' => 'Undangan', 'code' => 'UND'],
                ['name' => 'Rapat KOM', 'code' => 'KOM'],
                ['name' => 'Evaluasi', 'code' => 'EVA'],
                ['name' => 'Tata Kelola', 'code' => 'TK'],
            ];

            foreach ($classifications as $class) {
                Classification::updateOrCreate(
                    ['department' => $dept, 'code' => $class['code']],
                    ['name' => $class['name']]
                );
            }

            // 3. Create Sub Classifications (Flat)
            $subs = [
                ['name' => 'Hukum', 'code' => 'KH'],
                ['name' => 'Organisasi', 'code' => 'KT'],
                ['name' => 'Operasional', 'code' => 'KO'],
                ['name' => 'Rencana Perusahaan', 'code' => 'KC'],
                ['name' => 'Pengawasan', 'code' => 'KW'],
                ['name' => 'General Affairs', 'code' => 'KM'],
                ['name' => 'Keuangan', 'code' => 'KK'],
                ['name' => 'Pengendalian Dokumen', 'code' => 'KE'],
                ['name' => 'Diklat', 'code' => 'KD'],
                ['name' => 'Kepegawaian', 'code' => 'KP'],
                ['name' => 'Sistem Informasi', 'code' => 'KI'],
                ['name' => 'Rapat BOC-BOD', 'code' => 'KR'],
            ];

            foreach ($subs as $sub) {
                SubClassification::updateOrCreate(
                    ['department' => $dept, 'code' => $sub['code']],
                    ['name' => $sub['name']]
                );
            }
        }
    }
}
