<?php

namespace App\Services;

use App\Models\Member;

class MemberService
{
    /**
     * Create a new member.
     */
    public function create(array $data): Member
    {
        return Member::create($data);
    }

    /**
     * Update an existing member.
     */
    public function update(Member $member, array $data): Member
    {
        $member->update($data);
        return $member->fresh();
    }

    /**
     * Delete a member.
     */
    public function delete(Member $member): void
    {
        $member->delete();
    }
}
