<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YieldRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'min_available_vehicles',
        'price_increase_percentage',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_increase_percentage' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }
}
