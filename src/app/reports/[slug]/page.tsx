'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BotIcon, UserIcon } from '@/components/custom/icons'
import { Markdown } from '@/components/custom/markdown'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { redirect, useParams } from 'next/navigation'

// Mock function to simulate fetching data from the backend
const fetchDataFromBackend = async (query: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    query,
    response: `This is a mock response for the query: "${query}". In a real application, this data would come from your backend API.`
  }
}

export default function Page() {
  const { slug } = useParams() // Now, slug is a Promise
  let query = slug || 'Default query' // Default value for fallback

  if (Array.isArray(query)) {
    query = query[0]
  }

  const [data, setData] = useState<{ query: string; response: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await fetchDataFromBackend(query)
      setData(result)
      setIsLoading(false)
    }

    if (slug) {
      fetchData()
    }
  }, [query, slug])

  const handleGoBack = () => {
    redirect('/')
  }

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
        {isLoading ? (
          <div className="flex flex-row gap-2 w-full">
            <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
              <BotIcon />
            </div>
            <div className="flex flex-col gap-1 text-zinc-400">
              <div>Loading...</div>
            </div>
          </div>
        ) : data ? (
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
                  {data.query}
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
                  <Markdown>{data.response}</Markdown>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-zinc-800 dark:text-zinc-300">No data available</div>
        )}
      </div>
    </div>
  )
}
