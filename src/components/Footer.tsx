import React from 'react';
import { GraduationCap, Heart, Cpu, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EduGenie</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini powered learning assistant for college students. Understand lessons, generate notes, solve questions, and excel in exams.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-800/60 w-fit">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
          </div>

          {/* Quick Learning Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Learning Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('aitutor')} className="hover:text-white transition">AI Chat Assistant</button></li>
              <li><button onClick={() => setActiveTab('notes')} className="hover:text-white transition">Smart Notes Generator</button></li>
              <li><button onClick={() => setActiveTab('summarizer')} className="hover:text-white transition">PDF & Document Summarizer</button></li>
              <li><button onClick={() => setActiveTab('quiz')} className="hover:text-white transition">AI MCQ Quiz Generator</button></li>
              <li><button onClick={() => setActiveTab('examprep')} className="hover:text-white transition">Exam Prep Dashboard</button></li>
            </ul>
          </div>

          {/* Core Subjects */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">College Subjects</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('subjects')} className="hover:text-white transition">Data Structures & Algorithms</button></li>
              <li><button onClick={() => setActiveTab('subjects')} className="hover:text-white transition">Microprocessor & Architecture</button></li>
              <li><button onClick={() => setActiveTab('subjects')} className="hover:text-white transition">Database Management Systems</button></li>
              <li><button onClick={() => setActiveTab('subjects')} className="hover:text-white transition">Python & Java Programming</button></li>
              <li><button onClick={() => setActiveTab('subjects')} className="hover:text-white transition">Computer Networks & OS</button></li>
            </ul>
          </div>

          {/* EduGenie Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">EduGenie Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition">Student Progress Dashboard</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-white transition">About EduGenie</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-white transition">Contact & Student Feedback</button></li>
              <li>
                <a 
                  href="https://ai.google.dev/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition inline-flex items-center gap-1 text-indigo-400"
                >
                  Google AI Studio Documentation <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EduGenie – Google Gemini Powered Learning Assistant. Built for Student Success.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for College Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
