<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('letter_date');
            $table->foreignId('document_type_id')->constrained();
            $table->foreignId('classification_id')->constrained();
            $table->foreignId('sub_classification_id')->constrained();
            $table->string('recipient');
            $table->text('subject');
            $table->integer('sequence_number');
            $table->string('full_number')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};
