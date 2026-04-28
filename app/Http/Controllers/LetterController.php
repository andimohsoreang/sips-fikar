<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Letter;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;
use App\Models\Recipient;
use App\Services\LetterService;
use Inertia\Inertia;

class LetterController extends Controller
{
    protected $letterService;

    public function __construct(LetterService $letterService)
    {
        $this->letterService = $letterService;
    }

    public function index()
    {
        return Inertia::render('Letters/Index', [
            'letters' => Letter::with(['documentType', 'classification', 'subClassification'])->latest()->paginate(100),
            'documentTypes' => \Illuminate\Support\Facades\Cache::remember('document_types_all', 60*24, function() {
                return DocumentType::all()->values()->toArray();
            }),
            'classifications' => \Illuminate\Support\Facades\Cache::remember('classifications_all', 60*24, function() {
                return Classification::all()->values()->toArray();
            }),
            'subClassifications' => \Illuminate\Support\Facades\Cache::remember('sub_classifications_all', 60*24, function() {
                return SubClassification::all()->values()->toArray();
            }),
            'recipients' => \Illuminate\Support\Facades\Cache::remember('recipients_all', 60*24, function() {
                return Recipient::all()->values()->toArray();
            }),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'letter_date' => 'required|date',
            'document_type_id' => 'required|exists:document_types,id',
            'classification_id' => 'required|exists:classifications,id',
            'sub_classification_id' => 'required|exists:sub_classifications,id',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:1000',
            'sequence_number' => 'required|integer|min:1',
        ]);

        // Resolve department_id
        $department = \App\Models\Department::where('slug', $data['department'])->first();
        $data['department_id'] = $department->id;

        $numbering = $this->letterService->generateFullNumber($data);
        
        $data['full_number'] = $numbering['full_number'];
        $data['sequence_number'] = $numbering['sequence_number'];

        Letter::create($data);

        return redirect()->route('letters.index')->with('success', 'Nomor surat berhasil diregistrasi.');
    }

    public function update(Request $request, Letter $letter)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'letter_date' => 'required|date',
            'document_type_id' => 'required|exists:document_types,id',
            'classification_id' => 'required|exists:classifications,id',
            'sub_classification_id' => 'required|exists:sub_classifications,id',
            'recipient' => 'required|string|max:255',
            'subject' => 'required|string|max:1000',
            'sequence_number' => 'required|integer|min:1',
        ]);

        // Resolve department_id
        $department = \App\Models\Department::where('slug', $data['department'])->first();
        $data['department_id'] = $department->id;

        $numbering = $this->letterService->generateFullNumber($data);
        $data['full_number'] = $numbering['full_number'];

        $letter->update($data);

        return redirect()->route('letters.index')->with('success', 'Data surat berhasil diperbarui.');
    }

    public function destroy(Letter $letter)
    {
        $letter->delete();

        return redirect()->route('letters.index')->with('success', 'Nomor surat berhasil dihapus.');
    }

    public function exportExcel()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\LettersExport, 'SIPS_Offline_Tracker.xlsx');
    }
}
