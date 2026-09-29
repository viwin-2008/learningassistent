import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles
} from 'lucide-react';
import type { ContactSubmission } from '../types';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live Community Feedback Feed
  const [feedbackList, setFeedbackList] = useState<ContactSubmission[]>([
    {
      name: 'Marcus Vance',
      email: 'm.vance@mit.edu',
      rating: 5,
      category: 'Feature Request',
      message: 'The Microprocessor notes generator is incredible! Could you add 8051 microcontroller notes in the future?',
      date: '2026-09-28'
    },
    {
      name: 'Ananya Roy',
      email: 'ananya.roy@cs.edu',
      rating: 5,
      category: 'Feedback',
      message: 'EduGenie saved my DBMS semester exam. The ACID transactions breakdown was super clear.',
      date: '2026-09-29'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    setTimeout(() => {
      const newEntry: ContactSubmission = {
        name,
        email,
        rating,
        category,
        message,
        date: new Date().toISOString().split('T')[0]
      };
      setFeedbackList([newEntry, ...feedbackList]);
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3500);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Contact & Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Support & Feedback</h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Have questions, feedback, or subject requests? Drop us a message and rate your experience with EduGenie.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FORM COLUMN */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-xs text-slate-500">We respond to student inquiries within 24 hours</p>
            </div>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your feedback has been submitted successfully to EduGenie.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option>Feedback</option>
                  <option>Feature Request</option>
                  <option>Subject Suggestion</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rate EduGenie</label>
                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what features or subjects you would like to see next..."
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT STREAM COLUMN: Student Reviews Feed */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Recent Student Reviews
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Community Stream
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {feedbackList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{item.message}"
                </p>
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
