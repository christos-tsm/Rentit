
interface FeatureCardInterface {
    title: string;
    children: React.ReactNode;
    image_url?: string;
    image_classes?: string;
}

const FeatureCard: React.FC<FeatureCardInterface> = ({ title, children, image_url, image_classes = "" }) => {
    return (
        <article className="flex flex-col p-10 rounded-xl gap-2 bg-[#eee] overflow-hidden">
            <h3 className="text-xl font-bold">{title}</h3>
            <div className="flex flex-col gap-2 text-sm font-medium">
                {children}
            </div>
            {image_url ? <img src={image_url} alt={title} className={` ${image_classes}`} /> : null}
        </article>
    )
}

export default FeatureCard