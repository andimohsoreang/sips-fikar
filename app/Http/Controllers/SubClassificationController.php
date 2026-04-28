<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubClassification;
use Inertia\Inertia;

class SubClassificationController extends Controller
{
    public function index()
    {
        return Inertia::render('SubClassifications/Index', [
            'subClassifications' => SubClassification::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:sub_classifications,code,NULL,id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; SubClassification::create($data);

        return redirect()->route('sub-classifications.index')->with('success', 'Sub kualifikasi berhasil ditambahkan.');
    }

    public function update(Request $request, SubClassification $subClassification)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:sub_classifications,code,' . $subClassification->id . ',id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; $subClassification->update($data);

        return redirect()->route('sub-classifications.index')->with('success', 'Sub kualifikasi berhasil diperbarui.');
    }

    public function destroy(SubClassification $subClassification)
    {
        $subClassification->delete();

        return redirect()->route('sub-classifications.index')->with('success', 'Sub kualifikasi berhasil dihapus.');
    }
}
