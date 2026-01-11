import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';
import { Dumbbell, LogOut, Menu, Settings, User, Users, X } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

const navigation = [
    {
        name: 'Members',
        href: route('members.index'),
        icon: Users,
        disabled: false,
        active: route().current('members.*'),
    },
    {
        name: 'Settings',
        href: route('dashboard'),
        icon: Settings,
        disabled: true,
        active: false,
    },
];

export default function DashboardLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="dark flex min-h-screen flex-col overflow-x-hidden bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-800">
                <div className="flex h-16 items-center gap-4 px-4 md:px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden"
                    >
                        {sidebarOpen ? (
                            <X className="h-6 w-6 text-purple-200" />
                        ) : (
                            <Menu className="h-6 w-6 text-purple-200" />
                        )}
                    </button>

                    <div className="flex items-center gap-2 text-xl font-bold text-purple-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        <span className="hidden sm:inline">FitManage</span>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative h-9 w-9 rounded-full">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                                        {getInitials(user.name)}
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content
                                align="right"
                                contentClasses="w-56 bg-gray-800 border-gray-700 py-2"
                            >
                                <div className="flex flex-col gap-1 px-4 py-2">
                                    <p className="text-sm font-medium text-purple-100">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-purple-300">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="border-t border-gray-700"></div>
                                <Dropdown.Link
                                    href={route('profile.edit')}
                                    className="flex items-center text-purple-200 hover:bg-gray-700 dark:hover:bg-gray-700"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center text-purple-200 hover:bg-gray-700 dark:hover:bg-gray-700"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    navigation={navigation}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main content */}
                <main className="min-h-full flex-1 bg-gray-900 p-4 md:p-6 lg:p-8">
                    {header && <div className="mb-6">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
