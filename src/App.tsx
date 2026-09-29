import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { AiTutor } from './pages/AiTutor';
import { SmartNotes } from './pages/SmartNotes';
import { PdfSummarizer } from './pages/PdfSummarizer';
import { QuizGenerator } from './pages/QuizGenerator';
import { ExamPrep } from './pages/ExamPrep';
import { Subjects } from './pages/Subjects';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'aitutor':
        return <AiTutor />;
      case 'notes':
        return <SmartNotes />;
      case 'summarizer':
        return <PdfSummarizer />;
      case 'quiz':
        return <QuizGenerator />;
      case 'examprep':
        return <ExamPrep />;
      case 'subjects':
        return <Subjects setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <ProgressDashboard setActiveTab={setActiveTab} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto pt-4 pb-12">
        {renderActivePage()}
      </main>

      <Footer setActiveTab={setActiveTab} />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </AuthProvider>
  );
}
