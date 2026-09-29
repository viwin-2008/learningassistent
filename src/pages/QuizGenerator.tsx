import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { useProgress } from '../context/ProgressContext';

export const QuizGenerator: React.FC = () => {
  const { addQuizResult } = useProgress();

  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: 'A' | 'B' | 'C' | 'D' }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  const handleGenerateQuiz = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setQuestions(null);
    setSubmitted(false);
    setUserAnswers({});
    setScore(0);

    try {
      const generated = await generateQuiz(targetTopic, difficulty, questionCount);
      setQuestions(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleSubmitQuiz = () => {
    if (!questions || submitted) return;

    let calculatedScore = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);

    const percentage = Math.round((calculatedScore / questions.length) * 100);

    // Save result to progress tracking
    addQuizResult({
      id: 'quiz_' + Date.now(),
      topic: topic || 'Custom Topic Quiz',
      difficulty,
      score: calculatedScore,
      totalQuestions: questions.length,
      percentage,
      date: new Date().toISOString().split('T')[0]
    });

    // Trigger celebratory confetti on high scores
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const sampleTopics = [
    'Python Programming & Functions',
    'Data Structures - Trees & Graphs',
    'Microprocessor 8086 Instruction Set',
    'DBMS SQL Queries & Normalization',
    'Computer Networks OSI Model',
    'Operating System Process Management'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/80 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI MCQ Quiz Generator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Interactive Quiz Practice</h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Generate instant multiple-choice questions on any subject, evaluate your knowledge, view detailed explanations, and track scores.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-amber-100 shrink-0">
          <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Instant Score & Review</div>
            <div>Easy • Medium • Hard Modes</div>
          </div>
        </div>
      </div>

      {!questions && (
        /* QUIZ SETUP FORM */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Configure Your Quiz</h2>
              <p className="text-xs text-slate-500">EduGenie will generate custom MCQs with Gemini AI</p>
            </div>
          </div>

          <form onSubmit={handleGenerateQuiz} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Quiz Topic or Subject *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Microprocessor 8086"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Generate Quiz Questions</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Topics */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Try Quick Topics</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleTopics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(t);
                    handleGenerateQuiz(undefined, t);
                  }}
                  className="text-[11px] bg-amber-50 text-amber-900 hover:bg-amber-100 font-medium px-2.5 py-1.5 rounded-lg border border-amber-200 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {questions && (
        /* ACTIVE QUIZ PLAYER VIEW */
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Quiz Top Score Summary Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{difficulty} Difficulty</span>
              <h2 className="text-lg font-bold text-slate-900">{topic || 'Quiz Session'}</h2>
              <p className="text-xs text-slate-500">{questions.length} Questions</p>
            </div>

            <div className="flex items-center gap-3">
              {submitted ? (
                <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)</span>
                </div>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  Submit Quiz Answers
                </button>
              )}

              <button
                onClick={() => setQuestions(null)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                title="Create New Quiz"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-6">
            {questions.map((q, index) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-3xl p-6 border transition shadow-sm ${
                    submitted 
                      ? isCorrect 
                        ? 'border-emerald-300 bg-emerald-50/20' 
                        : 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      <span className="text-amber-600 mr-2">Q{index + 1}.</span>
                      {q.question}
                    </h3>
                    {submitted && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-500" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options A, B, C, D Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                      const optText = q.options[optKey];
                      const isSelected = selectedOpt === optKey;
                      const isOptionCorrect = q.correctAnswer === optKey;

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isSelected) {
                        btnStyle = 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs';
                      }

                      if (submitted) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optKey}
                          onClick={() => handleOptionSelect(q.id, optKey)}
                          disabled={submitted}
                          className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-white/80 border text-xs font-bold flex items-center justify-center shrink-0">
                            {optKey}
                          </span>
                          <span className="leading-snug pt-0.5">{optText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Section after Submission */}
                  {submitted && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1 mt-4">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        EduGenie Explanation:
                      </div>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {!submitted && (
            <div className="text-center pt-4">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl transition disabled:opacity-50"
              >
                Submit All Answers ({Object.keys(userAnswers).length} / {questions.length} Answered)
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
