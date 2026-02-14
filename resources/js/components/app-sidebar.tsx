import { Link } from '@inertiajs/react';
import { BookOpen, Car, Folder, Layers, LayoutGrid, Tag, Type } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { index as vehiclesIndex } from '@/routes/vehicles';
import { index as makesIndex } from '@/routes/admin/makes';
import { index as modelsIndex } from '@/routes/admin/models';
import { index as categoriesIndex } from '@/routes/admin/categories';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Οχήματα',
        href: vehiclesIndex(),
        icon: Car,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Κατηγορίες',
        href: categoriesIndex(),
        icon: Layers,
    },
    {
        title: 'Μάρκες',
        href: makesIndex(),
        icon: Tag,
    },
    {
        title: 'Μοντέλα',
        href: modelsIndex(),
        icon: Type,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={adminNavItems} label="Διαχείριση" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
