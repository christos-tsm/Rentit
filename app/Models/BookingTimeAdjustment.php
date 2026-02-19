<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingTimeAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'min_days_before',
        'max_days_before',
        'adjustment_type',
        'percentage',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'percentage' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
