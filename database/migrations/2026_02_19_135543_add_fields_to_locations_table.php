<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->string('email')->nullable()->after('address');
            $table->string('phone')->nullable()->after('email');
            $table->string('coordinates')->nullable()->after('phone');
            $table->string('operating_hours')->nullable()->after('coordinates');
            $table->enum('type', ['airport', 'office', 'hotel', 'port', 'other'])->default('office')->after('operating_hours');
            $table->boolean('is_active')->default(true)->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['email', 'phone', 'coordinates', 'operating_hours', 'type', 'is_active']);
        });
    }
};
