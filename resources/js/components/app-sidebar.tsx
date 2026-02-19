import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    Car,
    Clock,
    HelpCircle,
    Layers,
    LayoutGrid,
    MapPin,
    Package,
    Percent,
    Receipt,
    Sun,
    Tag,
    TrendingUp,
    Type,
    UserCheck,
    Users,
} from 'lucide-react';
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
import { dashboard, guide } from '@/routes';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { index as customersIndex } from '@/routes/admin/customers';
import { index as extrasIndex } from '@/routes/admin/extras';
import { index as locationsIndex } from '@/routes/admin/locations';
import { index as makesIndex } from '@/routes/admin/makes';
import { index as modelsIndex } from '@/routes/admin/models';
import { index as ageSurchargesIndex } from '@/routes/admin/pricing/age-surcharges';
import { index as durationDiscountsIndex } from '@/routes/admin/pricing/duration-discounts';
import { index as feesIndex } from '@/routes/admin/pricing/fees';
import { index as timeAdjustmentsIndex } from '@/routes/admin/pricing/time-adjustments';
import { index as yieldRulesIndex } from '@/routes/admin/pricing/yield-rules';
import { index as seasonsIndex } from '@/routes/admin/seasons';
import { index as bookingsIndex } from '@/routes/bookings';
import { index as vehiclesIndex } from '@/routes/vehicles';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

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
    {
        title: 'Κρατήσεις',
        href: bookingsIndex(),
        icon: CalendarDays,
    },
    {
        title: 'Πελάτες',
        href: customersIndex(),
        icon: Users,
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
    {
        title: 'Τοποθεσίες',
        href: locationsIndex(),
        icon: MapPin,
    },
    {
        title: 'Extras',
        href: extrasIndex(),
        icon: Package,
    },
    {
        title: 'Σεζόν & Τιμές',
        href: seasonsIndex(),
        icon: Sun,
    },
];

const pricingNavItems: NavItem[] = [
    {
        title: 'Εκπτώσεις Διάρκειας',
        href: durationDiscountsIndex(),
        icon: Percent,
    },
    {
        title: 'Early Bird / Last Minute',
        href: timeAdjustmentsIndex(),
        icon: Clock,
    },
    {
        title: 'Χρεώσεις Ηλικίας',
        href: ageSurchargesIndex(),
        icon: UserCheck,
    },
    {
        title: 'Τέλη',
        href: feesIndex(),
        icon: Receipt,
    },
    {
        title: 'Yield Rules',
        href: yieldRulesIndex(),
        icon: TrendingUp,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Οδηγός Χρήσης',
        href: guide(),
        icon: HelpCircle,
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
                <NavMain items={pricingNavItems} label="Ρυθμίσεις Τιμολόγησης" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
