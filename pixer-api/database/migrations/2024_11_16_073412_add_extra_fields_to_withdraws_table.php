<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('withdraws', function (Blueprint $table) {
            $table->string('paypal_id')->nullable(); // For PayPal-specific field
            $table->string('bank_name')->nullable(); // For Bank-specific field
            $table->string('ifsc_code')->nullable(); // For Bank-specific field
            $table->string('account_number')->nullable(); // For Bank-specific field
            $table->string('account_holder_name')->nullable(); // For Bank-specific field
            $table->string('address'); // Address field
            $table->string('pincode'); // Pincode field
            $table->string('country')->nullable(); // Country field
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('withdraws', function (Blueprint $table) {
            $table->dropColumn([
                'paypal_id',
                'bank_name',
                'ifsc_code',
                'account_number',
                'account_holder_name',
                'address',
                'pincode',
                'country',
            ]);
        });
    }
};
