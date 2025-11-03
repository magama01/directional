import PostForm from "@/components/(board)/board-post-form";
import { serverFetch } from '@/libs/server-fetch';
import { notFound } from 'next/navigation';

interface PostData {
    id?: string;
    title: string;
    body: string;
    category: string;
    tags: string[];
}

async function getPostData(postId: string): Promise<PostData> {

    try {
        const res = await serverFetch(`/posts/${postId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("게시글 로드 실패");
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error("데이터를 찾을 수 없습니다.");
    }

}

export default async function EditPage({ params }: { params: { id: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const postId = resolvedParams.id;

    if (!postId) {
        notFound();
    }

    const initialData = await getPostData(postId);

    return <PostForm initialData={initialData} />;
}
