import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Square, 
  Calendar, 
  Brain
} from 'lucide-react';
import { evaluateShortAnswer, generateStudyPlan } from '../services/geminiService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const ExamPrep: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Microprocessor');
  const [activePrepTab, setActivePrepTab] = useState<'Topics' | 'Practice' | 'ShortAnswer' | 'StudyPlan'>('Topics');

  // Topics checklist state
  const [topics, setTopics] = useState([
    { id: 't1', title: '8086 Architecture & Register Organization', importance: 'Critical', completed: true },
    { id: 't2', title: 'Instruction Pipelining & Branch Hazards', importance: 'High', completed: false },
    { id: 't3', title: 'Addressing Modes with Assembly Examples', importance: 'Critical', completed: true },
    { id: 't4', title: 'Interrupt Processing (INT 21h & Hardware Vectoring)', importance: 'High', completed: false },
    { id: 't5', title: 'Memory Interfacing & 8255 PPI Controller', importance: 'Medium', completed: false }
  ]);

  // Short Answer Grader state
  const [saQuestion] = useState('Explain the mechanism of Instruction Pipelining in microprocessors and list 2 types of hazards.');
  const [saStudentAnswer, setSaStudentAnswer] = useState('');
  const [saEvalResult, setSaEvalResult] = useState<{ score: number; feedback: string; modelAnswer: string } | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Study Plan Generator state
  const [examDate, setExamDate] = useState('2026-10-15');
  const [dailyHours, setDailyHours] = useState(3);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const toggleTopic = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleEvaluateShortAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saStudentAnswer.trim()) return;

    setEvaluating(true);
    setSaEvalResult(null);

    try {
      const res = await evaluateShortAnswer(saQuestion, saStudentAnswer);
      setSaEvalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPlan(true);
    setGeneratedPlan(null);

    try {
      const plan = await generateStudyPlan(selectedSubject, examDate, dailyHours);
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-rose-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-800/80 text-rose-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Exam Preparation Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Master Your Semester Exams</h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Check off high-yield topics, practice previous year questions, get AI-graded short answer feedback, and generate custom study schedules.
          </p>
        </div>

        {/* Subject Selector */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs shrink-0 space-y-1">
          <label className="block text-[11px] font-bold text-rose-200 uppercase">Active Exam Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold border border-rose-400/40 focus:outline-none"
          >
            <option>Microprocessor</option>
            <option>Data Structures</option>
            <option>Database Systems</option>
            <option>Operating Systems</option>
            <option>Computer Networks</option>
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'Topics', label: 'Important Topics Checklist', icon: CheckSquare },
          { id: 'Practice', label: 'Previous-Question Practice', icon: BookOpen },
          { id: 'ShortAnswer', label: 'AI Short-Answer Grader', icon: Brain },
          { id: 'StudyPlan', label: 'AI Study Schedule Generator', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePrepTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePrepTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Important Topics Checklist */}
      {activePrepTab === 'Topics' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">High-Yield Revision Checklist for {selectedSubject}</h2>
              <p className="text-xs text-slate-500">Track your preparation status before exam day</p>
            </div>
            <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              {topics.filter(t => t.completed).length} / {topics.length} Mastered
            </div>
          </div>

          <div className="space-y-3">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  t.completed 
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' 
                    : 'bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {t.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs sm:text-sm font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {t.title}
                  </span>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  t.importance === 'Critical' 
                    ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {t.importance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Previous-Question Model Practice */}
      {activePrepTab === 'Practice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">University Model Exam Questions ({selectedSubject})</h2>
            <p className="text-xs text-slate-500">Actual exam pattern questions with model answers</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Q1. Draw the functional block diagram of Microprocessor 8086 and explain BIU & EU. (10 Marks)",
                ans: "The 8086 CPU is divided into two independent functional units: Bus Interface Unit (BIU) handles instruction fetching, memory read/write, and segment registers. Execution Unit (EU) decodes instructions and executes arithmetic logic via ALU."
              },
              {
                q: "Q2. Compare Minimum Mode and Maximum Mode configurations of 8086. (6 Marks)",
                ans: "In Minimum Mode (MN/MX = 1), 8086 generates all control signals itself for single processor systems. In Maximum Mode (MN/MX = 0), control signals are generated by 8288 bus controller for multiprocessor environments."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.q}</h3>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-rose-600 block mb-1">Model Exam Answer Solution:</span>
                  {item.ans}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI Short-Answer Grader */}
      {activePrepTab === 'ShortAnswer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">AI Short-Answer Examiner Grader</h2>
            <p className="text-xs text-slate-500">Type your answer to a sample question and get graded 0-10 with AI feedback</p>
          </div>

          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 uppercase">Exam Question</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">{saQuestion}</p>
          </div>

          <form onSubmit={handleEvaluateShortAnswer} className="space-y-4">
            <textarea
              rows={4}
              value={saStudentAnswer}
              onChange={(e) => setSaStudentAnswer(e.target.value)}
              placeholder="Type your exam answer here..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!saStudentAnswer.trim() || evaluating}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {evaluating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Grade My Answer with Gemini</span>
                </>
              )}
            </button>
          </form>

          {saEvalResult && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-300">AI Examiner Evaluation</span>
                <span className="text-sm font-extrabold bg-rose-600 px-3 py-1 rounded-full">
                  Score: {saEvalResult.score} / 10
                </span>
              </div>
              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-300">Feedback:</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{saEvalResult.feedback}</p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="font-bold text-emerald-300">Ideal Model Answer:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed italic">{saEvalResult.modelAnswer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI Study Schedule Generator */}
      {activePrepTab === 'StudyPlan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Customized AI Study Planner</h2>
            <p className="text-xs text-slate-500">Generate a tailored day-by-day revision schedule for your exam</p>
          </div>

          <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Study Hours</label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loadingPlan}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {loadingPlan ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Generate Schedule</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {generatedPlan && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <MarkdownRenderer content={generatedPlan} />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
