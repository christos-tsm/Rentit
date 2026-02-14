<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class VehicleMake extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function vehicleModels(): HasMany
    {
        return $this->hasMany(VehicleModel::class);
    }

    public function vehicles(): HasManyThrough
    {
        return $this->hasManyThrough(Vehicle::class, VehicleModel::class);
    }
}
