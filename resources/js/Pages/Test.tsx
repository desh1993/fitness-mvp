import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    user: User;
    timestamp: string;
}

export default function Test() {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // First get CSRF cookie, then fetch user data
        axios
            .get('/sanctum/csrf-cookie')
            .then(() => {
                return axios.get<ApiResponse>('/api/user');
            })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(
                    err.response?.data?.message ||
                        'Failed to fetch user data',
                );
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout>
            <Head title="Test - Sanctum API" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Sanctum API Test
                            </h1>

                            {loading && (
                                <div className="text-gray-600 dark:text-gray-400">
                                    Loading user data...
                                </div>
                            )}

                            {error && (
                                <div className="rounded-md border border-red-900/50 bg-red-950/50 p-3 text-sm text-red-400">
                                    Error: {error}
                                </div>
                            )}

                            {data && (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-green-900/50 bg-green-950/50 p-3 text-sm text-green-400">
                                        API call successful!
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            User Information
                                        </h2>
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    ID:
                                                </span>{' '}
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {data.user.id}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Name:
                                                </span>{' '}
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {data.user.name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Email:
                                                </span>{' '}
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {data.user.email}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Email Verified:
                                                </span>{' '}
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {data.user.email_verified_at
                                                        ? 'Yes'
                                                        : 'No'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Timestamp:
                                                </span>{' '}
                                                <span className="text-gray-900 dark:text-gray-100">
                                                    {data.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
