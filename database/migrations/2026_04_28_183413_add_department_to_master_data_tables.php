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
        Schema::table('document_types', function (Blueprint $table) {
            $table->string('department')->default('sekretariat')->after('id');
        });
        Schema::table('classifications', function (Blueprint $table) {
            $table->string('department')->default('sekretariat')->after('id');
        });
        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->string('department')->default('sekretariat')->after('id');
        });
        Schema::table('letters', function (Blueprint $table) {
            $table->string('department')->default('sekretariat')->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('document_types', function (Blueprint $table) {
            $table->dropColumn('department');
        });
        Schema::table('classifications', function (Blueprint $table) {
            $table->dropColumn('department');
        });
        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->dropColumn('department');
        });
        Schema::table('letters', function (Blueprint $table) {
            $table->dropColumn('department');
        });
    }
};
