<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleCategory extends Model {
    protected $fillable = [];

    public function vehicles(): HasMany {
        return $this->hasMany(Vehicle::class);
    }
}
