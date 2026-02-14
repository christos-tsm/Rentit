<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_category_id')->constrained();
            $table->foreignId('vehicle_model_id')->constrained();
            $table->string('plate_number')->unique();
            $table->integer('cc');
            $table->integer('seats');
            $table->integer('large_bags_capacity');
            $table->integer('small_bags_capacity');
            $table->integer('doors');
            $table->boolean('ac');
            $table->integer('gears');
            $table->integer('hp');
            $table->decimal('base_price');
            $table->string('vin')->unique()->nullable();
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid']);
            $table->enum('transmission', ['manual', 'automatic']);
            $table->enum('status', ['available', 'rented', 'maintenance', 'out_of_service'])->default('available');
            $table->integer('current_km')->default(0);
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
