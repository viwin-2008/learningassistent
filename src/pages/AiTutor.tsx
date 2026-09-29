import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Trash2, 
  Zap,
  ChevronRight
} from 'lucide-react';
import type { ChatMessage } from '../types';
import { askGemini } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useProgress } from '../context/ProgressContext';

export const AiTutor: React.FC = () => {
  const { addQuestionAnswered } = useProgress();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: `### 👋 Hello! I'm EduGenie, your Google Gemini powered AI tutor.

I can help you with:
- **Lesson Explanations**: Explain complex engineering & science concepts in simple words.
- **Code & Logic**: Provide Python, Java, C++, and SQL solutions with step-by-step breakdown.
- **Exam Preparation**: Generate model answers, high-yield questions, and revision cheat sheets.

How can I assist your learning today? Click an example prompt below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "Explain Microprocessor Pipelining in simple words",
    "Give me comprehensive revision notes for Microprocessor 8086",
    "Create 10 MCQs on Data Structures Trees and Graphs",
    "What is the difference between TCP and UDP in Computer Networks?",
    "Explain ACID properties in Database Management Systems (DBMS)"
  ];

  const subjectsList = [
    'General',
    'Python',
    'Java & OOP',
    'Data Structures',
    'Microprocessor',
    'Database Systems',
    'Computer Networks',
    'Operating Systems'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuestion;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const aiResponseText = await askGemini(query, selectedSubject);
      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      addQuestionAnswered();
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: "⚠️ EduGenie encountered a connection issue. Please check your network or try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'ai',
        text: "Chat cleared! How can EduGenie help with your studies next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[720px] flex flex-col lg:flex-row">
        
        {/* LEFT SIDEBAR: Subject Filter & Example Prompts */}
        <div className="w-full lg:w-80 bg-slate-50/90 border-b lg:border-b-0 lg:border-r border-slate-200 p-5 flex flex-col justify-between space-y-6 shrink-0">
          <div className="space-y-5">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">AI Tutor Controls</h2>
              </div>
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Subject Dropdown Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Select Subject Domain</span>
                <span className="text-[10px] text-indigo-600 font-normal">Contextual AI</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              >
                {subjectsList.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Example Prompts Library */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quick Example Prompts
                </span>
              </div>
              <div className="space-y-1.5">
                {examplePrompts.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(promptText)}
                    className="w-full text-left p-2.5 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs text-slate-700 transition flex items-start gap-2 group shadow-2xs"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition" />
                    <span className="line-clamp-2">{promptText}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI Status Badge */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-3.5 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              <span>Google Gemini Active</span>
            </div>
            <p className="text-[11px] text-indigo-200">
              Generating instant explanations with code formatting and exam tips.
            </p>
          </div>
        </div>

        {/* RIGHT MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col justify-between bg-slate-50/30">
          
          {/* Chat Top Status Header */}
          <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  EduGenie AI Tutor
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                    {selectedSubject} Mode
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500">Ask any question or request code explanations</p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[560px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Container */}
                <div
                  className={`max-w-3xl rounded-3xl p-4 sm:p-5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-75">
                    <span className="font-bold">
                      {msg.sender === 'user' ? 'You (Student)' : 'EduGenie AI'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.sender === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="text-xs text-slate-500 font-medium ml-1">EduGenie is reasoning with Gemini AI...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box Controls */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask EduGenie a question or request notes (e.g. Give me notes for Microprocessor)..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                <span>Ask EduGenie</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Press Enter to send. Powered by Google Gemini AI.</span>
              <span className="text-indigo-600 font-medium hidden sm:inline">Tip: Select subject domain for specialized responses</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
