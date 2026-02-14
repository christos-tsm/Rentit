export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type Pagination = {
    current_page: number;
    first_page_url: string;
    from: null | number;
    last_page: number;
    last_page_url: string;
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: null | number;
    total: number;
    links: PaginationLink[]
}

export type PaginationLink = {
    active: boolean;
    label: string;
    page: null | number;
    url: null | string;
}

export type PaginatedResponse<T> = {
    data: T[];
} & Pagination;