// components/CursorPagination.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { BoardSearchParams } from '@/types/board-search';
import { Button, Box } from '@mui/material';

interface CursorPaginationProps {
    currentParams: BoardSearchParams;
    nextCursor?: string ;
    prevCursor?: string ;
}

export function CursorPagination({
                                     currentParams, nextCursor, prevCursor
                                 }: CursorPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasNextPage = !!nextCursor, hasPrevPage = !!prevCursor;

    const handlePageChange = (cursor: string | null, direction: 'next' | 'prev') => {
        const params = new URLSearchParams(searchParams.toString());

        if (cursor) {
            params.set('cursor', cursor);
        } else {
            params.delete('cursor');
        }

        params.set('direction', direction);

        router.push(`/board?${params.toString()}`);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
                variant="outlined"
                onClick={() => handlePageChange(prevCursor ?? '', 'prev')}
                disabled={!hasPrevPage}
            >
                이전
            </Button>

            <Button
                variant="outlined"
                onClick={() => handlePageChange(nextCursor ?? '', 'next')}
                disabled={!hasNextPage}
            >
                다음
            </Button>
        </Box>
    );
}
