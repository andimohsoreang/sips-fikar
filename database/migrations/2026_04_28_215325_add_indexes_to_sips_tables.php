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
        Schema::table('letters', function (Blueprint $table) {
            $table->index('department_id');
            $table->index('department');
            $table->index('letter_date');
            $table->index('sequence_number');
            $table->index('full_number');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->index('slug');
        });

        Schema::table('document_types', function (Blueprint $table) {
            $table->index('code');
            $table->index('department_id');
        });

        Schema::table('classifications', function (Blueprint $table) {
            $table->index('code');
            $table->index('department_id');
        });

        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->index('code');
            $table->index('department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('letters', function (Blueprint $table) {
            $table->dropIndex(['department_id']);
            $table->dropIndex(['department']);
            $table->dropIndex(['letter_date']);
            $table->dropIndex(['sequence_number']);
            $table->dropIndex(['full_number']);
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->dropIndex(['slug']);
        });

        Schema::table('document_types', function (Blueprint $table) {
            $table->dropIndex(['code']);
            $table->dropIndex(['department_id']);
        });

        Schema::table('classifications', function (Blueprint $table) {
            $table->dropIndex(['code']);
            $table->dropIndex(['department_id']);
        });

        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->dropIndex(['code']);
            $table->dropIndex(['department_id']);
        });
    }
};
