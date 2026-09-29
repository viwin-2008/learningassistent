import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserStats, SavedNote, QuizResult } from '../types';

const INITIAL_STATS: UserStats = {
  questionsAnswered: 48,
  quizzesCompleted: 12,
  averageScore: 88.5,
  topicsCompleted: 15,
  studyHours: 24.5,
  streakDays: 6,
  savedNotes: [
    {
      id: 'note_1',
      topic: 'Microprocessor Architecture & Pipelining',
      subject: 'Microprocessor',
      type: 'Detailed',
      content: 'Pipelining allows overlapping execution of multiple instructions. Fetch, Decode, Execute, Memory, Writeback.',
      date: '2026-09-28'
    },
    {
      id: 'note_2',
      topic: 'B-Trees and Indexing in DBMS',
      subject: 'Database Management Systems',
      type: 'Short',
      content: 'B-Trees maintain sorted data and allow searches, sequential access, insertions, and deletions in logarithmic time.',
      date: '2026-09-29'
    }
  ],
  quizHistory: [
    {
      id: 'quiz_1',
      topic: 'Data Structures - Trees & Graphs',
      difficulty: 'Medium',
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      date: '2026-09-29'
    },
    {
      id: 'quiz_2',
      topic: 'Python Object-Oriented Programming',
      difficulty: 'Hard',
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      date: '2026-09-27'
    }
  ]
};

interface ProgressContextType {
  stats: UserStats;
  addQuestionAnswered: () => void;
  addQuizResult: (result: QuizResult) => void;
  saveNote: (note: Omit<SavedNote, 'id' | 'date'>) => void;
  deleteSavedNote: (id: string) => void;
  incrementTopicsCompleted: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const LOCAL_STORAGE_STATS_KEY = 'edugenie_user_stats';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch (err) {
      console.error("Failed saving stats to local storage", err);
    }
  }, [stats]);

  const addQuestionAnswered = () => {
    setStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1
    }));
  };

  const addQuizResult = (result: QuizResult) => {
    setStats(prev => {
      const newHistory = [result, ...prev.quizHistory];
      const newQuizzesCompleted = prev.quizzesCompleted + 1;
      const totalPct = newHistory.reduce((acc, q) => acc + q.percentage, 0);
      const newAvgScore = Math.round((totalPct / newHistory.length) * 10) / 10;

      return {
        ...prev,
        quizzesCompleted: newQuizzesCompleted,
        averageScore: newAvgScore,
        quizHistory: newHistory
      };
    });
  };

  const saveNote = (noteData: Omit<SavedNote, 'id' | 'date'>) => {
    const newNote: SavedNote = {
      ...noteData,
      id: 'note_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setStats(prev => ({
      ...prev,
      savedNotes: [newNote, ...prev.savedNotes]
    }));
  };

  const deleteSavedNote = (id: string) => {
    setStats(prev => ({
      ...prev,
      savedNotes: prev.savedNotes.filter(n => n.id !== id)
    }));
  };

  const incrementTopicsCompleted = () => {
    setStats(prev => ({
      ...prev,
      topicsCompleted: prev.topicsCompleted + 1
    }));
  };

  return (
    <ProgressContext.Provider value={{
      stats,
      addQuestionAnswered,
      addQuizResult,
      saveNote,
      deleteSavedNote,
      incrementTopicsCompleted
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
