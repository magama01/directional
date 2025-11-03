import { auth } from "@/auth";
import process from "node:process";

export async function serverFetch(endpoint: string, options?: RequestInit) {
    const session = await auth();
    if (!session || !session.accessToken) {
        throw new Error("API 요청을 위한 인증 토큰을 찾을 수 없습니다. 로그인 상태를 확인하세요.");
    }

    const accessToken = session.accessToken;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options?.headers,
        },
        cache: 'no-store',
    };


    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${endpoint}`;
    const response = await fetch(url, config);

    if (response.status === 401) {
        throw new Error("인증 실패: 토큰이 만료되었거나 유효하지 않습니다.");
    }

    return response;
}
