<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToPaymentGatewaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('payment_gateways', function (Blueprint $table) {
            // Add the 'amount' column
            $table->decimal('amount', 10, 2)->nullable();
            // Add the 'currency' column
            $table->string('currency')->nullable();
            // Add the 'receipt' column
            $table->string('receipt')->nullable();
            // Add the 'updated_at' and 'created_at' columns (for timestamps)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payment_gateways', function (Blueprint $table) {
            // Drop the added columns if the migration is rolled back
            $table->dropColumn(['amount', 'currency', 'receipt', 'updated_at', 'created_at']);
        });
    }
}
