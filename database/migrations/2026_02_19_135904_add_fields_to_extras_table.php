<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('extras', function (Blueprint $table) {
            $table->enum('type', ['per_day', 'per_rental'])->default('per_day')->after('price_per_day');
            $table->string('description')->nullable()->after('type');
            $table->boolean('is_active')->default(true)->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('extras', function (Blueprint $table) {
            $table->dropColumn(['type', 'description', 'is_active']);
        });
    }
};
