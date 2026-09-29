import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  return (
    <div className="prose prose-indigo max-w-none text-slate-800 dark:text-slate-100 leading-relaxed text-sm md:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl md:text-2xl font-bold text-indigo-900 mt-4 mb-3 border-b border-indigo-100 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-bold text-indigo-800 mt-4 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base md:text-lg font-semibold text-slate-900 mt-3 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-slate-700" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-4 text-slate-700 pl-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-700 pl-2" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/60 p-3 rounded-r-lg my-3 italic text-indigo-900" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-slate-200 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-indigo-50 text-indigo-900 font-semibold" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-2.5 text-left border-b border-slate-200" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-slate-100 text-slate-700" {...props} />,
          code: ({ node, inline, className, children, ...props }: any) => {
            const codeString = String(children).replace(/\n$/, '');
            if (inline) {
              return (
                <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-xs md:text-sm font-medium border border-indigo-100" {...props}>
                  {children}
                </code>
              );
            }

            const codeId = Math.floor(Math.random() * 100000);
            return (
              <div className="relative my-4 rounded-xl overflow-hidden bg-slate-900 text-slate-100 shadow-md">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 text-xs text-slate-400 font-mono border-b border-slate-700">
                  <span>Code Snippet</span>
                  <button
                    onClick={() => handleCopyCode(codeString, codeId)}
                    className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded transition text-xs"
                  >
                    {copiedCodeIndex === codeId ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-indigo-200">
                  <code>{children}</code>
                </pre>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
