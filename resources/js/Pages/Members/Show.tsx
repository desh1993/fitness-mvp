import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps as AppPageProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const memberSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must not exceed 255 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(255, 'Email must not exceed 255 characters'),
    phone_digits: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[0-9]{9,10}$/.test(val),
            'Phone must be 9-10 digits',
        ),
    phone: z.string().optional(),
    date_of_birth: z.string().optional(),
    membership_type: z.enum(['basic', 'premium', 'student']),
    status: z.enum(['active', 'inactive']),
});

type MemberFormData = z.infer<typeof memberSchema>;

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

interface PageProps extends AppPageProps {
    member: Member;
}

export default function Show() {
    const { member } = usePage<PageProps>().props;
    const [checkingName, setCheckingName] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkingPhone, setCheckingPhone] = useState(false);
    const [nameExists, setNameExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);

    // Extract phone digits from +60XXXXXXXXX format
    const extractPhoneDigits = (phone: string | null): string => {
        if (!phone) return '';
        if (phone.startsWith('+60')) {
            return phone.substring(3);
        }
        return phone;
    };

    // Format date for input field (YYYY-MM-DD)
    const formatDateForInput = (date: string | null): string => {
        if (!date) return '';
        try {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    const defaultValues = useMemo(
        () => ({
            name: member.name || '',
            email: member.email || '',
            phone_digits: extractPhoneDigits(member.phone),
            phone: member.phone || '',
            date_of_birth: formatDateForInput(member.date_of_birth),
            membership_type: member.membership_type || 'basic',
            status: member.status || 'active',
        }),
        [member],
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        watch,
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues,
    });

    const nameValue = watch('name');
    const emailValue = watch('email');

    // Clear name exists error when user starts typing
    useEffect(() => {
        if (nameValue && nameExists) {
            setNameExists(false);
        }
    }, [nameValue, nameExists]);

    // Clear email exists error when user starts typing
    useEffect(() => {
        if (emailValue && emailExists) {
            setEmailExists(false);
        }
    }, [emailValue, emailExists]);

    const checkNameExists = async (name: string) => {
        if (!name || name.trim().length === 0) {
            return;
        }

        setCheckingName(true);
        try {
            const response = await axios.post(route('members.check'), {
                field: 'name',
                value: name,
                exclude_id: member.id,
            });

            if (response.data.exists) {
                setNameExists(true);
                setError('name', {
                    type: 'manual',
                    message: 'A member with this name already exists',
                });
            } else {
                setNameExists(false);
                clearErrors('name');
            }
        } catch (error) {
            console.error('Error checking name:', error);
        } finally {
            setCheckingName(false);
        }
    };

    const checkEmailExists = async (email: string) => {
        if (!email || email.trim().length === 0) {
            return;
        }

        setCheckingEmail(true);
        try {
            const response = await axios.post(route('members.check'), {
                field: 'email',
                value: email,
                exclude_id: member.id,
            });

            if (response.data.exists) {
                setEmailExists(true);
                setError('email', {
                    type: 'manual',
                    message: 'A member with this email already exists',
                });
            } else {
                setEmailExists(false);
                clearErrors('email');
            }
        } catch (error) {
            console.error('Error checking email:', error);
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleNameBlur = (name: string) => {
        if (name && name.trim().length > 0) {
            checkNameExists(name);
        }
    };

    const handleEmailBlur = (email: string) => {
        if (email && email.trim().length > 0) {
            checkEmailExists(email);
        }
    };

    const checkPhoneNumber = async (phoneDigits: string) => {
        if (!phoneDigits || phoneDigits.trim().length === 0) {
            return;
        }

        const fullPhone = `+60${phoneDigits}`;

        setCheckingPhone(true);
        try {
            const response = await axios.post(route('members.check'), {
                field: 'phone',
                value: fullPhone,
                exclude_id: member.id,
            });

            if (!response.data.valid) {
                setPhoneInvalid(true);
                setError('phone_digits', {
                    type: 'manual',
                    message:
                        response.data.message ||
                        'Invalid Malaysian phone number',
                });
            } else if (response.data.exists) {
                setPhoneInvalid(true);
                setError('phone_digits', {
                    type: 'manual',
                    message: 'A member with this phone number already exists',
                });
            } else {
                setPhoneInvalid(false);
                clearErrors('phone_digits');
            }
        } catch (error) {
            console.error('Error checking phone:', error);
            setPhoneInvalid(true);
            setError('phone_digits', {
                type: 'manual',
                message: 'Error validating phone number',
            });
        } finally {
            setCheckingPhone(false);
        }
    };

    const handlePhoneBlur = (phoneDigits: string) => {
        if (phoneDigits && phoneDigits.trim().length > 0) {
            checkPhoneNumber(phoneDigits);
        }
    };

    const onSubmit = (data: MemberFormData) => {
        // Check if name, email, or phone is invalid before submitting
        if (nameExists || emailExists || phoneInvalid) {
            return;
        }

        // Transform phone_digits to phone
        const { phone_digits, ...restData } = data;
        const submitData = {
            ...restData,
            phone: phone_digits ? `+60${phone_digits}` : '',
        };

        router.put(route('members.update', member.id), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Member updated successfully');
                router.visit(route('members.index'));
            },
            onError: (errors) => {
                // Handle server-side validation errors
                Object.keys(errors).forEach((key) => {
                    setError(key as keyof MemberFormData, {
                        type: 'server',
                        message: errors[key],
                    });
                });
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Edit Member" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Edit Member
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Update member information
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            {(() => {
                                const nameRegister = register('name');
                                return (
                                    <TextInput
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        {...nameRegister}
                                        onBlur={(e) => {
                                            nameRegister.onBlur(e);
                                            const name = (
                                                e.target as HTMLInputElement
                                            ).value;
                                            console.log('name', name);
                                            // Clear validation error if field has value
                                            if (
                                                name &&
                                                name.trim().length > 0
                                            ) {
                                                clearErrors('name');
                                            }

                                            handleNameBlur(name);
                                        }}
                                        onChange={(e) => {
                                            nameRegister.onChange(e);
                                            // Clear validation error as user types
                                            const value = (
                                                e.target as HTMLInputElement
                                            ).value;
                                            if (
                                                value &&
                                                value.trim().length > 0
                                            ) {
                                                clearErrors('name');
                                            }
                                        }}
                                        disabled={checkingName}
                                    />
                                );
                            })()}
                            {checkingName && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Checking...
                                </p>
                            )}
                            <InputError
                                message={errors.name?.message}
                                className="mt-2"
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            {(() => {
                                const emailRegister = register('email');
                                return (
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        {...emailRegister}
                                        onBlur={(e) => {
                                            emailRegister.onBlur(e);
                                            const email = (
                                                e.target as HTMLInputElement
                                            ).value;

                                            // Clear validation error if field has value
                                            if (
                                                email &&
                                                email.trim().length > 0
                                            ) {
                                                clearErrors('email');
                                            }

                                            handleEmailBlur(email);
                                        }}
                                        onChange={(e) => {
                                            emailRegister.onChange(e);
                                            // Clear validation error as user types
                                            const value = (
                                                e.target as HTMLInputElement
                                            ).value;
                                            if (
                                                value &&
                                                value.trim().length > 0
                                            ) {
                                                clearErrors('email');
                                            }
                                        }}
                                        disabled={checkingEmail}
                                    />
                                );
                            })()}
                            {checkingEmail && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Checking...
                                </p>
                            )}
                            <InputError
                                message={errors.email?.message}
                                className="mt-2"
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <InputLabel htmlFor="phone_digits" value="Phone" />
                            <div className="mt-1 flex gap-2">
                                <TextInput
                                    id="phone_prefix"
                                    type="text"
                                    value="+60"
                                    readOnly
                                    disabled
                                    className="w-20 flex-shrink-0 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                                />
                                <TextInput
                                    id="phone_digits"
                                    type="tel"
                                    className="flex-1"
                                    placeholder="1234567890"
                                    {...register('phone_digits')}
                                    onBlur={(e) => {
                                        const phoneDigits = (
                                            e.target as HTMLInputElement
                                        ).value;

                                        // Clear validation error if field has value
                                        if (
                                            phoneDigits &&
                                            phoneDigits.trim().length > 0
                                        ) {
                                            clearErrors('phone_digits');
                                        }

                                        handlePhoneBlur(phoneDigits);
                                    }}
                                    onChange={(e) => {
                                        register('phone_digits').onChange(e);
                                        // Clear validation error as user types
                                        const value = (
                                            e.target as HTMLInputElement
                                        ).value;
                                        if (value && value.trim().length > 0) {
                                            clearErrors('phone_digits');
                                            setPhoneInvalid(false);
                                        }
                                    }}
                                    disabled={checkingPhone}
                                />
                            </div>
                            {checkingPhone && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Checking...
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Malaysian format: +60XXXXXXXXX
                            </p>
                            <InputError
                                message={errors.phone_digits?.message}
                                className="mt-2"
                            />
                        </div>

                        {/* Date of Birth Field */}
                        <div>
                            <InputLabel
                                htmlFor="date_of_birth"
                                value="Date of Birth"
                            />
                            <TextInput
                                id="date_of_birth"
                                type="date"
                                className="mt-1 block w-full"
                                {...register('date_of_birth')}
                            />
                            <InputError
                                message={errors.date_of_birth?.message}
                                className="mt-2"
                            />
                        </div>

                        {/* Membership Type Field */}
                        <div>
                            <InputLabel
                                htmlFor="membership_type"
                                value="Membership Type"
                            />
                            <select
                                id="membership_type"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                {...register('membership_type')}
                            >
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="student">Student</option>
                            </select>
                            <InputError
                                message={errors.membership_type?.message}
                                className="mt-2"
                            />
                        </div>

                        {/* Status Field */}
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                {...register('status')}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <InputError
                                message={errors.status?.message}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit(route('members.index'))}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                nameExists ||
                                emailExists ||
                                phoneInvalid
                            }
                        >
                            {isSubmitting ? 'Updating...' : 'Update Member'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
