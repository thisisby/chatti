'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BotIcon, UserIcon } from '@/components/custom/icons';
import { Markdown } from '@/components/custom/markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function Page() {
  const { slug } = useParams(); // Match the unique key passed in the URL
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      const storedData = localStorage.getItem(slug); // Get the report data by unique key
      if (storedData) {
        setReportData(JSON.parse(storedData));
      } else {
        console.error('No report found for this key');
      }
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) return <p>Loading report...</p>;

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center pb-10 min-h-dvh bg-white dark:bg-zinc-900 relative">
      <div className="w-full max-w-[500px] px-4 pt-6">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="mb-4 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
      <div className="flex flex-col gap-16 w-full max-w-[500px] px-4">
        {reportData ? (
          <>
            <motion.div
              className="flex flex-row gap-2 w-full"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                <UserIcon />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-zinc-800 dark:text-zinc-300">
                  {reportData.query}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-row gap-2 w-full"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                <BotIcon />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                  <Markdown>{reportData.reasoning}</Markdown>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-zinc-800 dark:text-zinc-300">No data available</div>
        )}
      </div>
    </div>
  );
}
