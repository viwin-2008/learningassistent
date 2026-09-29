import React from 'react';
import { 
  HelpCircle, 
  Award, 
  BookOpen, 
  Clock, 
  Flame, 
  FileText, 
  TrendingUp, 
  Trash2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

export const ProgressDashboard: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const { stats, deleteSavedNote } = useProgress();
  const { user } = useAuth();

  const statCards = [
    {
      title: 'Questions Answered',
      value: stats.questionsAnswered,
      sub: 'Total AI Q&A interactions',
      icon: HelpCircle,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Quizzes Completed',
      value: stats.quizzesCompleted,
      sub: `${stats.quizHistory.length} recorded sessions`,
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'Average Quiz Score',
      value: `${stats.averageScore}%`,
      sub: 'Based on submitted MCQs',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Topics Mastered',
      value: stats.topicsCompleted,
      sub: 'Saved & reviewed notes',
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Student Performance Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome Back, {user?.displayName || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Here is your real-time learning analytics, completed quizzes, average score trends, and saved smart notes.
          </p>
        </div>

        {/* Streak & Study Hours Widget */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-indigo-100 shrink-0">
          <div className="flex items-center gap-2 pr-4 border-r border-white/20">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
            <div>
              <div className="font-extrabold text-white text-sm">{stats.streakDays} Day Streak</div>
              <div className="text-[10px]">Active Study Habits</div>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <Clock className="w-6 h-6 text-indigo-300" />
            <div>
              <div className="font-extrabold text-white text-sm">{stats.studyHours} Hours</div>
              <div className="text-[10px]">Total Study Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{card.title}</span>
                <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">{card.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* VISUAL ANALYTICS & RECENT QUIZZES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Progress Bar Chart Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Subject Proficiency Breakdown
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              AI Estimated
            </span>
          </div>

          <div className="space-y-4">
            {[
              { subject: 'Microprocessor & Assembly', pct: 92, color: 'bg-rose-500' },
              { subject: 'Data Structures & Algorithms', pct: 88, color: 'bg-indigo-600' },
              { subject: 'Database Systems (DBMS)', pct: 84, color: 'bg-emerald-500' },
              { subject: 'Computer Networks', pct: 78, color: 'bg-cyan-500' },
              { subject: 'Operating Systems', pct: 75, color: 'bg-purple-600' }
            ].map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{sub.subject}</span>
                  <span>{sub.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${sub.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz History List Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Recent Quiz Results
            </h2>
            <button
              onClick={() => setActiveTab('quiz')}
              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              Take Quiz <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.quizHistory.length > 0 ? (
            <div className="space-y-3">
              {stats.quizHistory.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{q.topic}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {q.difficulty} • {q.score} / {q.totalQuestions} Questions • {q.date}
                    </p>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    q.percentage >= 80 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No quiz results recorded yet.</p>
          )}
        </div>

      </div>

      {/* SAVED SMART NOTES SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Saved Smart Notes ({stats.savedNotes.length})
          </h2>
          <button
            onClick={() => setActiveTab('notes')}
            className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            Generate Notes <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.savedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.savedNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">
                      {note.subject}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{note.topic}</h3>
                  </div>
                  <button
                    onClick={() => deleteSavedNote(note.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {note.content}
                </p>
                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between">
                  <span>Type: {note.type}</span>
                  <span>Date: {note.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No saved notes found.</p>
        )}
      </div>

    </div>
  );
};
