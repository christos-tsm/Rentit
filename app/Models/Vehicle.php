<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model {
    protected $fillable = [];

    public function category(): BelongsTo {
        return $this->belongsTo(VehicleCategory::class, 'vehicle_category_id');
    }

    public function features(): BelongsToMany {
        return $this->belongsToMany(Feature::class);
    }

    public function bookings(): HasMany {
        return $this->hasMany(Booking::class);
    }

    public function maintenances(): HasMany {
        return $this->hasMany(Maintenance::class);
    }
}
