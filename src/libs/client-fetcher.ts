"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export function useClientFetch() {
    const { data: session, status } = useSession();

    const clientFetch = useCallback(async <T>(endpoint: string, options?: RequestInit): Promise<T> => {

        if (status !== 'authenticated' || !session || !session.accessToken) {
            throw new Error("인증되지 않았거나 토큰이 없습니다. 로그인하십시오.");
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
        };

        const url = `${API_ENDPOINT}${endpoint}`;

        const response = await fetch(url, config);

        if (!response.ok) {
            let errorBody = null;
            try {
                errorBody = await response.json();
            } catch (e) {
            }

            const statusText = response.statusText || 'Unknown Error';
            const errorMessage = errorBody?.message || `API 요청 실패: ${response.status} (${statusText})`;

            throw new Error(errorMessage, { cause: response.status });
        }

        return response.json() as Promise<T>;

    }, [session, status]);

    return clientFetch;
}
