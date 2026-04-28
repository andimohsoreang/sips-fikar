<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LetterGeneratorController extends Controller
{
    /**
     * Show the letter generator index (select letter).
     */
    public function index()
    {
        $letters = Letter::orderBy('created_at', 'desc')->get(['id', 'full_number', 'subject', 'letter_date']);
        
        return Inertia::render('Letters/GeneratorIndex', [
            'letters' => $letters,
        ]);
    }

    /**
     * Show the letter generator form.
     */
    public function create(Letter $letter)
    {
        $letter->load(['documentType', 'classification', 'subClassification']);

        return Inertia::render('Letters/Generate', [
            'letter' => $letter,
        ]);
    }

    /**
     * Generate print view (HTML to print).
     */
    public function print(Request $request, Letter $letter)
    {
        $letter->load(['documentType', 'classification', 'subClassification']);

        $data = $request->validate([
            'tanggal'           => 'required|string',
            'nomor'             => 'required|string',
            'lampiran'          => 'nullable|string',
            'klasifikasi'       => 'required|string',
            'perihal'           => 'required|string',
            'kepada'            => 'required|string',
            'hari_tanggal'      => 'required|string',
            'waktu'             => 'required|string',
            'tempat'            => 'required|string',
            'agenda'            => 'required|string',
            'dresscode'         => 'nullable|string',
            'nama_penandatangan'=> 'required|string',
            'jabatan_penandatangan' => 'required|string',
            'tembusan'          => 'nullable|array',
        ]);

        return view('letters.print', [
            'letter' => $letter,
            'data'   => $data,
        ]);
    }

    /**
     * Export PDF.
     */
    public function export(Request $request, Letter $letter)
    {
        $letter->load(['documentType', 'classification', 'subClassification']);

        $data = $request->validate([
            'tanggal'           => 'required|string',
            'nomor'             => 'required|string',
            'lampiran'          => 'nullable|string',
            'klasifikasi'       => 'required|string',
            'perihal'           => 'required|string',
            'kepada'            => 'required|string',
            'hari_tanggal'      => 'required|string',
            'waktu'             => 'required|string',
            'tempat'            => 'required|string',
            'agenda'            => 'required|string',
            'dresscode'         => 'nullable|string',
            'nama_penandatangan'=> 'required|string',
            'jabatan_penandatangan' => 'required|string',
            'tembusan'          => 'nullable|array',
        ]);

        $pdf = Pdf::loadView('letters.print', [
            'letter' => $letter,
            'data'   => $data,
        ])->setPaper('a4', 'portrait');

        $filename = 'Surat-' . str_replace('/', '-', $data['nomor']) . '.pdf';

        return $pdf->download($filename);
    }
}
