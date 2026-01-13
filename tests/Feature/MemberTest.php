<?php

namespace Tests\Feature;

use App\Models\Member;
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

    public function test_member_can_be_updated(): void
    {
        $user = User::factory()->create();

        $member = Member::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ]);

        $updatedData = [
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+60198765432',
            'date_of_birth' => '1992-05-20',
            'membership_type' => 'basic',
            'status' => 'inactive',
            'joined_at' => '2024-02-01',
        ];

        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), $updatedData);

        $response
            ->assertRedirect(route('members.index'))
            ->assertSessionHas('success', 'Member updated successfully.');

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+60198765432',
            'date_of_birth' => '1992-05-20 00:00:00',
            'membership_type' => 'basic',
            'status' => 'inactive',
            'joined_at' => '2024-02-01 00:00:00',
        ]);

        $this->assertDatabaseMissing('members', [
            'id' => $member->id,
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_member_can_be_deleted(): void
    {
        $user = User::factory()->create();

        $member = Member::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('members.destroy', $member->id));

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Member deleted successfully.');

        $this->assertDatabaseMissing('members', [
            'id' => $member->id,
        ]);
    }

    public function test_member_update_requires_valid_data(): void
    {
        $user = User::factory()->create();

        $member = Member::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ]);

        // Test missing required fields
        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), [
                'name' => '',
                'email' => '',
                'membership_type' => '',
                'status' => '',
            ]);

        $response->assertSessionHasErrors(['name', 'email', 'membership_type', 'status']);

        // Test invalid email format
        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), [
                'name' => 'Jane Smith',
                'email' => 'invalid-email',
                'membership_type' => 'basic',
                'status' => 'active',
            ]);

        $response->assertSessionHasErrors(['email']);

        // Test invalid membership type
        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'membership_type' => 'invalid',
                'status' => 'active',
            ]);

        $response->assertSessionHasErrors(['membership_type']);

        // Test invalid status
        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'membership_type' => 'basic',
                'status' => 'invalid',
            ]);

        $response->assertSessionHasErrors(['status']);

        // Verify member was not updated
        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_member_update_allows_same_email_for_same_member(): void
    {
        $user = User::factory()->create();

        $member = Member::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ]);

        $updatedData = [
            'name' => 'John Doe Updated',
            'email' => 'john.doe@example.com', // Same email should be allowed
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'basic',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ];

        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member->id), $updatedData);

        $response
            ->assertRedirect(route('members.index'))
            ->assertSessionHas('success', 'Member updated successfully.');

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'name' => 'John Doe Updated',
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_member_update_rejects_duplicate_email_from_different_member(): void
    {
        $user = User::factory()->create();

        $member1 = Member::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+60123456789',
            'date_of_birth' => '1990-01-15',
            'membership_type' => 'premium',
            'status' => 'active',
            'joined_at' => '2024-01-01',
        ]);

        $member2 = Member::create([
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+60198765432',
            'date_of_birth' => '1992-05-20',
            'membership_type' => 'basic',
            'status' => 'active',
            'joined_at' => '2024-02-01',
        ]);

        // Try to update member2 with member1's email
        $response = $this
            ->actingAs($user)
            ->put(route('members.update', $member2->id), [
                'name' => 'Jane Smith',
                'email' => 'john.doe@example.com', // Duplicate email
                'phone' => '+60198765432',
                'date_of_birth' => '1992-05-20',
                'membership_type' => 'basic',
                'status' => 'active',
                'joined_at' => '2024-02-01',
            ]);

        $response->assertSessionHasErrors(['email']);

        // Verify member2 was not updated
        $this->assertDatabaseHas('members', [
            'id' => $member2->id,
            'email' => 'jane.smith@example.com',
        ]);
    }
}
