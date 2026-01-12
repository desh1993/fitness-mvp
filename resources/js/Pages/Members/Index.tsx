import AddMemberModal from '@/Components/AddMemberModal';
import Button from '@/Components/Button';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps as AppPageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    membership_type: 'basic' | 'premium' | 'student';
    status: 'active' | 'inactive';
    joined_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedMembers {
    data: Member[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface PageProps extends AppPageProps {
    members: PaginatedMembers;
    filters: {
        search: string;
        status: string;
    };
}

const columnHelper = createColumnHelper<Member>();

export default function Index() {
    const { members, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showAddModal, setShowAddModal] = useState(false);

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Name',
                cell: (info) => {
                    const member = info.row.original;
                    const initials = member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);
                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                                {initials}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                            </span>
                        </div>
                    );
                },
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => (
                    <span className="text-gray-600 dark:text-gray-400">
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('phone', {
                header: 'Phone',
                cell: (info) => (
                    <span className="text-gray-600 dark:text-gray-400">
                        {info.getValue() || 'N/A'}
                    </span>
                ),
            }),
            columnHelper.accessor('membership_type', {
                header: 'Membership',
                cell: (info) => {
                    const type = info.getValue();
                    const colors = {
                        premium: 'bg-indigo-600 text-white',
                        basic: 'bg-blue-600 text-white',
                        student: 'bg-green-600 text-white',
                    };
                    return (
                        <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[type] || 'bg-gray-600 text-white'}`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: (info) => {
                    const status = info.getValue();
                    const isActive = status === 'active';
                    return (
                        <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                isActive
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-500 text-white'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('joined_at', {
                header: 'Joined',
                cell: (info) => {
                    const date = info.getValue();
                    return (
                        <span className="text-gray-600 dark:text-gray-400">
                            {date ? new Date(date).toLocaleDateString() : 'N/A'}
                        </span>
                    );
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (info) => {
                    const member = info.row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            'Are you sure you want to delete this member?',
                                        )
                                    ) {
                                        router.delete(
                                            route('members.destroy', member.id),
                                        );
                                    }
                                }}
                                className="rounded-md p-2 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    );
                },
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: members.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: members.last_page,
        state: {
            pagination: {
                pageIndex: members.current_page - 1,
                pageSize: members.per_page,
            },
        },
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route('members.index'),
                    {
                        search: search,
                        status: status,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            route('members.index'),
            {
                search: search,
                status: value,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('members.index'),
            {
                page: page,
                search: search,
                status: status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout>
            <Head title="Members" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Members
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your fitness centre members
                        </p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-9 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-[180px] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Table - Desktop View */}
                <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No members found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="whitespace-nowrap px-6 py-4"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 md:hidden">
                    {table.getRowModel().rows.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">
                                No members found
                            </p>
                        </div>
                    ) : (
                        table.getRowModel().rows.map((row) => {
                            const member = row.original;
                            const initials = member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2);
                            const membershipColors = {
                                premium: 'bg-indigo-600 text-white',
                                basic: 'bg-blue-600 text-white',
                                student: 'bg-green-600 text-white',
                            };
                            const statusColors = {
                                active: 'bg-green-600 text-white',
                                inactive: 'bg-gray-500 text-white',
                            };

                            return (
                                <div
                                    key={row.id}
                                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                                                {initials}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {member.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        'Are you sure you want to delete this member?',
                                                    )
                                                ) {
                                                    router.delete(
                                                        route(
                                                            'members.destroy',
                                                            member.id,
                                                        ),
                                                    );
                                                }
                                            }}
                                            className="rounded-md p-2 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Phone
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {member.phone || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Membership
                                            </span>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    membershipColors[
                                                        member.membership_type
                                                    ] ||
                                                    'bg-gray-600 text-white'
                                                }`}
                                            >
                                                {member.membership_type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    member.membership_type.slice(
                                                        1,
                                                    )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Status
                                            </span>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    statusColors[
                                                        member.status
                                                    ] ||
                                                    'bg-gray-500 text-white'
                                                }`}
                                            >
                                                {member.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    member.status.slice(1)}
                                            </span>
                                        </div>
                                        {member.joined_at && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Joined
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(
                                                        member.joined_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {members.last_page > 1 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Results Info - Hidden on mobile, shown on desktop */}
                        <div className="hidden text-sm text-gray-600 sm:block dark:text-gray-400">
                            Showing {members.from} to {members.to} of{' '}
                            {members.total} results
                        </div>

                        {/* Mobile: Simple page indicator */}
                        <div className="text-center text-sm text-gray-600 sm:hidden dark:text-gray-400">
                            Page {members.current_page} of {members.last_page}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(members.current_page - 1)
                                }
                                disabled={members.current_page === 1}
                                className="flex-1 sm:flex-none"
                            >
                                Previous
                            </Button>

                            {/* Page Numbers - Hidden on mobile, shown on desktop */}
                            <div className="hidden items-center gap-1 sm:flex">
                                {Array.from(
                                    { length: members.last_page },
                                    (_, i) => i + 1,
                                )
                                    .filter((page) => {
                                        // Show first page, last page, current page, and pages around current
                                        const current = members.current_page;
                                        const total = members.last_page;
                                        return (
                                            page === 1 ||
                                            page === total ||
                                            (page >= current - 1 &&
                                                page <= current + 1)
                                        );
                                    })
                                    .map((page, index, array) => {
                                        // Add ellipsis if there's a gap
                                        const prevPage = array[index - 1];
                                        const showEllipsisBefore =
                                            prevPage && page - prevPage > 1;

                                        return (
                                            <div
                                                key={page}
                                                className="flex items-center gap-1"
                                            >
                                                {showEllipsisBefore && (
                                                    <span className="px-2 text-gray-500 dark:text-gray-400">
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                                                        members.current_page ===
                                                        page
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Mobile: Current page indicator */}
                            <div className="flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 sm:hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {members.current_page} / {members.last_page}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() =>
                                    handlePageChange(members.current_page + 1)
                                }
                                disabled={
                                    members.current_page === members.last_page
                                }
                                className="flex-1 sm:flex-none"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <AddMemberModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </DashboardLayout>
    );
}
