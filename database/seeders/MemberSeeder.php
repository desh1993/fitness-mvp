<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Log::info('MemberSeeder: Starting to seed members');

        $membershipTypes = ['basic', 'premium', 'student'];
        $statuses = ['active', 'inactive'];

        for ($i = 0; $i < 100; $i++) {
            Member::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->boolean(80) ? fake()->phoneNumber() : null,
                'date_of_birth' => fake()->boolean(70) ? fake()->dateTimeBetween('-65 years', '-18 years')->format('Y-m-d') : null,
                'membership_type' => fake()->randomElement($membershipTypes),
                'status' => fake()->randomElement($statuses),
                'joined_at' => fake()->boolean(90) ? fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d') : null,
            ]);
        }

        Log::info('MemberSeeder: Completed seeding 30 members');
    }
}
