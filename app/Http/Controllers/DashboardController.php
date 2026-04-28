<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Letter;
use App\Models\DocumentType;
use App\Models\Classification;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalLetters' => Letter::count(),
            'totalTypes' => DocumentType::count(),
            'totalClassifications' => Classification::count(),
            'totalToday' => Letter::whereDate('created_at', now())->count(),
            'recentLetters' => Letter::latest()->take(5)->get([
                'id', 
                'full_number', 
                'subject', 
                'letter_date', 
                'department', 
                'recipient'
            ]),
        ]);
    }
}
