import {serverFetch} from "@/libs/server-fetch";
import {Box, Button, Container, Paper, Stack, Typography} from '@mui/material';
import {BoardSearchParams} from '@/types/board-search';
import {BoardControls} from "@/components/(board)/board-control";
import {CursorPagination} from "@/components/(board)/board-pagination";

import {BoardResponse} from "@/types/board-data";
import Link from "next/link";
import {PostList} from "@/components/(board)/board-post-list";

const removeUndefined = <T extends Record<string, any>>(obj: T) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Record<string, string>;
};


async function fetchPosts(params: BoardSearchParams): Promise<BoardResponse> {
    const limit = 10;


    const search = params.search || '';
    const category = params.category && params.category !== 'all' ? params.category : '';
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    const cursor = params.cursor;
    const direction = params.direction;
    let prevCursor, nextCursor;

    if (!!cursor && !!direction) {
        direction === 'next' ? nextCursor = cursor : prevCursor = cursor
    }

    const queryObject = {

        limit: limit.toString(),
        sort: sortBy,
        order: sortOrder,
        search: search,
        category: category,
        nextCursor,
        prevCursor
    }

    const query = new URLSearchParams(removeUndefined(queryObject));


    try {
        const res = await serverFetch(`/posts?${query.toString()}`, {
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`API fetch failed: ${res.statusText}`);
        }

        const data =  await res.json();

        return data;


    } catch (error) {
        return {
            items: [],
            nextCursor: undefined,
            prevCursor: undefined,
        };
    }
    finally {

    }
}


export default async function BoardPage({
                                            searchParams,
                                        }: {
    searchParams: BoardSearchParams;
}) {

    const resolvedParams = await Promise.resolve(searchParams);

    const postData = await fetchPosts(resolvedParams);

    return (
        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>


            <Paper elevation={1} sx={{p: 2, mb: 3}}>
                <BoardControls currentParams={resolvedParams}/>
            </Paper>

            <Stack spacing={2}>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Link href={'/board/create'}>
                        <Button variant={'contained'}>
                            새 게시글 작성
                        </Button>
                    </Link>
                </Box>

                <PostList items={postData.items}/>
            </Stack>


            <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                <CursorPagination
                    currentParams={resolvedParams}
                    nextCursor={postData.nextCursor}
                    prevCursor={postData.prevCursor}
                />
            </Box>

        </Container>
    );
}
