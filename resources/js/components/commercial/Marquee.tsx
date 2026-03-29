interface MarqueeProps {
    speed?: number;
    className?: string;
}

const basLogos = [
    { src: '/images/brandlogos/hertz.png', alt: 'Hertz' },
    { src: '/images/brandlogos/avis.svg', alt: 'Avis' },
];

const logos = Array.from({ length: 14 }, (_, i) => basLogos[i % basLogos.length]);

export default function Marquee({ speed = 40, className = '' }: MarqueeProps) {
    return (
        <section className={`overflow-hidden py-5 ${className}`}>
            <div
                className="flex w-max animate-marquee"
                style={{ animationDuration: `${speed}s` }}
            >
                {[0, 1].map((copy) => (
                    <div key={copy} className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={copy === 1}>
                        {logos.map((logo, i) => (
                            <img
                                key={`${copy}-${i}`}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-8 w-[120px] shrink-0 object-contain"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
