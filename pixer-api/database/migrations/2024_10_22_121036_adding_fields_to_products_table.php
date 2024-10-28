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
            // Adding new columns
            $table->string('link_validity')->after('domain_authority');
            $table->string('link_counts')->after('link_validity');
            $table->double('word_count')->after('link_counts');
            $table->double('tat')->after('word_count');
            $table->string('sponsored_marked')->after('tat');
            $table->string('other_guidelines')->after('sponsored_marked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Dropping the newly added columns
            $table->dropColumn(['link_validity', 'link_counts', 'word_count', 'tat', 'sponsored_marked', 'other_guidelines']);

        });
    }
};
