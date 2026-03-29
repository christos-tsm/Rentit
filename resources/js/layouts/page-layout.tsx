import { Head } from "@inertiajs/react";

export default function PageLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string; }) {
    return (
        <>
            <Head title={`${title} `}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
                <meta name="description" content={`${description}`} />
            </Head>
            <main className="site-main bg-landing-background" {...props}>
                {children}
            </main>
        </>
    );
}
