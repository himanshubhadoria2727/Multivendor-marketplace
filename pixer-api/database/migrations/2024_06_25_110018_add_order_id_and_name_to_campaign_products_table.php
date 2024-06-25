<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('campaign_products', function (Blueprint $table) {
        $table->unsignedBigInteger('order_id')->nullable()->after('product_id');
        $table->string('name')->after('order_id');
    });
}

public function down()
{
    Schema::table('campaign_products', function (Blueprint $table) {
        $table->dropColumn(['order_id', 'name']);
    });
}
};
