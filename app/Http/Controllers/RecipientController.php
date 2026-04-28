<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipient;
use Inertia\Inertia;

class RecipientController extends Controller
{
    public function index()
    {
        return Inertia::render('Recipients/Index', [
            'recipients' => Recipient::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255|unique:recipients,name,NULL,id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; Recipient::create($data);

        return redirect()->route('recipients.index')->with('success', 'Master tujuan berhasil ditambahkan.');
    }

    public function update(Request $request, Recipient $recipient)
    {
        $data = $request->validate([
            'department' => 'required|string|exists:departments,slug',
            'name' => 'required|string|max:255|unique:recipients,name,' . $recipient->id . ',id,department,' . $request->department,
        ]);

        $dept = \App\Models\Department::where('slug', $data['department'])->first(); $data['department_id'] = $dept->id; $recipient->update($data);

        return redirect()->route('recipients.index')->with('success', 'Master tujuan berhasil diperbarui.');
    }

    public function destroy(Recipient $recipient)
    {
        $recipient->delete();

        return redirect()->route('recipients.index')->with('success', 'Master tujuan berhasil dihapus.');
    }
}
