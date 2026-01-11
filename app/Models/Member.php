<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'date_of_birth',
        'membership_type',
        'status',
        'joined_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'joined_at' => 'date',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeBasic($query)
    {
        return $query->where('membership_type', 'basic');
    }

    public function scopePremium($query)
    {
        return $query->where('membership_type', 'premium');
    }

    public function scopeStudent($query)
    {
        return $query->where('membership_type', 'student');
    }

    public function scopeJoinedAt($query, $date)
    {
        return $query->where('joined_at', $date);
    }
}
