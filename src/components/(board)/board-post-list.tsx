import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography, Paper, Box, Link as MuiLink, Chip } from '@mui/material';
import Link from 'next/link';
import {BoardData} from "@/types/board-data";
import CategoryChip from "@/components/(board)/category-chip";
import {luxon} from "@/libs/util";

export function PostList({ items }: {items : BoardData[]}) {
    if (items.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    게시글이 없습니다.
                </Typography>
            </Box>
        );
    }


    return (
        <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="게시글 목록">
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                        <TableCell sx={{ width: '10%', fontWeight: 'bold' }}>카테고리</TableCell>
                        <TableCell sx={{ width: '55%', fontWeight: 'bold' }}>제목</TableCell>
                        <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>작성자</TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>작성일</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((post) => (
                        <TableRow
                            key={post.id}
                            hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                        >
                            <TableCell component="th" scope="row">

                                <CategoryChip category={post.category} />
                            </TableCell>
                            <TableCell>
                                <Link href={`/board/${post.id}`} passHref>

                                        <Typography variant="body1" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {post.title}
                                        </Typography>

                                </Link>
                            </TableCell>
                            <TableCell>{post.userId}</TableCell>
                            <TableCell>{luxon(post.createdAt).p(true)}

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
