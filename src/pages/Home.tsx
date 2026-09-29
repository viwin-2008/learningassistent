import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  FileText, 
  FileSearch, 
  HelpCircle, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Brain, 
  Zap, 
  Star
} from 'lucide-react';
import { askGemini } from '../services/geminiService';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [loadingQuick, setLoadingQuick] = useState(false);

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    setLoadingQuick(true);
    setQuickAnswer(null);
    try {
      const res = await askGemini(quickQuestion);
      setQuickAnswer(res);
    } catch (err) {
      setQuickAnswer("Sorry, EduGenie encountered a temporary error. Please try again.");
    } finally {
      setLoadingQuick(false);
    }
  };

  const featureCards = [
    {
      id: 'aitutor',
      icon: Bot,
      color: 'from-blue-500 to-indigo-600',
      title: 'AI Question Answering',
      desc: 'Instant step-by-step explanations, code examples, and theoretical clarity for any college question.'
    },
    {
      id: 'notes',
      icon: FileText,
      color: 'from-purple-500 to-indigo-600',
      title: 'Smart Notes',
      desc: 'Auto-generate structured revision sheets complete with definitions, key points, examples, and exam tips.'
    },
    {
      id: 'summarizer',
      icon: FileSearch,
      color: 'from-emerald-500 to-teal-600',
      title: 'Document Summarization',
      desc: 'Upload complex PDFs or textbooks and extract executive summaries, core terms, and revision sheets.'
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      color: 'from-amber-500 to-orange-600',
      title: 'Quiz Generator',
      desc: 'Create custom multiple-choice quizzes (Easy, Medium, Hard) with immediate scoring and explanations.'
    },
    {
      id: 'examprep',
      icon: Award,
      color: 'from-rose-500 to-pink-600',
      title: 'Exam Preparation',
      desc: 'Practice previous-year question styles, short answer graders, high-yield topic checklists, and AI study plans.'
    },
    {
      id: 'subjects',
      icon: GraduationCap,
      color: 'from-cyan-500 to-blue-600',
      title: 'Personalized Learning',
      desc: 'Tailored study tracks for core computer science & engineering subjects like Data Structures, DBMS, and OS.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 lg:pt-16 pb-12 rounded-3xl bg-gradient-to-b from-indigo-50/80 via-white to-purple-50/50 border border-indigo-100/80 shadow-xs">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/90 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Google Gemini 2.5 Flash Powered</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Learn Smarter with <br className="hidden sm:inline" />
                <span className="gradient-text">EduGenie</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Your Google Gemini Powered Learning Assistant. EduGenie helps college students understand complex lessons, answer tough questions, summarize study materials, generate revision notes, and crack exams with confidence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('aitutor')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-200 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <Bot className="w-5 h-5 text-indigo-200 group-hover:scale-110 transition" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setActiveTab('aitutor')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border-2 border-indigo-200/80 shadow-xs hover:border-indigo-400 transition flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-purple-600 group-hover:rotate-12 transition" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium border-t border-indigo-100/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Step-by-Step AI Solutions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aligned with College Syllabi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Free & Unlimited</span>
                </div>
              </div>

            </div>

            {/* Hero Right Graphic Card / AI Illustration */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-indigo-100 relative animate-float">
                
                {/* Floating Top Badge */}
                <div className="absolute -top-4 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>99.8% Accuracy</span>
                </div>

                {/* Floating Left Badge */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-2 border border-slate-700">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Gemini 2.5 Active</span>
                </div>

                {/* Main Card Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">EduGenie AI Workspace</h3>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        Ready to assist you 24/7
                      </p>
                    </div>
                  </div>

                  {/* Simulated Prompt Box */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2">
                    <div className="text-indigo-700 font-bold flex items-center gap-1.5">
                      <Bot className="w-4 h-4" />
                      <span>Student Prompt</span>
                    </div>
                    <p className="text-slate-700 italic">"Explain Microprocessor Pipelining with an example and 3 key advantages for my semester exam."</p>
                  </div>

                  {/* Simulated Response Box */}
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 text-xs space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-indigo-300 font-semibold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        EduGenie Response
                      </span>
                      <span className="text-[10px] bg-indigo-800 px-2 py-0.5 rounded-md">Notes Ready</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      **Pipelining** is an instruction execution technique where multiple instructions are overlapped in execution (Fetch → Decode → Execute → Writeback)...
                    </p>
                    <div className="pt-2 flex gap-2 text-[10px]">
                      <span className="bg-indigo-700/80 text-white px-2 py-0.5 rounded">Definition ✓</span>
                      <span className="bg-indigo-700/80 text-white px-2 py-0.5 rounded">Diagram ✓</span>
                      <span className="bg-indigo-700/80 text-white px-2 py-0.5 rounded">3 Advantages ✓</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK INTERACTIVE ASK BOX */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600/80 rounded-xl text-amber-300">
                <Brain className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold">Ask EduGenie Anything Right Now</h2>
            </div>

            <form onSubmit={handleQuickAsk} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="e.g. What is the difference between TCP and UDP?"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={loadingQuick}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shrink-0"
              >
                {loadingQuick ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                  </>
                )}
              </button>
            </form>

            {quickAnswer && (
              <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/15 text-sm space-y-2 animate-in fade-in">
                <div className="text-amber-300 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Answer Preview:
                </div>
                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {quickAnswer.slice(0, 300)}...
                </p>
                <button
                  onClick={() => setActiveTab('aitutor')}
                  className="text-xs text-indigo-300 hover:text-white font-bold inline-flex items-center gap-1 pt-1"
                >
                  Continue conversation in AI Tutor <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Everything You Need
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive AI Tools for Every College Student
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            From late-night study sessions to exam preparation, EduGenie equips you with modern Google Gemini AI capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="glass-card rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-slate-200/80 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition">
                  <span>Explore Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold">50,000+</h3>
            <p className="text-xs text-indigo-100 font-medium">Questions Answered</p>
          </div>
          <div className="space-y-1 border-l border-white/20">
            <h3 className="text-3xl sm:text-4xl font-extrabold">12,500+</h3>
            <p className="text-xs text-indigo-100 font-medium">Smart Notes Generated</p>
          </div>
          <div className="space-y-1 border-l border-white/20">
            <h3 className="text-3xl sm:text-4xl font-extrabold">99.8%</h3>
            <p className="text-xs text-indigo-100 font-medium">AI Accuracy Rate</p>
          </div>
          <div className="space-y-1 border-l border-white/20">
            <h3 className="text-3xl sm:text-4xl font-extrabold">100+</h3>
            <p className="text-xs text-indigo-100 font-medium">College Subjects Covered</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Student Feedback</span>
          <h2 className="text-2xl font-bold text-slate-900">What College Students Say About EduGenie</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Chen',
              role: 'Computer Science Major',
              text: 'EduGenie helped me generate concise notes and practice questions for my Data Structures exam. I improved my grade from B to A+!',
              stars: 5
            },
            {
              name: 'Rohan Sharma',
              role: 'Electronics & Comm. Student',
              text: 'The PDF summarizer and Microprocessor notes are top tier. Being able to ask Gemini to explain tricky assembly language concepts in plain words saved my semester.',
              stars: 5
            },
            {
              name: 'Emily Davis',
              role: 'Information Technology Student',
              text: 'The Quiz Generator with instant scoring and detailed explanations makes revision fun and super fast. Highly recommended for every engineering student.',
              stars: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{item.text}"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                <p className="text-[11px] text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
