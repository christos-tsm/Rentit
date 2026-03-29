import { dashboard, login, register, home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from '../app-logo';
import { LayoutPanelTop, User, UserPlus } from 'lucide-react';

const CommercialHeader = ({ canRegister }: { canRegister: boolean }) => {
    const { auth } = usePage().props;

    return (
        <header className="border-b border-b-gray-200">
            <div className="flex container mx-auto">
                <div className="flex-1 border-l border-l-gray-200 px-4 py-4 flex gap-5 items-center">
                    <Link href={home()} className="flex items-center gap-2">
                        <AppLogo />
                    </Link>
                    <nav className="">
                        <ul className="flex gap-5 items-center text-sm font-bold">
                            <li><Link href={'#!'}>Σχετικά</Link></li>
                            <li><Link href={'#!'}>Πλατφόρμα</Link></li>
                            <li><Link href={'#!'}>Επικοινωνία</Link></li>
                        </ul>
                    </nav>
                </div>
                <nav className="flex items-center justify-end gap-4 text-sm font-bold border-l border-r border-gray-200 px-4">
                    {auth.user ? (
                        <Link href={dashboard()} className="inline-flex gap-1 items-center text-primary ">
                            <LayoutPanelTop size={18} />
                            Πίνακας ελέγχου
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="inline-flex gap-1 items-center">
                                <User size={18} />
                                Σύνδεση
                            </Link>
                            {canRegister && (
                                <Link href={register()} className="bg-primary text-primary-foreground rounded-xl px-4 py-2 inline-flex gap-2 items-center">
                                    <UserPlus size={18} />
                                    Εγγραφή
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default CommercialHeader