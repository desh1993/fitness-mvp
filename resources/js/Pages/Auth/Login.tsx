import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4">
            <Head title="Log in" />

            <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                {/* Card Header */}
                <div className="space-y-1 p-6 pb-4 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
                            <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        Welcome to FitHub Manager
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-4 p-6 pt-0">
                        {status && (
                            <div className="rounded-md border border-green-900/50 bg-green-950/50 p-3 text-sm text-green-400">
                                {status}
                            </div>
                        )}

                        {errors.email && (
                            <div className="rounded-md border border-red-900/50 bg-red-950/50 p-3 text-sm text-red-400">
                                {errors.email}
                            </div>
                        )}

                        {errors.password && (
                            <div className="rounded-md border border-red-900/50 bg-red-950/50 p-3 text-sm text-red-400">
                                {errors.password}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-zinc-200"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                disabled={processing}
                                placeholder="name@example.com"
                                className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-zinc-200"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    disabled={processing}
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 pr-10 text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
                                    disabled={processing}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData(
                                            'remember',
                                            (e.target.checked ||
                                                false) as false,
                                        )
                                    }
                                    disabled={processing}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 disabled:opacity-50"
                                />
                                <label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-zinc-300"
                                >
                                    Remember me
                                </label>
                            </div>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-500 hover:text-indigo-400 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 p-6 pt-0">
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                            disabled={processing}
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <p className="text-center text-sm text-zinc-400">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="text-indigo-500 hover:text-indigo-400 hover:underline"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
