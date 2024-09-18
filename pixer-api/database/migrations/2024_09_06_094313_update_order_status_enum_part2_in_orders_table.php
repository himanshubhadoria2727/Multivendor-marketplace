<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the order_status column to include the new enum values
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM(
            'order-pending', 
            'order-waiting-approval',
            'order-accepted', 
            'order-rejected', 
            'order-submitted', 
            'order-improvement', 
            'order-processing', 
            'order-completed', 
            'order-approved', 
            'order-cancelled', 
            'order-refunded', 
            'order-failed', 
            'order-at-local-facility', 
            'order-out-for-delivery'
        ) DEFAULT 'order-pending';");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to the previous enum values (without the newly added ones)
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM(
            'order-pending', 
            'order-waiting-approval', 
            'order-processing', 
            'order-completed', 
            'order-approved', 
            'order-cancelled', 
            'order-refunded', 
            'order-failed', 
            'order-at-local-facility', 
            'order-out-for-delivery'
        ) DEFAULT 'order-pending';");
    }
};
