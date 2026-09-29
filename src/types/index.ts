export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  subject?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizResult {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface SavedNote {
  id: string;
  topic: string;
  subject: string;
  type: 'Short' | 'Detailed';
  content: string;
  date: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  iconName: string;
  color: string;
  description: string;
  topicsCount: number;
  keyTopics: string[];
  sampleQuestion: string;
}

export interface UserStats {
  questionsAnswered: number;
  quizzesCompleted: number;
  averageScore: number;
  topicsCompleted: number;
  studyHours: number;
  streakDays: number;
  savedNotes: SavedNote[];
  quizHistory: QuizResult[];
}

export interface ExamPrepTopic {
  id: string;
  subject: string;
  title: string;
  importance: 'High' | 'Medium' | 'Critical';
  completed: boolean;
  notesSummary: string;
  sampleQuestion: string;
  sampleAnswer: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  date: string;
}
