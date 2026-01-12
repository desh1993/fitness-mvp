<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use App\Services\MemberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function __construct(
        private MemberService $memberService
    ) {}

    /**
     * Display a listing of members.
     */
    public function index(): Response
    {
        $query = Member::query();

        // Search filter (name or email)
        if (request()->has('search') && request()->filled('search')) {
            $search = request()->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if (request()->has('status') && request()->filled('status')) {
            $status = request()->get('status');
            if (in_array($status, ['active', 'inactive'])) {
                $query->where('status', $status);
            }
        }

        // Pagination with consistent ordering
        $perPage = request()->get('per_page', 10);
        $members = $query
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Members/Index', [
            'members' => $members,
            'filters' => [
                'search' => request()->get('search', ''),
                'status' => request()->get('status', ''),
            ],
        ]);
    }

    /**
     * Display the specified member.
     */
    public function show(Member $member): Response
    {
        return Inertia::render('Members/Show', [
            'member' => $member,
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(StoreMemberRequest $request): RedirectResponse
    {
        $this->memberService->create($request->validated());

        return Redirect::back()->with('success', 'Member created successfully.');
    }

    /**
     * Update the specified member.
     */
    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $this->memberService->update($member, $request->validated());

        return Redirect::route('members.index')->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified member.
     */
    public function destroy(Member $member): RedirectResponse
    {
        $this->memberService->delete($member);

        return Redirect::back()->with('success', 'Member deleted successfully.');
    }

    /**
     * Check if a member exists with the given field value.
     */
    public function checkExists(): JsonResponse
    {
        $field = request()->input('field');
        $value = request()->input('value');
        $excludeId = request()->input('exclude_id');

        if (!in_array($field, ['name', 'email', 'phone'])) {
            return response()->json(['exists' => false], 400);
        }

        // Special handling for phone field
        if ($field === 'phone') {
            // Validate Malaysian phone format: +60 followed by 9-10 digits
            $isValidFormat = preg_match('/^\+60[0-9]{9,10}$/', $value);

            if (!$isValidFormat) {
                return response()->json([
                    'valid' => false,
                    'exists' => false,
                    'message' => 'Phone must be in Malaysian format: +60XXXXXXXXX',
                ]);
            }

            // Check if phone exists in database, excluding current member if editing
            $query = Member::where('phone', $value);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $exists = $query->exists();

            return response()->json([
                'valid' => true,
                'exists' => $exists,
            ]);
        }

        // For name and email, exclude current member if editing
        $query = Member::where($field, $value);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        $exists = $query->exists();

        return response()->json(['exists' => $exists]);
    }
}
