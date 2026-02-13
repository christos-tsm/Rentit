<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Booking extends Model {
    protected $fillable = [];

    public function vehicle(): BelongsTo {
        return $this->belongsTo(Vehicle::class);
    }

    public function customer(): BelongsTo {
        return $this->belongsTo(Customer::class);
    }

    public function extras(): BelongsToMany {
        return $this->belongsToMany(Extra::class)->withPivot('quantity');
    }

    public function pickupLocation(): BelongsTo {
        return $this->belongsTo(Location::class, 'pickup_location_id');
    }

    public function returnLocation(): BelongsTo {
        return $this->belongsTo(Location::class, 'return_location_id');
    }
}
