import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import * as React from 'react';

export default async function AuthGuard({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/sign');
    }

    return <>{children}</>;
}
