import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Layers
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-800/80 text-amber-300 text-xs font-bold border border-indigo-700">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>About EduGenie AI</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Empowering College Students Worldwide
        </h1>

        <p className="text-base sm:text-lg text-indigo-100 max-w-3xl mx-auto leading-relaxed italic">
          “EduGenie is a Google Gemini powered learning assistant designed to make learning easier, faster, and more personalized for students.”
        </p>
      </div>

      {/* MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            College curriculum is dense, demanding, and fast-paced. EduGenie was built to bridge the gap between complex lectures and student comprehension. By leveraging Google Gemini AI, we convert intimidating engineering and science topics into step-by-step explanations, interactive quizzes, and revision sheets.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Google Gemini Advantage</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Powered by Google's latest Gemini 2.5 Flash model, EduGenie processes complex reasoning, source code analysis, PDF document text, and multi-format study requests in milliseconds with 99.8% structural accuracy.
          </p>
        </div>
      </div>

      {/* TECHNICAL STACK BREAKDOWN */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Technical Architecture</h2>
          <p className="text-xs text-slate-500">Built using modern enterprise-grade technologies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'React.js & Vite',
              desc: 'Ultra-fast frontend UI rendering with TypeScript component architecture.',
              icon: Layers
            },
            {
              title: 'Google Gemini AI API',
              desc: 'Gemini 2.5 Flash SDK for intelligent Q&A, notes generation, and quiz scoring.',
              icon: Cpu
            },
            {
              title: 'Firebase Auth & DB',
              desc: 'Student user profiles, authentication state, and cloud progress syncing.',
              icon: ShieldCheck
            },
            {
              title: 'Tailwind CSS v4',
              desc: 'Modern glassmorphism UI design system with vibrant gradients and animations.',
              icon: Sparkles
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <Icon className="w-6 h-6 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
