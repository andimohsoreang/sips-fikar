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
        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->foreignId('classification_id')->nullable()->after('department')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('sub_classifications', function (Blueprint $table) {
            $table->dropForeign(['classification_id']);
            $table->dropColumn('classification_id');
        });
    }
};
