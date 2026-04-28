<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classification;
use Inertia\Inertia;

class ClassificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Classifications/Index', [
            'classifications' => Classification::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:classifications,code,NULL,id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; Classification::create($data);

        return redirect()->route('classifications.index')->with('success', 'Kualifikasi berhasil ditambahkan.');
    }

    public function update(Request $request, Classification $classification)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:classifications,code,' . $classification->id . ',id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; $classification->update($data);

        return redirect()->route('classifications.index')->with('success', 'Kualifikasi berhasil diperbarui.');
    }

    public function destroy(Classification $classification)
    {
        $classification->delete();

        return redirect()->route('classifications.index')->with('success', 'Kualifikasi berhasil dihapus.');
    }
}
