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
    Schema::create('email_verifications', function (Blueprint $table) {
        $table->id();
        $table->string('email');
        $table->string('token');
        $table->timestamp('created_at')->useCurrent();
    });
}

public function down()
{
    Schema::dropIfExists('email_verifications');
}
};