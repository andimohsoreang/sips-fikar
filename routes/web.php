<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/letters/export/excel', [\App\Http\Controllers\LetterController::class, 'exportExcel'])->name('letters.export-excel')->middleware('throttle:10,1');
    Route::resource('letters', \App\Http\Controllers\LetterController::class);
    Route::resource('document-types', \App\Http\Controllers\DocumentTypeController::class);
    Route::resource('classifications', \App\Http\Controllers\ClassificationController::class);
    Route::resource('sub-classifications', \App\Http\Controllers\SubClassificationController::class);
    Route::resource('recipients', \App\Http\Controllers\RecipientController::class);
    Route::resource('departments', \App\Http\Controllers\DepartmentController::class);

    // Letter Generator
    Route::get('/letter-generator', [\App\Http\Controllers\LetterGeneratorController::class, 'index'])->name('letters.generator.index');
    Route::get('/letters/{letter}/generate', [\App\Http\Controllers\LetterGeneratorController::class, 'create'])->name('letters.generate');
    Route::post('/letters/{letter}/print', [\App\Http\Controllers\LetterGeneratorController::class, 'print'])->name('letters.print');
    Route::post('/letters/{letter}/export', [\App\Http\Controllers\LetterGeneratorController::class, 'export'])->name('letters.export');
});

require __DIR__.'/auth.php';
