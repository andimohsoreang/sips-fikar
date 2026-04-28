<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tables = ['letters', 'document_types', 'classifications', 'sub_classifications', 'recipients'];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('department_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            });

            // Map existing string 'department' to 'department_id'
            $departments = Department::all();
            foreach ($departments as $dept) {
                DB::table($tableName)
                    ->where('department', $dept->slug)
                    ->update(['department_id' => $dept->id]);
            }
        }
    }

    public function down(): void
    {
        $tables = ['letters', 'document_types', 'classifications', 'sub_classifications', 'recipients'];
        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['department_id']);
                $table->dropColumn('department_id');
            });
        }
    }
};
