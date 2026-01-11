import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    disabled: boolean;
    active: boolean;
}

interface SidebarProps {
    navigation: NavigationItem[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
    navigation,
    sidebarOpen,
    setSidebarOpen,
}: SidebarProps) {
    return (
        <>
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 h-auto w-64 border-r border-gray-800 bg-gray-800 transition-transform duration-300 md:relative md:h-auto md:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'top-16 md:top-0',
                )}
            >
                <nav className="flex h-full flex-col gap-3 overflow-y-auto p-6">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.active;
                        return (
                            <Link
                                key={item.name}
                                href={item.disabled ? '#' : item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-purple-200 hover:bg-purple-900/50 hover:text-purple-100',
                                    item.disabled &&
                                        'cursor-not-allowed opacity-50 hover:bg-transparent',
                                )}
                                onClick={(e) => {
                                    if (item.disabled) {
                                        e.preventDefault();
                                    } else {
                                        setSidebarOpen(false);
                                    }
                                }}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                                {item.disabled && (
                                    <span className="ml-auto text-xs text-purple-400">
                                        (Coming soon)
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-900/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
