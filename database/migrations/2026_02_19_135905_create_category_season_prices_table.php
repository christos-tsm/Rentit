<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_season_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('season_id')->constrained()->cascadeOnDelete();
            $table->decimal('daily_rate', 10, 2);
            $table->timestamps();

            $table->unique(['vehicle_category_id', 'season_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_season_prices');
    }
};
