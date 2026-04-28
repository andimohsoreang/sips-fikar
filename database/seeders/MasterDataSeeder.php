<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $departments = Department::all();

        foreach ($departments as $dept) {
            // 1. Jenis Dokumen
            $documentTypes = [
                ['name' => 'Keputusan', 'code' => 'KEP'],
                ['name' => 'Surat', 'code' => 'SRT'],
                ['name' => 'Risalah Rapat', 'code' => 'RIS'],
                ['name' => 'Laporan', 'code' => 'LAP'],
            ];

            foreach ($documentTypes as $type) {
                DocumentType::updateOrCreate(
                    ['department_id' => $dept->id, 'code' => $type['code']],
                    ['name' => $type['name'], 'department' => $dept->slug]
                );
            }

            // 2. Kualifikasi (Classification)
            if ($dept->slug === 'sekretariat') {
                $classifications = [
                    ['name' => 'Tanggapan', 'code' => 'TAG'],
                    ['name' => 'Persetujuan', 'code' => 'APP'],
                    ['name' => 'Keputusan', 'code' => 'DEC'],
                    ['name' => 'Undangan', 'code' => 'UND'],
                    ['name' => 'Rapat BOC', 'code' => 'BOC'],
                    ['name' => 'Rapat BOC&BOD', 'code' => 'BOCD'],
                    ['name' => 'Umum', 'code' => 'UM'],
                ];
            } else {
                $classifications = [
                    ['name' => 'Tanggapan', 'code' => 'TAG'],
                    ['name' => 'Persetujuan', 'code' => 'APP'],
                    ['name' => 'Keputusan', 'code' => 'DEC'],
                    ['name' => 'Undangan', 'code' => 'UND'],
                    ['name' => 'Rapat KOM', 'code' => 'KOM'],
                    ['name' => 'Evaluasi', 'code' => 'EVA'],
                    ['name' => 'Tata Kelola', 'code' => 'TK'],
                ];
            }

            foreach ($classifications as $class) {
                Classification::updateOrCreate(
                    ['department_id' => $dept->id, 'code' => $class['code']],
                    ['name' => $class['name'], 'department' => $dept->slug]
                );
            }

            // 3. Sub Kualifikasi (Same for all as per latest requests)
            $subClassifications = [
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

            foreach ($subClassifications as $sub) {
                SubClassification::updateOrCreate(
                    ['department_id' => $dept->id, 'code' => $sub['code']],
                    ['name' => $sub['name'], 'department' => $dept->slug]
                );
            }
        }
    }
}
