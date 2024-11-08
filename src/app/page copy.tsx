import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Plus, ArrowUp } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 0L0 6V18L11 24L22 18V6L11 0ZM14.1 8.5L11.1 6.8L8.1 8.5L11 10.2L14.1 8.5ZM3 8.5L6 10.2V13.5L3 11.8V8.5ZM6 16.8L3 15.1V11.8L6 13.5V16.8ZM11 20.2L8 18.5V15.2L11 16.9L14 15.2V18.5L11 20.2ZM16 13.5V16.8L19 15.1V11.8L16 13.5ZM19 8.5L16 10.2V13.5L19 11.8V8.5Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
         Welcome back
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center px-4">
        <h1 className="mt-32 text-4xl font-semibold tracking-tight">
          Let's verify the prices!
        </h1>
        <div className="mt-8 w-full max-w-[640px]">
          <div className="relative">
            <Textarea
              placeholder="Write the description of the products..."
              className="min-h-[120px] resize-none rounded-xl border-neutral-200 p-4 text-base shadow-sm placeholder:text-neutral-500 focus-visible:ring-neutral-200"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-neutral-100"
              >
                <Paperclip className="h-4 w-4 text-neutral-500" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-neutral-100"
              >
                <Plus className="h-4 w-4 text-neutral-500" />
                <span className="sr-only">Add project</span>
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t py-6">
       
     
      </footer>
    </div>
  )
}