import Button from '@/Components/Button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Dumbbell, TrendingUp, Users } from 'lucide-react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="FitHub Manager - Fitness Centre Management" />
            <div className="dark min-h-screen bg-gray-900 text-gray-100">
                {/* Header */}
                <header className="border-b border-gray-800">
                    <div className="container mx-auto flex items-center justify-between px-4 py-4">
                        <div className="flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-indigo-500" />
                            <span className="text-xl font-bold">
                                FitHub Manager
                            </span>
                        </div>
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button
                                    variant="outline"
                                    className="bg-transparent hover:bg-indigo-600 hover:text-white"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('login')}>
                                <Button
                                    variant="outline"
                                    className="bg-transparent hover:bg-indigo-600 hover:text-white"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl space-y-6 text-center">
                        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                            Manage Your Fitness Centre with{' '}
                            <span className="text-indigo-500">Confidence</span>
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-400 md:text-xl">
                            Streamline member management, track memberships, and
                            grow your fitness business with our powerful admin
                            platform.
                        </p>
                        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                            <Link href={route('login')}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    Get Started
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full bg-transparent sm:w-auto"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <FeatureCard
                            icon={
                                <Users className="h-10 w-10 text-indigo-500" />
                            }
                            title="Member Management"
                            description="Easily add, edit, and manage all your gym members in one place."
                        />
                        <FeatureCard
                            icon={
                                <Calendar className="h-10 w-10 text-indigo-500" />
                            }
                            title="Membership Tracking"
                            description="Track membership status, expiration dates, and renewal reminders."
                        />
                        <FeatureCard
                            icon={
                                <TrendingUp className="h-10 w-10 text-indigo-500" />
                            }
                            title="Growth Insights"
                            description="Monitor your fitness centre's growth with powerful analytics."
                        />
                        <FeatureCard
                            icon={
                                <Dumbbell className="h-10 w-10 text-indigo-500" />
                            }
                            title="Quick Access"
                            description="Access member information quickly with search and filters."
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16 md:py-24">
                    <div className="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-8 text-center md:p-12">
                        <h2 className="text-3xl font-bold md:text-4xl">
                            Ready to Transform Your Fitness Centre?
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-400">
                            Join fitness centres worldwide using FitHub Manager
                            to streamline operations and deliver exceptional
                            member experiences.
                        </p>
                        <Link href={route('login')}>
                            <Button size="lg" className="mt-4">
                                Start Managing Today
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-gray-800">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="h-6 w-6 text-indigo-500" />
                                <span className="font-semibold">
                                    FitHub Manager
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">
                                © 2026 FitHub Manager. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-6 transition-colors hover:border-indigo-500/50">
            <div className="flex justify-center md:justify-start">{icon}</div>
            <h3 className="text-center text-xl font-semibold md:text-left">
                {title}
            </h3>
            <p className="text-center leading-relaxed text-gray-400 md:text-left">
                {description}
            </p>
        </div>
    );
}
