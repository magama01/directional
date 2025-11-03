"use server";

import { serverFetch } from "@/libs/server-fetch";
import { redirect } from 'next/navigation';
import {PostSchema} from "@/libs/actions/post-schema";

type FormState = {
    message: string;
    errors?: Record<string, string[] | undefined>;
};

export async function upsertPostAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const rawTags = formData.get('tags') as string || '';



    const data = {
        id: formData.get('id') || undefined,
        title: formData.get('title'),
        body: formData.get('body'),
        category: formData.get('category'),
        tags: rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    for(const r of formData.entries()){
        console.log(r);
    }
    const validatedFields = PostSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            message: '입력된 정보에 오류가 있습니다.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, title, body, category, tags } = validatedFields.data;
    const isEditMode = !!id;
    const method = isEditMode ? 'PATCH' : 'POST';
    const endpoint = isEditMode ? `/posts/${id}` : '/posts';

    try {
        const res = await serverFetch(endpoint, {
            method: method,
            body: JSON.stringify({ title, body, category, tags }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const errorMessage = errorData.message || "서버 응답 오류가 발생했습니다.";
            return {
                message: `게시글 ${isEditMode ? '수정' : '작성'} 실패: ${errorMessage}`,
            };
        }

        const successRedirectPath = isEditMode ? `/board/${id}` : '/board';
        redirect(successRedirectPath);

    } catch (error) {
        if ((error as Error).message.includes('NEXT_REDIRECT')) {
            throw error;
        }

        return {
            message: `게시글 ${isEditMode ? '수정' : '작성'} 중 네트워크 오류가 발생했습니다.`,
        };
    }
}
