<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Feature extends Model {
    protected $fillable = [];

    public function vehicles(): BelongsToMany {
        return $this->belongsToMany(Vehicle::class);
    }
}
