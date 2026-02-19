<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->integer('driver_age')->nullable()->after('status');
            $table->text('notes')->nullable()->after('driver_age');
            $table->json('price_breakdown')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['driver_age', 'notes', 'price_breakdown']);
        });
    }
};
