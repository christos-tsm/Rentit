import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    Car,
    CheckCircle2,
    ChevronDown,
    DollarSign,
    Layers,
    ListChecks,
    MapPin,
    Package,
    Sun,
    Tag,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { guide } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Οδηγός Χρήσης', href: guide().url },
];

function Accordion({ title, icon: Icon, children, defaultOpen = false }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <Card className="py-0 gap-0">
            <button
                type="button"
                className="flex w-full items-center gap-3 px-6 py-4 text-left"
                onClick={() => setOpen(!open)}
            >
                <Icon className="size-5 shrink-0 text-primary" />
                <span className="flex-1 text-base font-semibold">{title}</span>
                <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <CardContent className="border-t py-4">{children}</CardContent>}
        </Card>
    );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
    return (
        <div className="flex gap-3 items-start">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{n}</span>
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}

function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div className="my-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            <strong>Tip:</strong> {children}
        </div>
    );
}

function Example({ children }: { children: React.ReactNode }) {
    return (
        <div className="my-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <strong>Παράδειγμα:</strong> {children}
        </div>
    );
}

export default function GuidePage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Οδηγός Χρήσης" />
            <div className=" px-6 py-6 space-y-6">
                <Heading
                    title="Οδηγός Χρήσης"
                    description="Βήμα-βήμα οδηγίες για τη διαχείριση της πλατφόρμας ενοικίασης οχημάτων."
                />

                <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 dark:border-green-800 dark:bg-green-950">
                    <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-200">
                        <ListChecks className="size-5" />
                        Σειρά αρχικής ρύθμισης
                    </h3>
                    <ol className="mt-2 ml-7 list-decimal text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>Δημιουργήστε <strong>Κατηγορίες</strong> οχημάτων (π.χ. Economy, SUV)</li>
                        <li>Προσθέστε <strong>Μάρκες</strong> και <strong>Μοντέλα</strong></li>
                        <li>Καταχωρίστε τα <strong>Οχήματα</strong></li>
                        <li>Προσθέστε <strong>Τοποθεσίες</strong> παραλαβής/παράδοσης</li>
                        <li>Ρυθμίστε <strong>Σεζόν &amp; Τιμές</strong></li>
                        <li>Διαμορφώστε <strong>Εκπτώσεις, Τέλη, Extras</strong></li>
                        <li>Καταχωρίστε <strong>Πελάτες</strong> και δημιουργήστε <strong>Κρατήσεις</strong></li>
                    </ol>
                </div>

                <div className="space-y-4">

                    <Accordion title="1. Κατηγορίες Οχημάτων" icon={Layers} defaultOpen>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Οι κατηγορίες ομαδοποιούν τα οχήματα και καθορίζουν τη βασική τιμή ημέρας (αν δεν υπάρχει σεζόν).
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    Πλοηγηθείτε στο <strong>Διαχείριση &rarr; Κατηγορίες</strong>
                                </Step>
                                <Step n={2}>
                                    Πατήστε <Badge variant="outline">Νέα κατηγορία</Badge> και συμπληρώστε: <em>Όνομα</em>, <em>Περιγραφή</em>, <em>Βασική τιμή/ημέρα</em>
                                </Step>
                                <Step n={3}>
                                    Αποθηκεύστε. Η κατηγορία εμφανίζεται αμέσως στον πίνακα.
                                </Step>
                            </div>
                            <Example>
                                Κατηγορία <strong>Economy</strong> με βασική τιμή 35&euro;/ημέρα, <strong>SUV</strong> με 85&euro;/ημέρα.
                            </Example>
                            <Tip>
                                Η βασική τιμή χρησιμοποιείται μόνο αν μια ημερομηνία δεν ανήκει σε καμία σεζόν.
                                Μόλις ρυθμίσετε σεζόν, θα υπερισχύουν.
                            </Tip>
                        </div>
                    </Accordion>

                    <Accordion title="2. Μάρκες & Μοντέλα" icon={Tag}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Δημιουργήστε πρώτα μάρκες (π.χ. Toyota) και μετά μοντέλα (π.χ. Yaris) κάτω από κάθε μάρκα.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Διαχείριση &rarr; Μάρκες</strong>: Πατήστε <Badge variant="outline">Νέα μάρκα</Badge>, δώστε όνομα (π.χ. "Toyota")
                                </Step>
                                <Step n={2}>
                                    <strong>Διαχείριση &rarr; Μοντέλα</strong>: Πατήστε <Badge variant="outline">Νέο μοντέλο</Badge>, επιλέξτε μάρκα και δώστε όνομα (π.χ. "Yaris")
                                </Step>
                            </div>
                            <Example>
                                Μάρκα: <strong>Toyota</strong> &rarr; Μοντέλα: <strong>Yaris</strong>, <strong>Corolla</strong>, <strong>RAV4</strong>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="3. Οχήματα" icon={Car}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Κάθε όχημα ανήκει σε μια κατηγορία και ένα μοντέλο. Μπορείτε να καταχωρίσετε πινακίδα, κυβικά, καύσιμο, κιβώτιο κ.λπ.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    Πλοηγηθείτε στο <strong>Οχήματα</strong> από το κεντρικό μενού
                                </Step>
                                <Step n={2}>
                                    Πατήστε <Badge variant="outline">Νέο όχημα</Badge> και συμπληρώστε τα στοιχεία: κατηγορία, μοντέλο, πινακίδα, κατάσταση κ.λπ.
                                </Step>
                            </div>
                            <Tip>
                                Η <strong>κατάσταση</strong> (available, rented, maintenance, out_of_service) επηρεάζει τη διαθεσιμότητα και τα yield rules.
                            </Tip>
                        </div>
                    </Accordion>

                    <Accordion title="4. Τοποθεσίες" icon={MapPin}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Σημεία παραλαβής και παράδοσης. Ο τύπος (αεροδρόμιο, γραφείο, κλπ.) επηρεάζει αυτόματα τα τέλη.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Διαχείριση &rarr; Τοποθεσίες</strong> &rarr; <Badge variant="outline">Νέα τοποθεσία</Badge>
                                </Step>
                                <Step n={2}>
                                    Συμπληρώστε: Όνομα, Τύπος (Αεροδρόμιο / Γραφείο / Ξενοδοχείο / Λιμάνι / Άλλο), Διεύθυνση, Email, Τηλέφωνο, Ωράριο
                                </Step>
                            </div>
                            <Example>
                                Τοποθεσία <strong>"Αεροδρόμιο Ηρακλείου"</strong>, τύπος: <Badge>Αεροδρόμιο</Badge> &rarr;
                                Αν κάποιος παραλάβει εδώ, θα χρεωθεί αυτόματα τέλος αεροδρομίου (αν έχετε ρυθμίσει).
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="5. Σεζόν & Τιμές" icon={Sun}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Οι σεζόν καθορίζουν τις τιμές ανά κατηγορία. Μπορείτε να δημιουργήσετε <strong>επαναλαμβανόμενες</strong>
                                (κάθε χρόνο) ή <strong>μοναδικές</strong> (για συγκεκριμένο έτος).
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Διαχείριση &rarr; Σεζόν &amp; Τιμές</strong> &rarr; <Badge variant="outline">Νέα σεζόν</Badge>
                                </Step>
                                <Step n={2}>
                                    Δώστε όνομα (π.χ. "High Season"), ημερομηνίες, <em>Επαναλαμβανόμενη</em> (τσεκ αν θέλετε να ισχύει κάθε χρόνο), και <em>Προτεραιότητα</em>
                                </Step>
                                <Step n={3}>
                                    Στον πίνακα <strong>Τιμές ανά Κατηγορία / Σεζόν</strong> κάτω, συμπληρώστε την ημερήσια τιμή για κάθε κατηγορία. Αποθηκεύεται αυτόματα.
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 overflow-x-auto">
                                    <table className="text-xs border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border px-2 py-1 bg-muted">Κατηγορία</th>
                                                <th className="border px-2 py-1 bg-muted">Low Season (Νοε-Μαρ)</th>
                                                <th className="border px-2 py-1 bg-muted">Mid Season (Απρ-Μαϊ)</th>
                                                <th className="border px-2 py-1 bg-muted">High Season (Ιουν-Σεπ)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border px-2 py-1">Economy</td>
                                                <td className="border px-2 py-1">25&euro;</td>
                                                <td className="border px-2 py-1">35&euro;</td>
                                                <td className="border px-2 py-1">50&euro;</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-2 py-1">SUV</td>
                                                <td className="border px-2 py-1">55&euro;</td>
                                                <td className="border px-2 py-1">75&euro;</td>
                                                <td className="border px-2 py-1">100&euro;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Example>
                            <Tip>
                                Αν μια σεζόν <strong>per-year</strong> (μη επαναλαμβανόμενη) επικαλύπτεται με μια επαναλαμβανόμενη,
                                κερδίζει αυτή με τη μεγαλύτερη <strong>Προτεραιότητα</strong>.
                            </Tip>
                        </div>
                    </Accordion>

                    <Accordion title="6. Εκπτώσεις Διάρκειας" icon={DollarSign}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Κλιμακωτές εκπτώσεις βάσει διάρκειας ενοικίασης. Εφαρμόζονται αυτόματα στο σύνολο.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Ρυθμίσεις Τιμολόγησης &rarr; Εκπτώσεις Διάρκειας</strong>
                                </Step>
                                <Step n={2}>
                                    Δημιουργήστε κανόνες: ελάχιστες ημέρες, μέγιστες ημέρες, ποσοστό έκπτωσης
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 space-y-1">
                                    <div>1-3 ημέρες &rarr; <strong>0%</strong> (κανονική τιμή)</div>
                                    <div>4-7 ημέρες &rarr; <strong>-10%</strong></div>
                                    <div>8+ ημέρες &rarr; <strong>-20%</strong></div>
                                </div>
                            </Example>
                            <Tip>
                                Αφήστε το "Μέγ. ημέρες" κενό για απεριόριστο (π.χ. "8+" ημέρες).
                            </Tip>
                        </div>
                    </Accordion>

                    <Accordion title="7. Early Bird / Last Minute" icon={CalendarDays}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Προσαρμογές τιμής βάσει του πόσο νωρίς/αργά γίνεται η κράτηση σε σχέση με την παραλαβή.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Ρυθμίσεις Τιμολόγησης &rarr; Early Bird / Last Minute</strong>
                                </Step>
                                <Step n={2}>
                                    Επιλέξτε τύπο (Early Bird ή Last Minute), ελάχιστες/μέγιστες ημέρες πριν, τύπο προσαρμογής (Έκπτωση/Προσαύξηση) και ποσοστό
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 space-y-1">
                                    <div><strong>Early Bird</strong>: Κράτηση 90+ ημέρες πριν &rarr; -10% έκπτωση</div>
                                    <div><strong>Last Minute</strong>: Κράτηση 0-3 ημέρες πριν &rarr; +15% προσαύξηση</div>
                                </div>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="8. Χρεώσεις Ηλικίας Οδηγού" icon={UserCheck}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Προσαύξηση για νέους (&lt;25) ή ηλικιωμένους (&gt;70) οδηγούς λόγω υψηλότερων ασφαλίστρων.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Ρυθμίσεις Τιμολόγησης &rarr; Χρεώσεις Ηλικίας</strong>
                                </Step>
                                <Step n={2}>
                                    Ορίστε εύρος ηλικίας, τύπο χρέωσης (σταθερό ποσό ή ποσοστό) και ποσό
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 space-y-1">
                                    <div>Ηλικία 18-25 &rarr; <strong>+30&euro;</strong> σταθερό</div>
                                    <div>Ηλικία 70-99 &rarr; <strong>+10%</strong> επί του βασικού</div>
                                </div>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="9. Τέλη (Fees)" icon={DollarSign}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Σταθερά τέλη ή τέλη ανά ημέρα που εφαρμόζονται υπό συνθήκες.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Ρυθμίσεις Τιμολόγησης &rarr; Τέλη</strong>
                                </Step>
                                <Step n={2}>
                                    Ορίστε: Όνομα, Τύπος (Σταθερό/Ανά ημέρα), Ποσό, και <em>Εφαρμογή</em>:
                                    <ul className="mt-1 ml-4 list-disc">
                                        <li><strong>Πάντα</strong>: Εφαρμόζεται σε κάθε κράτηση</li>
                                        <li><strong>One-way</strong>: Μόνο αν η παράδοση γίνεται σε διαφορετική τοποθεσία</li>
                                        <li><strong>Παραλαβή αεροδρομίου</strong>: Μόνο αν η τοποθεσία παραλαβής είναι αεροδρόμιο</li>
                                        <li><strong>Παράδοση αεροδρομίου</strong>: Μόνο αν η τοποθεσία παράδοσης είναι αεροδρόμιο</li>
                                    </ul>
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 space-y-1">
                                    <div><strong>Βασική ασφάλεια</strong>: Πάντα, Σταθερό, 15&euro;</div>
                                    <div><strong>Τέλος αεροδρομίου</strong>: Παραλαβή αεροδρομίου, Σταθερό, 25&euro;</div>
                                    <div><strong>One-way fee</strong>: One-way, Σταθερό, 50&euro;</div>
                                </div>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="10. Yield Rules (Δυναμική Τιμολόγηση)" icon={TrendingUp}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Αυτόματη αύξηση τιμής όταν η διαθεσιμότητα σε μια κατηγορία πέφτει χαμηλά.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Ρυθμίσεις Τιμολόγησης &rarr; Yield Rules</strong>
                                </Step>
                                <Step n={2}>
                                    Ορίστε: Ελάχιστα διαθέσιμα οχήματα και ποσοστό αύξησης
                                </Step>
                            </div>
                            <Example>
                                Αν απομένουν <strong>2 ή λιγότερα</strong> διαθέσιμα οχήματα &rarr; <strong>+15%</strong> αύξηση τιμής αυτόματα.
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="11. Extras" icon={Package}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Πρόσθετες υπηρεσίες και εξοπλισμός που ο πελάτης μπορεί να προσθέσει στην κράτησή του.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Διαχείριση &rarr; Extras</strong>
                                </Step>
                                <Step n={2}>
                                    Δημιουργήστε extra με: Όνομα, Τιμή, Τύπος (<em>Ανά ημέρα</em> ή <em>Ανά ενοικίαση</em>)
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 space-y-1">
                                    <div><strong>GPS</strong>: 5&euro;/ημέρα (για 10 ημέρες = 50&euro;)</div>
                                    <div><strong>Παιδικό κάθισμα</strong>: 3&euro;/ημέρα</div>
                                    <div><strong>Full Insurance</strong>: 80&euro;/ενοικίαση (σταθερό)</div>
                                </div>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="12. Πελάτες" icon={Users}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Καταχωρίστε τα στοιχεία πελατών πριν δημιουργήσετε κράτηση.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Πελάτες</strong> από το κεντρικό μενού &rarr; <Badge variant="outline">Νέος πελάτης</Badge>
                                </Step>
                                <Step n={2}>
                                    Συμπληρώστε: Όνομα, Επώνυμο, Email, Τηλέφωνο, Αρ. Διπλώματος, και προαιρετικά Ημ. Γέννησης, Διεύθυνση, Σημειώσεις
                                </Step>
                            </div>
                        </div>
                    </Accordion>

                    <Accordion title="13. Δημιουργία Κράτησης" icon={CalendarDays}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Η κράτηση υπολογίζει αυτόματα το κόστος βάσει όλων των κανόνων τιμολόγησης.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Κρατήσεις</strong> &rarr; <Badge variant="outline">Νέα κράτηση</Badge>
                                </Step>
                                <Step n={2}>
                                    Επιλέξτε <strong>Πελάτη</strong> από τη λίστα
                                </Step>
                                <Step n={3}>
                                    Επιλέξτε <strong>Κατηγορία</strong> οχήματος και εισάγετε το <strong>ID Οχήματος</strong>
                                </Step>
                                <Step n={4}>
                                    Επιλέξτε <strong>Τοποθεσίες</strong> παραλαβής/παράδοσης και <strong>Ημερομηνίες</strong>
                                </Step>
                                <Step n={5}>
                                    Προαιρετικά: Ηλικία οδηγού, Extras, Σημειώσεις
                                </Step>
                                <Step n={6}>
                                    Στο πλαϊνό panel <strong>"Ανάλυση Τιμής"</strong> βλέπετε live τον υπολογισμό. Πατήστε <Badge variant="outline">Δημιουργία κράτησης</Badge>.
                                </Step>
                            </div>
                            <Example>
                                <div className="mt-2 text-sm space-y-1">
                                    <div>Κατηγορία: <strong>Economy</strong></div>
                                    <div>Ημερομηνίες: 12/6 - 18/6 (6 ημέρες)</div>
                                    <div>3 ημέρες Low (40&euro;) + 3 ημέρες High (80&euro;) = <strong>360&euro;</strong></div>
                                    <div>Έκπτωση 4-7 ημερών (-10%) = <strong>-36&euro;</strong></div>
                                    <div>GPS (5&euro;/ημ x 6) = <strong>+30&euro;</strong></div>
                                    <div>Τέλος αεροδρομίου = <strong>+25&euro;</strong></div>
                                    <div className="font-bold pt-1 border-t">Σύνολο: <strong>379&euro;</strong></div>
                                </div>
                            </Example>
                        </div>
                    </Accordion>

                    <Accordion title="14. Διαχείριση Κρατήσεων" icon={CheckCircle2}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Παρακολουθήστε και ενημερώστε την κατάσταση κάθε κράτησης.
                            </p>
                            <div className="space-y-3">
                                <Step n={1}>
                                    <strong>Κρατήσεις</strong>: Δείτε τη λίστα με φίλτρο κατάστασης
                                </Step>
                                <Step n={2}>
                                    Πατήστε στο εικονίδιο <strong>Προβολή</strong> για τις λεπτομέρειες
                                </Step>
                                <Step n={3}>
                                    Στη σελίδα λεπτομερειών, αλλάξτε κατάσταση: <em>Εκκρεμεί → Επιβεβαιωμένη → Ενεργή → Ολοκληρωμένη</em>
                                </Step>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="secondary">Εκκρεμεί</Badge>
                                <span className="text-muted-foreground">&rarr;</span>
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Επιβεβαιωμένη</Badge>
                                <span className="text-muted-foreground">&rarr;</span>
                                <Badge variant="success">Ενεργή</Badge>
                                <span className="text-muted-foreground">&rarr;</span>
                                <Badge>Ολοκληρωμένη</Badge>
                            </div>
                            <Tip>
                                Μπορείτε να <strong>ακυρώσετε</strong> μια κράτηση ανά πάσα στιγμή αλλάζοντας την κατάσταση σε "Ακυρωμένη".
                            </Tip>
                        </div>
                    </Accordion>

                    <Accordion title="Πώς υπολογίζεται η τιμή (αναλυτικά)" icon={DollarSign}>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Ο αλγόριθμος τιμολόγησης ακολουθεί αυτά τα βήματα:
                            </p>
                            <ol className="ml-4 list-decimal text-sm space-y-2">
                                <li>
                                    <strong>Ημερήσια τιμή ανά ημέρα</strong>: Κάθε ημέρα ελέγχεται σε ποια σεζόν ανήκει.
                                    Χρησιμοποιείται η τιμή κατηγορίας/σεζόν. Αν δεν υπάρχει σεζόν, πέφτει στη βασική τιμή.
                                </li>
                                <li>
                                    <strong>Βασικό σύνολο</strong>: Άθροισμα όλων των ημερήσιων τιμών
                                </li>
                                <li>
                                    <strong>Έκπτωση διάρκειας</strong>: Εφαρμόζεται ποσοστό βάσει συνολικών ημερών
                                </li>
                                <li>
                                    <strong>Early Bird / Last Minute</strong>: Έκπτωση ή προσαύξηση βάσει πόσο νωρίς έγινε η κράτηση
                                </li>
                                <li>
                                    <strong>Χρέωση ηλικίας</strong>: Αν ο οδηγός είναι σε ηλικιακό εύρος, προστίθεται σταθερό ποσό ή ποσοστό
                                </li>
                                <li>
                                    <strong>Yield management</strong>: Αν η κατηγορία έχει χαμηλή διαθεσιμότητα, αυξάνεται αυτόματα η τιμή
                                </li>
                                <li>
                                    <strong>Τέλη</strong>: One-way, αεροδρομίου, γενικά -- εφαρμόζονται βάσει συνθηκών
                                </li>
                                <li>
                                    <strong>Extras</strong>: Ανά ημέρα ή ανά ενοικίαση, πολλαπλασιαζόμενα x ποσότητα
                                </li>
                            </ol>
                            <div className="mt-4 rounded-lg border bg-muted/40 px-4 py-3 text-sm font-mono">
                                Σύνολο = (Βασικό - Έκπτωση Διάρκειας) + Χρονική Προσαρμογή + Χρέωση Ηλικίας + Yield + Τέλη + Extras
                            </div>
                        </div>
                    </Accordion>

                </div>
            </div>
        </AppLayout>
    );
}
