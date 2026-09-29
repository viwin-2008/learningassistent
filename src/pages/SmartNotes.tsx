import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Bookmark, 
  Copy, 
  Check, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import { generateNotes } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useProgress } from '../context/ProgressContext';

export const SmartNotes: React.FC = () => {
  const { saveNote, incrementTopicsCompleted } = useProgress();

  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [level, setLevel] = useState('Intermediate');
  const [noteType, setNoteType] = useState<'Short' | 'Detailed'>('Detailed');

  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const presetTopics = [
    'Microprocessor 8086 Architecture',
    'Data Structures B-Trees & Indexing',
    'Python Object-Oriented Programming',
    'Operating System Deadlocks & Prevention',
    'Database ACID Properties & Transactions',
    'TCP/IP Protocol Stack & Headers'
  ];

  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setGeneratedNotes(null);
    setSavedSuccess(false);

    try {
      const result = await generateNotes(targetTopic, level, noteType);
      setGeneratedNotes(result);
      incrementTopicsCompleted();
    } catch (err) {
      setGeneratedNotes("Failed to generate smart notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = () => {
    if (!generatedNotes) return;
    saveNote({
      topic: topic || 'Study Notes',
      subject,
      type: noteType,
      content: generatedNotes
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!generatedNotes) return;
    const blob = new Blob([generatedNotes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(topic || 'EduGenie_Notes').replace(/\s+/g, '_')}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyNotes = () => {
    if (!generatedNotes) return;
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Notes Generator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Smart Study Notes</h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Enter any topic and EduGenie will craft structured revision notes with definitions, key principles, examples, advantages, and high-yield exam questions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-indigo-100 shrink-0">
          <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Exam-Ready Structure</div>
            <div>Definition • Key Points • Examples • Q&A</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Note Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topic Name *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Microprocessor 8086"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject Domain
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Computer Science</option>
                <option>Microprocessor & Architecture</option>
                <option>Database Management Systems</option>
                <option>Programming (Python/Java/C++)</option>
                <option>Computer Networks</option>
                <option>Operating Systems</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Depth Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Exam Ready</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Note Type</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setNoteType('Short')}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${noteType === 'Short' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                  >
                    Short
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('Detailed')}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition ${noteType === 'Detailed' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                  >
                    Detailed
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Smart Notes</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Topics */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Popular Topics</span>
            <div className="flex flex-wrap gap-1.5">
              {presetTopics.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(p);
                    handleGenerate(undefined, p);
                  }}
                  className="text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Formatted Notes Display */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md min-h-[540px] flex flex-col justify-between">
          
          {generatedNotes ? (
            <div className="space-y-6">
              
              {/* Output Actions Bar */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                    {noteType} Notes
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{level} Level</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNotes}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export MD</span>
                  </button>

                  <button
                    onClick={handleSaveToDashboard}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Saved to Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rendered Markdown Notes */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 overflow-y-auto max-h-[600px]">
                <MarkdownRenderer content={generatedNotes} />
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm animate-pulse-subtle">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">No Notes Generated Yet</h3>
                <p className="text-xs text-slate-500">
                  Enter a topic like "Microprocessor 8086" or select a quick topic from the left panel to generate structured notes with Gemini AI.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
