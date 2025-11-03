"use client";

import React, {useState} from 'react';
import {signIn, useSession} from 'next-auth/react';
import {useSearchParams} from "next/navigation";
import {Alert, Box, Button, CircularProgress, Container, TextField, Typography} from '@mui/material';

export default function LoginPage() {
    const { update } = useSession();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') || undefined;

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const redirectToPath = callbackUrl || '/';

        const result = await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
            callbackUrl: redirectToPath,
        });

        if (result?.error) {

            setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
            setLoading(false);
        } else {

            await update();
            setLoading(false);


            window.location.href = result?.url || redirectToPath;
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: 'white',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    이메일/비밀번호 로그인
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        value={credentials.email}
                        label="이메일 주소"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        type="email"
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value={credentials.password}
                        label="비밀번호"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handleChange}
                    />

                    {errorMessage && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
