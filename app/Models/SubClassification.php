<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubClassification extends Model
{
    protected $fillable = ['department', 'department_id', 'classification_id', 'name', 'code'];

    public function classification()
    {
        return $this->belongsTo(Classification::class);
    }
}
