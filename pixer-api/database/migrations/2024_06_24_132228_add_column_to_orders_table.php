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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->string('ancor')->nullable();
            $table->string('postUrl')->nullable();
            $table->string('link_url')->nullable();
            $table->text('instructions')->nullable();
            $table->text('content')->nullable();
            $table->string('file')->nullable(); // Column for file path
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
