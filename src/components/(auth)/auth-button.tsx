'use client';

import {signOut, useSession} from 'next-auth/react';
import React from 'react';
import {useRouter} from "next/navigation";

export default function AuthButton() {
    const {data: session, status} = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <div>로딩 중...</div>;
    }

    if (session) {

        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <p style={{color: 'white', margin: 0}}>
                    id : {session.user?.id || session.user?.email}
                </p>
                <button
                    onClick={() => signOut()}
                    style={{
                        padding: '8px 15px',
                        cursor: 'pointer',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => router.push('/sign')}
            style={{
                padding: '8px 15px',
                cursor: 'pointer',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
            }}
        >
            로그인
        </button>
    );
}
