
"use client";
// @ts-nocheck
import { redirect } from 'next/navigation'

import {
  ArrowUpIcon,
  AttachmentIcon,
  BotIcon,
  VercelIcon,
} from "@/components/custom/icons";
import { useRouter } from 'next/navigation';

import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Markdown } from "@/components/custom/markdown";

type FileOptions = {
  experimental_attachments?: FileList | null;
};


function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

export default function Home() {

  const [reports, setReports] = useState([]);

  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("You've been rate limited, please try again later!"),
    });

    

  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for the hidden file input
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const router = useRouter();
  const [open, isOpen] = useState(false);

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedReports = [];
    // Loop through localStorage to get report keys and data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('report_')) { // Assumes report keys have a 'report_' prefix
        const reportData = JSON.parse(localStorage.getItem(key) || "{}");
    
        storedReports.push({ key, data: reportData });
      }
    }
    setReports(storedReports);
  }, []);

  // Function to handle file selection via the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle files selected from the file dialog
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed");
      }
    }
  };


  const handleSubmitt = async (event: FormEvent, options: FileOptions) => {
    event.preventDefault();
    setTrigger(true)
    setIsLoadingg(true)

    try {
      // Get the input data to send (e.g., messages or input text)
      const inputData = input; // Adjust as needed to collect the right data
  
      // Send the POST request to the API
      const response = await fetch("https://api-uca-team.jprq.site/validate_from_description/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: inputData }), // Adjust the payload as needed
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const uniqueKey = `report_${Date.now()}`;
  
      // Get response data and save it to localStorage
      const result = await response.json();
         localStorage.setItem(uniqueKey, JSON.stringify(result));
         router.push(`/reports/${uniqueKey}`);

      console.log(result)
  
      // Redirect to the report page
      redirect("/reports/1");
    } catch (error) {
      toast.error("Failed to submit data. Please try again.");
    } finally {
      setIsLoadingg(false);
    }

  
  }

  const handleViewReport = (key) => {
    router.push(`/reports/${key}`); // Navigates to the unique report page
  };

  return (
    <div
      className="flex flex-row justify-center pb-10 h-dvh bg-white dark:bg-zinc-900 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

    <button onClick={() => isOpen(!open)} className={`fixed top-3 ${open ? "left-[200px]" : "left-3"} duration-150 bg-black text-white px-2 py-1 rounded-lg md:hidden`}>{open ? "Close" : "Menu"}</button>

      <div className={`absolute md:left-10 md:top-16 top-0 pt-6 px-6 bg-white h-screen duration-150 md:h-auto ${open ? "left-0" : "-left-[100%]"}`}>
        <b className='text-sm mb-4 block'>Reports:</b>
      {reports.length > 0 ? (
        <ul className="w-full max-w-[500px] space-y-4">
          {reports.map((report) => (
            <li key={report.key} className="underline cursor-pointer"  onClick={() => handleViewReport(report.key)}>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-zinc-200 text-sm">
                  {report.data.title || `${report.key}`}
                </span>
        
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-zinc-300">No reports available.</p>
      )}
      </div>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 flex flex-row justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(images and text)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col justify-between gap-4">
        {trigger ? (
          <div className="flex flex-col gap-2 h-full w-dvw items-center overflow-y-scroll">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 ${
                  index === 0 ? "pt-20" : ""
                }`}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                  <BotIcon /> 
                </div>

                <div className="flex flex-col gap-1">
                  <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                    <Markdown>{message.content}</Markdown>
                  </div>
                  <div className="flex flex-row gap-2">
            
                        <div className="text-xs w-40 h-24 overflow-hidden text-zinc-400 border p-2 rounded-md dark:bg-zinc-800 dark:border-zinc-700 mb-3">
                
                        </div>
                   
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoadingg && (
              <div className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 pt-20">
                <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                  <BotIcon />
                </div>
                <div className="flex flex-col gap-1 text-zinc-400">
                  <div>hmm...</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                <VercelIcon />
                <span>+</span>
                <AttachmentIcon />
              </p>
              <p>
              Чат может помочь вам сверить цены на определенные товары с действительными и правильными рыночными ценами.
              Им очень просто пользоваться. Напишите описание товара, цену и страну продажи.
              </p>
              <p>
                {" "}
                Пр. "Мне предлагают купить Блок питания 750W DeepCool DQ750-M-V2L Gold в России по цене 45000 руб. стоит ли мне прнимать такю сделку?"
             
              </p>
            </div>
          </motion.div>
        )}

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={(event) => {
            const options = files ? { experimental_attachments: files } : {};
            handleSubmitt(event, options);
            setFiles(null);
          }}
        >
          <AnimatePresence>
            {files && files.length > 0 && (
              <div className="flex flex-row gap-2 absolute bottom-12 px-4 w-full md:w-[500px] md:px-0">
                {Array.from(files).map((file) =>
                  file.type.startsWith("image") ? (
                    <div key={file.name}>
                      <motion.img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="rounded-md w-16"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                          y: -10,
                          scale: 1.1,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                      />
                    </div>
                  ) : file.type.startsWith("text") ? (
                    <motion.div
                      key={file.name}
                      className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{
                        y: -10,
                        scale: 1.1,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <TextFilePreview file={file} />
                    </motion.div>
                  ) : null
                )}
              </div>
            )}
          </AnimatePresence>


          <input
            type="file"
            multiple
            accept="image/*,text/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] bg-zinc-100 dark:bg-zinc-700 rounded-md px-4 py-2">
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadClick}
              className="text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100 focus:outline-none mr-3"
              aria-label="Upload Files"
            >
              <span className="w-5 h-5">
                <AttachmentIcon aria-hidden="true" />
              </span>
            </button>


            <input
              ref={inputRef}
              className="bg-transparent flex-grow outline-none text-zinc-800 dark:text-zinc-300 placeholder-zinc-400 pr-[7px] sm:pr-0"
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
              onPaste={handlePaste}
            />
           <button className='sm:hidden' type='submit'> <ArrowUpIcon /></button>
          </div>
        </form>
      </div>

      <a href="https://api-uca-team.jprq.site/docs">Link to API</a>
    </div>
  );
}