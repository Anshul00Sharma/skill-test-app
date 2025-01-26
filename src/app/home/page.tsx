"use client";

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Initialize pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

async function uploadPdf(selectedFile: File) {
  if (!selectedFile) {
    toast.error("Please select a PDF file");
    return;
  }

  const supabase = createClient();

  try {
    const bytes = await selectedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { data, error } = await supabase.storage
      .from("files")
      .upload(selectedFile.name, buffer, {
        contentType: selectedFile.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload PDF"
      );
      return;
    }

    console.log("Upload success:", data);
    toast.success("PDF uploaded successfully!");
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to upload PDF"
    );
    return null;
  }
}

async function insertTestResult(filePath: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("test-result")
      .insert([{ file_path: filePath }])
      .select();

    if (error) {
      console.error("Insert test result error:", error);
      toast.error("Failed to save test result");
      return null;
    }

    console.log("Test result insert success:", data);
    return data[0].id;
  } catch (error) {
    console.error("Insert test result error:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to save test result"
    );
    return null;
  }
}

async function insertExam(filePath: string, testResultId: number | null) {
  const supabase = createClient();
  console.log(" inserting ", testResultId, filePath);
  try {
    const { data, error } = await supabase
      .from("exam")
      .insert([
        {
          file_path: filePath,
          "test-result": testResultId,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      toast.error("Failed to save file information");
      return;
    }

    console.log("Insert success:", data);
    return data[0].id;
  } catch (error) {
    console.error("Insert error:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to save file information"
    );
  }
}

export default function Home() {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [navigationTimeout, setNavigationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const [examId, setExamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [examReady, setExamReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (examId) {
      intervalId = setInterval(async () => {
        try {
          const response = await supabase
            .from("assessment_questions")
            .select("id")
            .eq("exam", examId);

          const data = response.data;
          console.log("checking questions", response);

          if (data.length > 0) {
            setIsLoading(false);
            setExamReady(true);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error checking questions:", error);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [examId]);

  useEffect(() => {
    if (!pdfFile) return;

    const handleFileUploads = async () => {
      await uploadPdf(pdfFile);
      const testResultId = await insertTestResult(pdfFile.name);
      const examId = await insertExam(pdfFile.name, testResultId);
      setExamId(examId);
    };

    handleFileUploads();
  }, [pdfFile]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        event.target.value = "";
        return;
      }
      // Create URL for the PDF file

      setPdfFile(file);
      setPageNumber(1);
      console.log("Uploaded file:", file);
      event.target.value = "";
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-start bg-gray-50 p-4 pt-24">
      {!pdfFile ? (
        <>
          <h1 className="text-3xl font-bold text-slate-600 mb-8">
            Upload your PDF
          </h1>
          <p className="mb-6 text-slate-600 w-80 text-center">
            The AI will learn from your notes and will be able to answer any
            question.
          </p>
          <div className="h-28" />
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input
              id="pdf-upload"
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileUpload}
            />
          </label>
        </>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center relative ">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Study About your Material
          </h1>
          <button
            onClick={() => {
              setPdfFile(null);
              setNumPages(0);
              setPageNumber(1);
            }}
            className="absolute top-0 right-20 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>

          <div
            className="border h-[600px] w-[400px] rounded-xl p-4 bg-white relative mt-2 shadow-lg"
            onMouseMove={() => {
              setIsNavigationVisible(true);
              if (navigationTimeout) {
                clearTimeout(navigationTimeout);
              }
              const timeout = setTimeout(() => {
                setIsNavigationVisible(false);
              }, 2000);
              setNavigationTimeout(timeout);
            }}
            onMouseLeave={() => {
              setIsNavigationVisible(false);
            }}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => toast.error("Error loading PDF")}
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="w-full max-w-3xl mx-auto"
                width={370}
                height={560}
              />
            </Document>

            {/* Floating Navigation */}
            <div
              className={`fixed bottom-40 z-50 left-1/2 transform -translate-x-1/2 flex items-center gap-4 transition-opacity duration-300 ${
                isNavigationVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="p-2 rounded-full bg-gray-800/70 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <div className="px-4 py-2 rounded-full bg-gray-800/70 text-white">
                Page {pageNumber} of {numPages}
              </div>

              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                disabled={pageNumber >= numPages}
                className="p-2 rounded-full bg-gray-800/70 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              if (examReady) {
                router.push(`/exam/${examId}`);
              } else {
                toast.error("Please wait for exam creation to complete");
              }
            }}
            className={`fixed bottom-8 w-56 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white transform transition-all duration-200 hover:bg-blue-600 hover:shadow-xl `}
          >
            <span className="text-xl font-thin">
              {isLoading ? (
                <div className="flex items-center">
                  <span>AI is working</span>
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                </div>
              ) : (
                "AI Exam is Ready"
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
