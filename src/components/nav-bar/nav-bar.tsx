"use client"

import Link from 'next/link';
import AuthButton from "@/components/(auth)/auth-button";
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

export default function Navbar() {
    const navItems = [
        { label: '홈', href: '/' },
        { label: 'Board', href: '/board' },
        { label: 'Chart', href: '/chart' },
    ];

    return (
        <AppBar position="static" color="primary">

            <Toolbar
                sx={{
                    maxWidth: "lg",
                    width: '100%',
                    margin: '0 auto',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{
                    display: { xs: 'none', sm: 'flex' },
                    gap: 2,
                }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            color="inherit"
                            component={Link}
                            href={item.href}
                            sx={{
                                fontWeight: 'bold'
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ ml: 'auto' }}>
                    <AuthButton/>
                </Box>

            </Toolbar>
        </AppBar>
    );
}
