import React, { useState } from 'react';
import { 
  FileSearch, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { extractTextFromFile } from '../services/pdfService';
import { summarizeDocument } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const PdfSummarizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [loadingExtract, setLoadingExtract] = useState<boolean>(false);
  const [loadingSummarize, setLoadingSummarize] = useState<boolean>(false);
  const [summaryOutput, setSummaryOutput] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setDocTitle(uploadedFile.name);
    setErrorMessage(null);
    setLoadingExtract(true);

    try {
      const extracted = await extractTextFromFile(uploadedFile);
      setDocumentText(extracted.text);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to extract text from file. You can copy and paste the text manually below.");
    } finally {
      setLoadingExtract(false);
    }
  };

  const handleSummarize = async () => {
    if (!documentText.trim()) return;

    setLoadingSummarize(true);
    setErrorMessage(null);
    setSummaryOutput(null);

    try {
      const res = await summarizeDocument(documentText, docTitle || 'Study Document');
      setSummaryOutput(res);
    } catch (err: any) {
      setErrorMessage("Failed to generate summary. Please ensure your API key or server is connected.");
    } finally {
      setLoadingSummarize(false);
    }
  };

  const sampleDocumentText = `Microprocessor Architecture and Pipelining Overview:
A microprocessor is an integrated circuit that contains all the functions of a central processing unit (CPU) of a computer. 
Pipelining is an architectural feature designed to increase the number of instructions executed by a processor in a given amount of time. 
In a non-pipelined system, each instruction is completed before the next instruction begins execution. 
In a pipelined processor, multiple instructions are overlapped in execution. The pipeline is divided into stages:
1. Instruction Fetch (IF): Fetch instruction from memory.
2. Instruction Decode (ID): Read registers and decode opcode.
3. Execute (EX): Perform arithmetic/logic operation in ALU.
4. Memory Access (MEM): Read or write memory operands.
5. Writeback (WB): Write result back into destination register.

Advantages of Pipelining:
- Improves overall throughput of the CPU.
- Reduces cycle time of the processor.
- Enables higher clock frequencies.

Hazards in Pipelining:
1. Data Hazards: Occurs when an instruction depends on the result of a previous instruction still in the pipeline.
2. Structural Hazards: Resource conflicts when hardware components are needed simultaneously.
3. Control Hazards: Caused by branch and jump instructions altering the instruction flow.`;

  const handleLoadSample = () => {
    setDocTitle("Microprocessor_Pipelining_Chapter.txt");
    setDocumentText(sampleDocumentText);
    setErrorMessage(null);
  };

  const handleCopySummary = () => {
    if (!summaryOutput) return;
    navigator.clipboard.writeText(summaryOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            PDF & Study Material Summarizer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Document Summarizer</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Upload PDF textbooks, lecture notes, or paste study materials to generate executive summaries, key terms, and potential exam questions.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-emerald-200 text-xs font-bold rounded-2xl border border-white/20 transition shrink-0"
        >
          Load Sample Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Upload & Input Area */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-emerald-600" />
            Upload PDF or Paste Material
          </h2>

          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition group cursor-pointer">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {file ? file.name : 'Click to Upload PDF or Text File'}
              </p>
              <p className="text-[11px] text-slate-500">Supports .PDF, .TXT, and .MD files up to 25 pages</p>
            </div>
          </div>

          {loadingExtract && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-xl">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Extracting text from PDF document...</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Text Area Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Document Text Content</span>
              <span className="text-[10px] text-slate-400">{documentText.length} characters</span>
            </div>
            <textarea
              rows={8}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Or paste your lecture notes / PDF content directly here..."
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleSummarize}
            disabled={!documentText.trim() || loadingSummarize}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingSummarize ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Summarize with Gemini AI</span>
              </>
            )}
          </button>

        </div>

        {/* RIGHT COLUMN: Summary Output Display */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md min-h-[540px] flex flex-col justify-between">
          
          {summaryOutput ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Executive Summary
                  </span>
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">{docTitle}</span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 overflow-y-auto max-h-[600px]">
                <MarkdownRenderer content={summaryOutput} />
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm animate-pulse-subtle">
                <FileSearch className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">No Document Summarized Yet</h3>
                <p className="text-xs text-slate-500">
                  Upload a PDF file or paste text content on the left to extract key takeaways, definitions, and exam questions.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
