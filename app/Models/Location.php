<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model {
    protected $fillable = ['name', 'address', 'coordinates', 'phone', 'is_active'];

    /**
     * Οι κρατήσεις που έχουν αυτή την τοποθεσία ως σημείο παραλαβής.
     */
    public function pickupBookings(): HasMany {
        return $this->hasMany(Booking::class, 'pickup_location_id');
    }

    /**
     * Οι κρατήσεις που έχουν αυτή την τοποθεσία ως σημείο παράδοσης.
     */
    public function returnBookings(): HasMany {
        return $this->hasMany(Booking::class, 'return_location_id');
    }
}
