import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface FlashMessages {
    success?: string;
    error?: string;
}

export function useFlashToast(): void {
    const { flash } = usePage<{ flash: FlashMessages }>().props;
    const lastFlashRef = useRef<{ success?: string; error?: string }>({});

    useEffect(() => {
        if (flash?.success && flash.success !== lastFlashRef.current.success) {
            toast.success(flash.success);
            lastFlashRef.current.success = flash.success;
        }

        if (flash?.error && flash.error !== lastFlashRef.current.error) {
            toast.error(flash.error);
            lastFlashRef.current.error = flash.error;
        }
    }, [flash]);
}