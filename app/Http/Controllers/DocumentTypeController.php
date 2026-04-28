<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DocumentType;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('DocumentTypes/Index', [
            'documentTypes' => DocumentType::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:document_types,code,NULL,id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; DocumentType::create($data);

        return redirect()->route('document-types.index')->with('success', 'Jenis dokumen berhasil ditambahkan.');
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:document_types,code,' . $documentType->id . ',id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; $documentType->update($data);

        return redirect()->route('document-types.index')->with('success', 'Jenis dokumen berhasil diperbarui.');
    }

    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();

        return redirect()->route('document-types.index')->with('success', 'Jenis dokumen berhasil dihapus.');
    }
}
