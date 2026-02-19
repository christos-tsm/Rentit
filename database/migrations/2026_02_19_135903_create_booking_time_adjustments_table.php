<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_time_adjustments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['early_bird', 'last_minute']);
            $table->integer('min_days_before');
            $table->integer('max_days_before')->nullable();
            $table->enum('adjustment_type', ['discount', 'surcharge']);
            $table->decimal('percentage', 5, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_time_adjustments');
    }
};
