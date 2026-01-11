import {
    forwardRef,
    InputHTMLAttributes,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean }
>(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef<HTMLInputElement | null>(
        null,
    ) as MutableRefObject<HTMLInputElement | null>;

    // Callback ref to merge forwarded ref with local ref
    const setRefs = (element: HTMLInputElement | null) => {
        localRef.current = element as HTMLInputElement;
        if (typeof ref === 'function') {
            ref(element);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                element;
        }
    };

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement, []);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                className
            }
            ref={setRefs}
        />
    );
});
