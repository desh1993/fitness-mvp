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
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            $table->date('date_of_birth')->nullable();

            $table->enum('membership_type', ['basic', 'premium', 'student'])
                ->default('basic');

            $table->enum('status', ['active', 'inactive'])
                ->default('active');

            $table->date('joined_at')->nullable();

            $table->timestamps();

            // Helpful indexes (small but professional touch)
            $table->index('membership_type');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
