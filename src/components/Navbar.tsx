import React, { useState } from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Bot, 
  FileText, 
  FileSearch, 
  HelpCircle, 
  Award, 
  LayoutDashboard, 
  Info, 
  Mail, 
  Key, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiKeyModal } from './ApiKeyModal';
import { getCustomApiKey } from '../services/geminiService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, setOpenAuthModal } = useAuth();
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const hasApiKey = Boolean(getCustomApiKey());

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'aitutor', label: 'AI Tutor', icon: Bot },
    { id: 'notes', label: 'Smart Notes', icon: FileText },
    { id: 'summarizer', label: 'Summarizer', icon: FileSearch },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'examprep', label: 'Exam Prep', icon: Award },
    { id: 'subjects', label: 'Subjects', icon: GraduationCap },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 p-0.5 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <GraduationCap className="w-5 h-5 text-indigo-600 group-hover:rotate-6 transition-transform" />
                  <Sparkles className="w-3 h-3 text-amber-400 absolute top-1 right-1 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    EduGenie
                  </span>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                    Gemini AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden sm:inline">
                  Smart College Learning Assistant
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-102'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* API Key Modal Button */}
              <button
                onClick={() => setIsApiKeyOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  hasApiKey
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 animate-pulse-subtle'
                }`}
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{hasApiKey ? 'API Connected' : 'API Key'}</span>
              </button>

              {user ? (
                /* User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <span className="max-w-[100px] truncate">{user.displayName || 'Student'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Action Buttons */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenAuthModal(true)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setOpenAuthModal(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-sm shadow-indigo-200 transition"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsApiKeyOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              {!user ? (
                <button
                  onClick={() => {
                    setOpenAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl text-center shadow-md"
                >
                  Log In / Sign Up
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-50 text-rose-600 font-semibold text-sm rounded-xl text-center border border-rose-100"
                >
                  Sign Out ({user.displayName})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* API Key Modal */}
      <ApiKeyModal isOpen={isApiKeyOpen} onClose={() => setIsApiKeyOpen(false)} />
    </>
  );
};
