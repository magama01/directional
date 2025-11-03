export interface BoardSearchParams {
    search?: string;
    cursor?: string;
    direction?: 'prev' | 'next';
    sortBy?: 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    category?: string;
}
