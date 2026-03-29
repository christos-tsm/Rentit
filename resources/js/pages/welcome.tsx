import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import PageLayout from '@/layouts/page-layout';
import CommercialHeader from '@/components/commercial/Header';
import { Button } from '@/components/ui/button';
import CTA from '@/components/ui/cta';
import Marquee from '@/components/commercial/Marquee';
import FeatureCard from '@/components/commercial/FeatureCard';

export default function Welcome({ canRegister = true, }: { canRegister?: boolean; }) {
    const { auth } = usePage().props;

    return (
        <PageLayout title="Αρχική" description="Εύκολο car rental">
            <CommercialHeader canRegister={canRegister} />
            <section className="flex flex-col items-center gap-10 container mx-auto px-4 border-l border-r border-gray-200 py-10 bg-[url(/images/bg-texture.svg)] bg-center bg-cover">
                <div className="flex justify-center flex-col text-center max-w-2xl gap-4">
                    <h1 className="font-bold text-3xl">Σύγχρονη <span className="text-primary">πλατφόρμα διαχέιρησης</span> ενοικιαζόμενων οχημάτων</h1>
                    <div className="text-sm font-medium">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus minima provident aperiam placeat. Alias beatae facilis eveniet asperiores, tempora distinctio iste eum commodi natus veritatis dignissimos ut exercitationem voluptatem ea.</p>
                    </div>
                    <div>
                        <CTA href="#!" variant={'default'}>Ξεκινήστε δωρεάν</CTA>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto">
                    <img src="/images/hero.webp" alt="Hero Image" />
                </div>
            </section>
            <section className="border-t border-b p-4">
                <Marquee />
            </section>
            <section className="">
                <div className="container mx-auto grid grid-cols-3 gap-10 p-10 border-l border-r border-gray-200">
                    <FeatureCard title="Στατιστικά διαχείρησης" image_url="/images/hero.webp" image_classes="-rotate-[15deg] translate-x-[25px] translate-y-[40px] opacity-40">
                        <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nostrum.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sint porro exercitationem officiis! Minus soluta ex praesentium labore repellendus quo.</p>
                    </FeatureCard>
                    <FeatureCard title="Διαχείρηση στόλου" image_url="/images/hero.webp" image_classes="-rotate-[15deg] translate-x-[25px] translate-y-[40px] opacity-40">
                        <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nostrum.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sint porro exercitationem officiis! Minus soluta ex praesentium labore repellendus quo.</p>
                    </FeatureCard>
                    <FeatureCard title="Διαχείρηση κρατήσεων" image_url="/images/hero.webp" image_classes="-rotate-[15deg] translate-x-[25px] translate-y-[40px] opacity-40">
                        <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nostrum.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt sint porro exercitationem officiis! Minus soluta ex praesentium labore repellendus quo.</p>
                    </FeatureCard>
                </div>
            </section>
        </PageLayout>
    );
}
