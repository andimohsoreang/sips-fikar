<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Department;
use App\Models\DocumentType;
use App\Models\Classification;
use App\Models\SubClassification;
use App\Models\Letter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SipsTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $dept;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        
        // Create initial master data
        $this->dept = Department::create([
            'name' => 'KAPR',
            'slug' => 'kapr',
            'color' => 'supabase'
        ]);

        DocumentType::create([
            'department_id' => $this->dept->id,
            'department' => $this->dept->slug,
            'name' => 'Surat',
            'code' => 'SRT'
        ]);

        Classification::create([
            'department_id' => $this->dept->id,
            'department' => $this->dept->slug,
            'name' => 'Tanggapan',
            'code' => 'TAG'
        ]);

        SubClassification::create([
            'department_id' => $this->dept->id,
            'department' => $this->dept->slug,
            'name' => 'Hukum',
            'code' => 'KH'
        ]);
    }

    public function test_can_register_a_new_letter()
    {
        $docType = DocumentType::first();
        $class = Classification::first();
        $sub = SubClassification::first();

        $response = $this->actingAs($this->user)
            ->post(route('letters.store'), [
                'department' => $this->dept->slug,
                'letter_date' => now()->format('Y-m-d'),
                'document_type_id' => $docType->id,
                'classification_id' => $class->id,
                'sub_classification_id' => $sub->id,
                'recipient' => 'Direktur Utama',
                'subject' => 'Testing Subject',
                'sequence_number' => 1,
            ]);

        $response->assertRedirect(route('letters.index'));
        $this->assertDatabaseHas('letters', [
            'subject' => 'Testing Subject',
            'department_id' => $this->dept->id,
            'sequence_number' => 1
        ]);
    }

    public function test_letter_sequence_increments_correctly()
    {
        $docType = DocumentType::first();
        $class = Classification::first();
        $sub = SubClassification::first();

        // Create first letter
        $this->actingAs($this->user)->post(route('letters.store'), [
            'department' => $this->dept->slug,
            'letter_date' => now()->format('Y-m-d'),
            'document_type_id' => $docType->id,
            'classification_id' => $class->id,
            'sub_classification_id' => $sub->id,
            'recipient' => 'Recipient 1',
            'subject' => 'Subject 1',
            'sequence_number' => 1,
        ]);

        // Second letter
        $this->actingAs($this->user)->post(route('letters.store'), [
            'department' => $this->dept->slug,
            'letter_date' => now()->format('Y-m-d'),
            'document_type_id' => $docType->id,
            'classification_id' => $class->id,
            'sub_classification_id' => $sub->id,
            'recipient' => 'Recipient 2',
            'subject' => 'Subject 2',
            'sequence_number' => 2,
        ]);

        $this->assertEquals(2, Letter::where('subject', 'Subject 2')->first()->sequence_number);
    }

    public function test_can_manage_dynamic_departments()
    {
        $response = $this->actingAs($this->user)
            ->post(route('departments.store'), [
                'name' => 'Bidang Baru',
                'color' => 'indigo'
            ]);

        $response->assertRedirect(route('departments.index'));
        $this->assertDatabaseHas('departments', ['name' => 'Bidang Baru', 'slug' => 'bidang-baru']);
    }

    public function test_validation_prevents_duplicate_codes_within_same_department()
    {
        $response = $this->actingAs($this->user)
            ->post(route('classifications.store'), [
                'department' => $this->dept->slug,
                'name' => 'Duplicate Test',
                'code' => 'TAG' // Already exists
            ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_allows_same_code_in_different_departments()
    {
        $newDept = Department::create(['name' => 'KNR', 'slug' => 'knr']);

        $response = $this->actingAs($this->user)
            ->post(route('classifications.store'), [
                'department' => $newDept->slug,
                'name' => 'Different Dept Test',
                'code' => 'TAG' // Same code but different dept
            ]);

        $response->assertRedirect(route('classifications.index'));
        $this->assertDatabaseHas('classifications', ['department' => 'knr', 'code' => 'TAG']);
    }

    public function test_can_export_letters_to_excel()
    {
        \Maatwebsite\Excel\Facades\Excel::fake();

        $response = $this->actingAs($this->user)
            ->get(route('letters.export-excel'));

        $response->assertStatus(200);

        \Maatwebsite\Excel\Facades\Excel::assertDownloaded('SIPS_Offline_Tracker.xlsx', function (\App\Exports\LettersExport $export) {
            // Check that the export has the correct number of sheets (1 Dashboard + 3 Data + 3 Master = 7)
            return count($export->sheets()) === 7;
        });
    }
}
