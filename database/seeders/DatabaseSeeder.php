<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin SIPS',
            'email' => 'admin@sips.com',
            'password' => bcrypt('password'),
        ]);

        // Seed Departments
        $departments = [
            ['name' => 'Sekretariat Dewan Komisaris', 'slug' => 'sekretariat'],
            ['name' => 'Komite Audit & Profil Risiko', 'slug' => 'kapr'],
            ['name' => 'Komite Nominasi & Remunerasi', 'slug' => 'knr'],
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::firstOrCreate(['slug' => $dept['slug']], $dept);
        }

        $this->call(MasterDataSeeder::class);
    }
}
