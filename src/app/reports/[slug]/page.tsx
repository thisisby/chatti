"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowUpIcon
  } from "@/components/custom/icons";
import Link from "next/link";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const unwrappedParams = use(params); // Unwrap params using React's `use`

    const handleBack = () => {
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-100 via-white to-blue-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-900">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 relative">
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    aria-label="Back to Home"
                >
                    <ArrowUpIcon />
                </button>
                
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 text-center mb-2">
                    Post Title
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
                    A short description of the content can go here.
                </p>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-lg text-zinc-800 dark:text-zinc-300 text-center">
                        Content or data fetched based on the provided parameters will be displayed here.
                    </p>

                    <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline">
                        Go back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
