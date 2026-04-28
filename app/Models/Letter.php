<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Letter extends Model
{
    use HasUuids;

    protected $fillable = [
        'department', 'department_id',
        'letter_date',
        'document_type_id',
        'classification_id',
        'sub_classification_id',
        'recipient',
        'subject',
        'sequence_number',
        'full_number',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
    }

    public function subClassification(): BelongsTo
    {
        return $this->belongsTo(SubClassification::class);
    }
}
