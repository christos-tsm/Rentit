<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Extra extends Model {
    protected $fillable = [];

    public function bookings(): BelongsToMany {
        return $this->belongsToMany(Booking::class);
    }
}
