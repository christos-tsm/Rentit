import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pagination } from '@/types';

type TablePaginationProps = {
    pagination: Pagination;
    /** Extra query params to preserve when navigating (e.g. active filters). */
    preserveParams?: Record<string, string | undefined>;
};

export default function TablePagination({ pagination, preserveParams }: TablePaginationProps) {
    const { current_page, last_page, from, to, total, links } = pagination;

    if (last_page <= 1) return null;

    function navigate(url: string | null) {
        if (!url) return;

        router.get(url, preserveParams ?? {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-muted-foreground">
                {from}&ndash;{to} από {total}
            </p>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled={current_page === 1}
                    onClick={() => navigate(pagination.prev_page_url)}
                >
                    <ChevronLeft className="size-4" />
                </Button>

                {links.map((link) => {
                    if (link.label.includes('Previous') || link.label.includes('Next')) {
                        return null;
                    }

                    return (
                        <Button
                            key={link.label}
                            variant={link.active ? 'default' : 'outline'}
                            size="icon"
                            className="size-8"
                            disabled={link.active}
                            onClick={() => navigate(link.url)}
                        >
                            {link.label}
                        </Button>
                    );
                })}

                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    disabled={current_page === last_page}
                    onClick={() => navigate(pagination.next_page_url)}
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
