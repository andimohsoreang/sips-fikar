<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classification extends Model
{
    protected $fillable = ['department', 'department_id', 'name', 'code'];

    public function subClassifications()
    {
        return $this->hasMany(SubClassification::class);
    }
}
