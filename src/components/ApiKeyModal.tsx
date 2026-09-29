import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { getCustomApiKey, setCustomApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getCustomApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Google Gemini API Settings</h3>
            <p className="text-xs text-slate-500">Configure your key for real-time AI responses</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 text-xs text-amber-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Security Note:</span> Keys stored here are saved strictly in your browser's encrypted localStorage or proxied via Node Express backend.
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Don't have an API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 hover:underline"
            >
              Get Free Key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save API Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
