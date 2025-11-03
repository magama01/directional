"use client";

import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {Box, Button, Chip, CircularProgress, Container, Paper, Typography} from '@mui/material';
import Link from 'next/link';
import {BoardData} from "@/types/board-data";
import {useClientFetch} from "@/libs/client-fetcher";
import CategoryChip from "@/components/(board)/category-chip";
import {luxon} from "@/libs/util";

type PostDetailData = BoardData & { isMine: boolean };

export default function PostDetailPage({params}: { params: { id: string } }) {
    const router = useRouter();
    const clientFetch = useClientFetch();
    const {data: session} = useSession();

    const [postId, setPostId] = useState<null | string>(null);

    const [post, setPost] = useState<PostDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async () => {
        const _postId = (await params)?.id;

        if (!_postId) {
            router.replace('404')
            return;
        }
        setPostId(_postId)

        setLoading(true);
        setError(null);

        try {
            const data = await clientFetch<BoardData>(`/posts/${_postId}`);
            const isMine = data.userId === session?.user.id;
            setPost({...data, isMine});
        } catch (e) {
            const err = e as Error;
            if (err.cause === 404 || err.message.includes('404')) {
                router.replace('404')
                return;
            }
            setError('게시글 로드 실패: ' + (err.message || '알 수 없는 오류'));
        } finally {
            setLoading(false);
        }
    }, [postId, clientFetch, router, session]);


    useEffect(() => {
        fetchPost();
    }, [fetchPost]);


    const handleDelete = useCallback(async () => {
        if (!post || !post.isMine || deleting) return;

        if (!confirm("게시글을 정말로 삭제하시겠습니까?")) return;

        setDeleting(true);
        try {

            await clientFetch(`/posts/${postId}`, {method: "DELETE"});

            alert("게시글이 삭제되었습니다.");
            router.push('/board');
        } catch (e) {
            const err = e as Error;
            alert(`삭제 실패: ${err.message}`);
        } finally {
            setDeleting(false);
        }
    }, [postId, post, clientFetch, router, deleting]);



    if (loading) {
        return <Container sx={{display:'flex', width:"screen", minHeight:"90vh", justifyContent:"center", alignItems:"center"}}>
            <CircularProgress/>
        </Container>;
    }

    if (error) {
        return <Container maxWidth="md" sx={{mt: 5}}><Typography color="error" align="center">오류
            발생: {error}</Typography></Container>;
    }

    if (!post) {
        return <Container maxWidth="md" sx={{mt: 5}}><Typography align="center">게시글을 찾을 수
            없습니다.</Typography></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{mt: 5, mb: 5}}>
            <Paper elevation={3} sx={{p: 4}}>
                <CategoryChip category={post.category}/>
                <Typography variant="h4" component="h1" gutterBottom>
                    {post.title}
                </Typography>

                <Box sx={{
                    color: 'text.secondary',
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="body2">
                        작성자 ID: {post.userId}
                    </Typography>
                    <Typography variant="body2">
                        작성일: {luxon(post.createdAt).p(true)}
                    </Typography>
                </Box>


                <Box sx={{display: 'flex', gap: 1, mb: 3}}>
                    {post.tags.map((tag, index) => (
                        <Chip key={index} label={`${tag}`} size="small" variant="outlined"/>
                    ))}
                </Box>

                <Box sx={{borderTop: 1, borderColor: 'divider', pt: 3, minHeight: 200}}>
                    <Typography variant="body1" sx={{whiteSpace: 'pre-line'}}>
                        {post.body}
                    </Typography>
                </Box>

                {
                    post.isMine &&
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Box>
                            <Link href={`/board`}>
                                <Button variant="outlined" color="primary" size="small">
                                    목록으로
                                </Button>
                            </Link>
                        </Box>
                         <Box sx={{display : 'flex', gap:1}}>
                            <Link href={`/board/edit/${post.id}`}>
                                <Button variant="outlined" color="primary" size="small">
                                    수정
                                </Button>
                            </Link>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? '삭제 중...' : '삭제'}
                            </Button>
                        </Box>
                    </Box>
                }
            </Paper>
        </Container>
    );
}
