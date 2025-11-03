'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BoardSearchParams } from '@/types/board-search';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    InputAdornment,
    Chip,
    Stack,
    Typography,
    CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const CATEGORIES = [
    { id: 'all', name: '전체' },
    { id: 'NOTICE', name: '공지사항' },
    { id: 'FREE', name: '자유 게시판' },
    { id: 'QNA', name: 'Q&A' },
];

interface BoardControlsProps {
    currentParams: BoardSearchParams;
}

export function BoardControls({ currentParams }: BoardControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const DEBOUNCE_DELAY = 500;

    const [loading, setLoading] = useState(false);

    const initialLocalParams = useMemo(() => ({
        search: currentParams.search || '',
        category: currentParams.category || 'all',
        sortBy: currentParams.sortBy || 'createdAt',
        sortOrder: currentParams.sortOrder || 'desc',
    }), [currentParams]);

    const [localParams, setLocalParams] = useState<BoardSearchParams>(initialLocalParams);

    useEffect(() => {
        const isSameAsURL = (
            localParams.search === (currentParams.search || '') &&
            localParams.category === (currentParams.category || 'all') &&
            localParams.sortBy === (currentParams.sortBy || 'createdAt') &&
            localParams.sortOrder === (currentParams.sortOrder || 'desc')
        );

        if (!isSameAsURL) {
            setLocalParams({
                search: currentParams.search || '',
                category: currentParams.category || 'all',
                sortBy: currentParams.sortBy || 'createdAt',
                sortOrder: currentParams.sortOrder || 'desc',
            });
        }

        setLoading(false);
    }, [currentParams]);

    const executeSearch = useCallback(async (paramsToSearch: BoardSearchParams) => {

        const params = new URLSearchParams();

        if (paramsToSearch.search && paramsToSearch.search !== '') {
            params.set('search', paramsToSearch.search);
        } else if (paramsToSearch.search === '') {
            params.set('search', '');
        }

        if (paramsToSearch.category && paramsToSearch.category !== 'all') {
            params.set('category', paramsToSearch.category);
        }

        if (paramsToSearch.sortBy && paramsToSearch.sortOrder) {
            if (paramsToSearch.sortBy !== 'createdAt' || paramsToSearch.sortOrder !== 'desc') {
                params.set('sortBy', paramsToSearch.sortBy);
                params.set('sortOrder', paramsToSearch.sortOrder);
            }
        }

        params.delete('cursor');
        params.delete('direction');

        try {
            await router.push(`/board?${params.toString()}`);
        } catch (error) {
            console.error("Search failed:", error);
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const isSameAsURL = (
            localParams.search === (currentParams.search || '') &&
            localParams.category === (currentParams.category || 'all') &&
            localParams.sortBy === (currentParams.sortBy || 'createdAt') &&
            localParams.sortOrder === (currentParams.sortOrder || 'desc')
        );

        if (isSameAsURL) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const handler = setTimeout(() => {
            executeSearch(localParams);
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(handler);
        };
    }, [localParams, executeSearch, currentParams]);

    const handleSortChange = (event: { target: { value: unknown } }) => {
        const value = event.target.value as string;
        const [sortBy, sortOrder] = value.split(':');

        setLocalParams(prev => ({
            ...prev,
            sortBy: sortBy as 'title' | 'createdAt',
            sortOrder: sortOrder as 'asc' | 'desc',
        }));
    };

    const handleCategoryChange = (event: { target: { value: unknown } }) => {
        setLocalParams(prev => ({
            ...prev,
            category: event.target.value as string,
        }));
    };

    const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalParams(prev => ({ ...prev, search: e.target.value }));
    };

    const currentSortValue = `${localParams.sortBy || 'createdAt'}:${localParams.sortOrder || 'desc'}`;

    const getPreviewChips = () => {
        const chips = [];
        const currentParamsObj = currentParams as Record<string, string>;

        const deleteParam = (key: keyof BoardSearchParams) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(key as string);
            params.delete('cursor');
            params.delete('direction');
            router.push(`/board?${params.toString()}`);
        };

        if (currentParamsObj.search) {
            chips.push(
                <Chip
                    key="search"
                    label={`검색: ${currentParamsObj.search}`}
                    onDelete={() => deleteParam('search')}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            );
        }

        if (currentParamsObj.category && currentParamsObj.category !== 'all') {
            const categoryName = CATEGORIES.find(c => c.id === currentParamsObj.category)?.name || currentParamsObj.category;
            chips.push(
                <Chip
                    key="category"
                    label={`카테고리: ${categoryName}`}
                    onDelete={() => deleteParam('category')}
                    size="small"
                    color="default"
                    variant="outlined"
                />
            );
        }

        const sortBy = currentParamsObj.sortBy || 'createdAt';
        const sortOrder = currentParamsObj.sortOrder || 'desc';
        if (sortBy !== 'createdAt' || sortOrder !== 'desc') {
            const SORT_LABELS = {
                'createdAt:desc': '최신순',
                'createdAt:asc': '오래된순',
                'title:asc': '제목(오름차순)',
                'title:desc': '제목(내림차순)',
            } as const;

            const sortKey = `${sortBy}:${sortOrder}` as keyof typeof SORT_LABELS;

            const sortLabel = SORT_LABELS[sortKey] || '정렬 기준 변경됨';

            chips.push(
                <Chip
                    key="sort"
                    label={`정렬: ${sortLabel}`}
                    onDelete={() => { deleteParam('sortBy'); deleteParam('sortOrder'); }}
                    size="small"
                    color="default"
                    variant="outlined"
                />
            );
        }

        return chips;
    };

    const chips = getPreviewChips();

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={2} alignItems="center">

                <Grid size={{ xs: 12, sm: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="category-select-label">카테고리</InputLabel>
                        <Select
                            labelId="category-select-label"
                            value={localParams.category}
                            label="카테고리"
                            onChange={handleCategoryChange}
                        >
                            {CATEGORIES.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="sort-select-label">정렬</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            value={currentSortValue}
                            label="정렬"
                            onChange={handleSortChange}
                        >
                            <MenuItem value="createdAt:desc">최신순</MenuItem>
                            <MenuItem value="createdAt:asc">오래된순</MenuItem>
                            <MenuItem value="title:asc">제목(가-&gt;하)</MenuItem>
                            <MenuItem value="title:desc">제목(하-&gt;가)</MenuItem>

                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="제목 및 내용 검색"
                            variant="outlined"
                            value={localParams.search}
                            onChange={handleSearchTextChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {loading ? <CircularProgress size={20} /> : <SearchIcon color="action" />}
                                    </InputAdornment>
                                ),
                            }}
                        />

                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        검색 조건:
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        {chips.length > 0 ? chips : <Typography variant="caption" color="text.disabled"> - </Typography>}
                    </Stack>
                </Box>


            </Box>
        </form>
    );
}
