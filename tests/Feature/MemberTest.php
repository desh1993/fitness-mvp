<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_be_created(): void
    {
        $user = User::factory()->create();

        $memberData = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ];

        $response = $this
            ->actingAs($user)
            ->post(route('members.store'), $memberData);

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Member created successfully.');

        $this->assertDatabaseHas('members', [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '1234567890',
            'date_of_birth' => '1990-01-15 00:00:00',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01 00:00:00',
        ]);
    }
}
