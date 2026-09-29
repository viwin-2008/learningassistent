import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bot, 
  HelpCircle, 
  Award, 
  Sparkles, 
  FileText, 
  X
} from 'lucide-react';
import type { SubjectItem } from '../types';

interface SubjectsProps {
  setActiveTab: (tab: string) => void;
}

export const Subjects: React.FC<SubjectsProps> = ({ setActiveTab }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'Notes' | 'Explanation' | 'Quiz' | 'Questions'>('Notes');

  const subjects: SubjectItem[] = [
    {
      id: 'python',
      name: 'Python Programming',
      code: 'CS-101',
      iconName: 'Code',
      color: 'from-blue-500 to-cyan-500',
      description: 'Object-oriented programming, data structures, lambda expressions, and file handling in Python.',
      topicsCount: 14,
      keyTopics: ['Decorators & Generators', 'OOP Concepts', 'Pandas & NumPy Basics', 'Exception Handling'],
      sampleQuestion: 'Explain the difference between deepcopy and shallowcopy in Python.'
    },
    {
      id: 'java',
      name: 'Java & Object-Oriented Programming',
      code: 'CS-102',
      iconName: 'Code',
      color: 'from-orange-500 to-amber-500',
      description: 'JVM architecture, inheritance, polymorphism, multithreading, and collections framework.',
      topicsCount: 16,
      keyTopics: ['JVM & Garbage Collection', 'Multithreading', 'Collections API', 'Interfaces vs Abstract Classes'],
      sampleQuestion: 'Why is String immutable in Java?'
    },
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      code: 'CS-201',
      iconName: 'BookOpen',
      color: 'from-indigo-500 to-purple-600',
      description: 'Arrays, Linked Lists, Stacks, Queues, B-Trees, Graph Traversal (BFS/DFS), and Dynamic Programming.',
      topicsCount: 20,
      keyTopics: ['Binary Search Trees', 'Graph Algorithms', 'Time Complexity Analysis', 'Sorting Algorithms'],
      sampleQuestion: 'Derive the time complexity of QuickSort in best and worst cases.'
    },
    {
      id: 'mp',
      name: 'Microprocessor & Assembly',
      code: 'EC-301',
      iconName: 'Cpu',
      color: 'from-rose-500 to-pink-600',
      description: '8086 Architecture, bus interfaces, instruction pipelining, interrupts, and 8255 PPI interfacing.',
      topicsCount: 12,
      keyTopics: ['8086 Architecture', 'Instruction Pipelining', 'Addressing Modes', 'Memory Interfacing'],
      sampleQuestion: 'Explain BIU and EU in 8086 microprocessor.'
    },
    {
      id: 'dbms',
      name: 'Database Management Systems',
      code: 'CS-204',
      iconName: 'Database',
      color: 'from-emerald-500 to-teal-600',
      description: 'Relational algebra, SQL queries, B-Tree indexing, ACID transactions, normalization (1NF-BCNF).',
      topicsCount: 15,
      keyTopics: ['Normalization (1NF to BCNF)', 'ACID Transactions', 'SQL Joins & Indexing', 'ER Diagrams'],
      sampleQuestion: 'What is 3NF and how does it prevent insertion anomalies?'
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      code: 'CS-302',
      iconName: 'Network',
      color: 'from-cyan-500 to-blue-600',
      description: 'OSI 7-Layer Model, TCP/IP protocol stack, IP addressing, routing algorithms, and socket programming.',
      topicsCount: 18,
      keyTopics: ['OSI 7 Layers', 'TCP vs UDP Protocols', 'Subnetting & CIDR', 'DNS & HTTP/S'],
      sampleQuestion: 'Differentiate between Connection-Oriented and Connectionless services.'
    },
    {
      id: 'os',
      name: 'Operating Systems',
      code: 'CS-203',
      iconName: 'HardDrive',
      color: 'from-purple-500 to-indigo-700',
      description: 'Process scheduling, virtual memory, paging, deadlock handling, semaphore synchronization.',
      topicsCount: 15,
      keyTopics: ['Process Synchronization & Semaphores', 'Deadlock Avoidance (Banker Algorithm)', 'Paging & Virtual Memory', 'CPU Scheduling Algorithms'],
      sampleQuestion: 'Explain the four necessary conditions for Deadlock.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum Subject Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">College Subjects & Modules</h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Select a subject to explore AI notes, request tutor explanations, take subject quizzes, and study high-yield exam questions.
          </p>
        </div>
      </div>

      {/* SUBJECT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition`}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  {sub.code}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                  {sub.description}
                </p>
              </div>

              {/* Topics Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sub.keyTopics.slice(0, 3).map((tp, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                    {tp}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedSubject(sub);
                  setActiveSubTab('Notes');
                }}
                className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs rounded-xl transition text-center"
              >
                View Module Hub
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED SUBJECT MODAL */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-indigo-100 flex flex-col relative">
            
            {/* Modal Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedSubject.color} text-white relative`}>
              <button
                onClick={() => setSelectedSubject(null)}
                className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase bg-white/20 px-2.5 py-0.5 rounded-full">{selectedSubject.code}</span>
                <span className="text-xs font-medium">{selectedSubject.topicsCount} Key Topics</span>
              </div>
              <h2 className="text-xl font-extrabold">{selectedSubject.name}</h2>
              <p className="text-xs text-white/90 mt-1">{selectedSubject.description}</p>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
              {[
                { id: 'Notes', label: 'Structured Notes', icon: FileText },
                { id: 'Explanation', label: 'AI Tutor Explanation', icon: Bot },
                { id: 'Quiz', label: 'Take Subject Quiz', icon: HelpCircle },
                { id: 'Questions', label: 'Important Questions', icon: Award }
              ].map(tb => {
                const Icon = tb.icon;
                const isActive = activeSubTab === tb.id;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setActiveSubTab(tb.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition border-b-2 ${
                      isActive 
                        ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tb.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
              
              {activeSubTab === 'Notes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 text-sm mb-2">📌 Core Concept Summary</h4>
                    <p className="leading-relaxed">
                      {selectedSubject.name} forms the backbone of college curriculum. It emphasizes systematic design, memory allocation, and algorithmic performance.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      setActiveTab('notes');
                    }}
                    className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-center shadow-xs"
                  >
                    Generate Custom Smart Notes for {selectedSubject.name}
                  </button>
                </div>
              )}

              {activeSubTab === 'Explanation' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                    <div className="text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      EduGenie Explanation
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      Need clarification on {selectedSubject.name}? EduGenie AI provides step-by-step guidance tailored to your university syllabus.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      setActiveTab('aitutor');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-center"
                  >
                    Ask AI Tutor about {selectedSubject.name}
                  </button>
                </div>
              )}

              {activeSubTab === 'Quiz' && (
                <div className="space-y-4 text-center py-4">
                  <HelpCircle className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Ready to test your knowledge on {selectedSubject.name}?</h4>
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      setActiveTab('quiz');
                    }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md"
                  >
                    Start {selectedSubject.name} Quiz Now
                  </button>
                </div>
              )}

              {activeSubTab === 'Questions' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-rose-600 block mb-1">High-Yield Exam Question:</span>
                    <p className="font-medium text-slate-800">{selectedSubject.sampleQuestion}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      setActiveTab('examprep');
                    }}
                    className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-xl text-center"
                  >
                    Open Exam Prep Dashboard
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
