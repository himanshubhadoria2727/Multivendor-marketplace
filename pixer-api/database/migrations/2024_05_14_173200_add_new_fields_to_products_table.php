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
        Schema::table('products', function (Blueprint $table) {
        $table->double('domain_authority')->after('price');
        $table->double('domain_rating')->after('domain_authority');
        $table->double('organic_traffic')->after('domain_rating');
        $table->double('spam_score')->after('organic_traffic');
        $table->string('languages')->after('spam_score');
        $table->string('countries')->after('languages');
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
