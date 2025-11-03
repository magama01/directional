"use client";

import React from 'react';
import {Message, BarChart, ArrowForward, SvgIconComponent} from '@mui/icons-material';

const Card = ({ title , description, href, icon: Icon }: {title: string, description: string, href : string , icon :SvgIconComponent}) => (
    <a
        href={href}
        className="relative flex flex-col items-start p-6 bg-white border border-zinc-200 rounded-xl shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm"
    >
        <div className="p-3 mb-4 bg-blue-500 rounded-full text-white">
            <Icon sx={{ width: 24, height: 24 }} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            {title}
        </h2>
        <p className="text-zinc-600 mb-4">
            {description}
        </p>
        <div className="flex items-center text-blue-500 font-semibold group-hover:text-blue-600 transition-colors">
            바로가기
            <ArrowForward sx={{ width: 20, height: 20 }} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
    </a>
);

export default function Home() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-20 pb-12 px-4 font-sans">
            <header className="text-center mb-12 max-w-2xl">
                <h1 className="text-5xl font-extrabold text-zinc-900 mb-4 leading-tight">
                    Project Home
                </h1>

            </header>

            <main className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

                <Card
                    title="Board"
                    description="로그인이 필요한 페이지 입니다."
                    href="/board"
                    icon={Message}
                />


                <Card
                    title="Charts"
                    description="로그인 없이 접근 가능합니다."
                    href="/chart"
                    icon={BarChart}
                />
            </main>

            <footer className="mt-20 text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} 김종원 magama01@gmail.com.
            </footer>
        </div>
    );
}
