import React from 'react';
import { Copy, Terminal, Layers, Settings, BookOpen } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Simple regex-based markdown parser for specific sections relevant to the prompt
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Split content by code blocks to handle them separately
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 text-gray-300 leading-relaxed font-sans">
      {parts.map((part, index) => {
        // Handle Code Blocks
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const language = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          
          let icon = <Terminal className="w-5 h-5 text-blue-400" />;
          let label = "Code";
          let borderColor = "border-blue-500/30";
          let bgColor = "bg-[#1a1e29]"; // Darker editor bg

          if (language === 'text' || language === 'tree') {
            icon = <Layers className="w-5 h-5 text-green-400" />;
            label = "Node Structure";
            borderColor = "border-green-500/30";
            bgColor = "bg-[#161920]";
          } else if (language === 'gdscript') {
            label = "GDScript";
            borderColor = "border-blue-500/30";
          }

          return (
            <div key={index} className={`rounded-lg overflow-hidden border ${borderColor} shadow-lg my-4`}>
              <div className="flex items-center justify-between px-4 py-2 bg-[#262c3b] border-b border-gray-700">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-sm font-semibold text-gray-200">{label}</span>
                </div>
                <button 
                  onClick={() => copyToClipboard(code)}
                  className="p-1 hover:bg-gray-600 rounded transition-colors text-gray-400 hover:text-white"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className={`${bgColor} p-4 overflow-x-auto`}>
                <pre className="font-mono text-sm text-gray-300 whitespace-pre">
                  {code}
                </pre>
              </div>
            </div>
          );
        }

        // Handle Regular Text (with rudimentary bold/header parsing)
        // Note: For a production app, a robust markdown library is better, 
        // but this keeps it dependency-free as per instructions.
        return (
          <div key={index} className="prose prose-invert max-w-none">
            {part.split('\n').map((line, lineIdx) => {
              if (line.startsWith('###')) {
                // Settings / Extra sections
                const title = line.replace('###', '').trim();
                let Icon = Settings;
                if (title.includes('概要') || title.includes('Overview')) Icon = BookOpen;
                
                return (
                  <h3 key={lineIdx} className="text-xl font-bold text-blue-300 mt-6 mb-3 flex items-center gap-2 border-b border-gray-700 pb-2">
                    <Icon className="w-5 h-5" />
                    {title}
                  </h3>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                 return <h4 key={lineIdx} className="text-lg font-bold text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>
              }
              // Basic list parsing
              if (line.trim().startsWith('- ')) {
                return <li key={lineIdx} className="ml-4 list-disc text-gray-300 my-1">{line.replace('- ', '')}</li>
              }
               // Basic numeric list parsing
               if (/^\d+\./.test(line.trim())) {
                return <div key={lineIdx} className="ml-4 text-gray-300 my-1 pl-2">{line}</div>
              }

              if (line.trim() === '') return <div key={lineIdx} className="h-2"></div>;

              return <p key={lineIdx} className="mb-1">{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
