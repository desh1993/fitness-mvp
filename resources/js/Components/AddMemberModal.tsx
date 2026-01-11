import Button from '@/Components/Button';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

interface AddMemberModalProps {
    show: boolean;
    onClose: () => void;
}

export default function AddMemberModal({ show, onClose }: AddMemberModalProps) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/d7ceac55-29e9-45a6-a2b6-5afc0527d56c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: 'AddMemberModal.tsx:42',
            message: 'Component render - before useForm',
            data: { show },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A',
        }),
    }).catch(() => {});
    // #endregion
    const [checkingName, setCheckingName] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [checkingPhone, setCheckingPhone] = useState(false);
    const [nameExists, setNameExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
        clearErrors,
        watch,
        getValues,
    } = useForm<MemberFormData>({
        resolver: zodResolver(memberSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone_digits: '',
            phone: '',
            date_of_birth: '',
            membership_type: 'basic',
            status: 'active',
        },
    });

    // #region agent log
    const nameValue = watch('name');
    fetch('http://127.0.0.1:7243/ingest/d7ceac55-29e9-45a6-a2b6-5afc0527d56c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            location: 'AddMemberModal.tsx:68',
            message: 'watch(name) called',
            data: {
                nameValue,
                nameValueType: typeof nameValue,
                nameValueLength: nameValue?.length,
                getValuesName: getValues('name'),
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A',
        }),
    }).catch(() => {});
    // #endregion
    const emailValue = watch('email');

    // Clear errors when modal opens
    useEffect(() => {
        if (show) {
            clearErrors();
            setNameExists(false);
            setEmailExists(false);
            setPhoneInvalid(false);
        }
    }, [show, clearErrors]);

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
            console.log('name', name);
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
        console.log(data);
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

        // Fix: Use router from @inertiajs/react instead of undefined variable or Inertia
        router.post(route('members.store'), submitData, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setEmailExists(false);
                setPhoneInvalid(false);
                toast.success('Member created successfully');
                onClose();
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

    const handleClose = () => {
        // #region agent log
        fetch(
            'http://127.0.0.1:7243/ingest/d7ceac55-29e9-45a6-a2b6-5afc0527d56c',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: 'AddMemberModal.tsx:185',
                    message: 'handleClose called - reset() will be called',
                    data: { nameValueBeforeReset: watch('name') },
                    timestamp: Date.now(),
                    sessionId: 'debug-session',
                    runId: 'run1',
                    hypothesisId: 'D',
                }),
            },
        ).catch(() => {});
        // #endregion
        reset();
        setNameExists(false);
        setEmailExists(false);
        setPhoneInvalid(false);
        clearErrors();
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <h2 className="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
                    Add New Member
                </h2>

                <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        {(() => {
                            // #region agent log
                            const nameRegister = register('name');

                            // #endregion
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

                                        // Clear validation error if field has value
                                        if (name && name.trim().length > 0) {
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
                                        if (value && value.trim().length > 0) {
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
                            // #region agent log
                            const emailRegister = register('email');

                            // #endregion
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
                                        if (email && email.trim().length > 0) {
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
                                        if (value && value.trim().length > 0) {
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
                                    const value = (e.target as HTMLInputElement)
                                        .value;
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
                        onClick={handleClose}
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
                        {isSubmitting ? 'Creating...' : 'Create Member'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
