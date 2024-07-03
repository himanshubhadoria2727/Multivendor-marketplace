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
            $table->renameColumn('product_price', 'price');
        });
    }
    
    public function down()
    {
        Schema::table('campaign_products', function (Blueprint $table) {
            $table->renameColumn('price', 'product_price');
        });
    }
};
