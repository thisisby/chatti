'use client'
// @ts-nocheck
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
        {reportData && reportData.message != "No similar items found with the specified similarity threshold and country filter." ? (
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
                  {reportData?.original_query}
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
                  <Markdown>{reportData?.reasoning.replaceAll("$", "").replaceAll("долларов", "рублей")}</Markdown>

                  <hr />
                 <b>Мы анализировали эти товары:</b>

                  <ul>
                    {reportData?.similar_items?.slice(0, 7).map((item, idx) => (
                      <li className='mb-1' key={idx}>
                        <a className='underline' href={item.source_url} target='_blank'>{item.item_name}</a>  - <b>{item.price}</b>с
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-zinc-800 dark:text-zinc-300">Oops we do not have data to analyze this product yet 😓</div>
        )}
      </div>
    </div>
  );
}
