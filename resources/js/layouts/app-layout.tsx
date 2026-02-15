import { Toaster } from 'react-hot-toast';
import { useFlashToast } from '@/hooks/use-flash-toast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    useFlashToast();

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster />
            {children}
        </AppLayoutTemplate>
    );
}
