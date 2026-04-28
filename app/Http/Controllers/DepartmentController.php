<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use Inertia\Inertia;
use Illuminate\Support\Str;

class DepartmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Departments/Index', [
            'departments_data' => Department::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'color' => 'required|string|in:slate,supabase,indigo,emerald,rose,amber',
        ]);

        $data['slug'] = Str::slug($data['name']);

        Department::create($data);

        return redirect()->route('departments.index')->with('success', 'Bidang berhasil ditambahkan.');
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'color' => 'required|string|in:slate,supabase,indigo,emerald,rose,amber',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $department->update($data);

        return redirect()->route('departments.index')->with('success', 'Bidang berhasil diperbarui.');
    }

    public function destroy(Department $department)
    {
        // Check if department is being used in other tables (soft check)
        // For simplicity, we just delete but in production we'd use a check
        $department->delete();

        return redirect()->route('departments.index')->with('success', 'Bidang berhasil dihapus.');
    }
}
