import React, { useState, useRef, useEffect } from 'react';
import { Gamepad2, AlertCircle, Trash2 } from 'lucide-react';
import { generateGodotAdvice } from './services/geminiService';
import InputForm from './components/InputForm';
import MarkdownRenderer from './components/MarkdownRenderer';
import { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Call API
    const responseText = await generateGodotAdvice(text);

    // Add model response
    const modelMsg: Message = {
      role: 'model',
      content: responseText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const clearChat = () => {
    if (window.confirm("会話履歴を消去しますか？")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#11141a] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex-none bg-[#202531] border-b border-gray-700 shadow-md z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide text-gray-100">Godot Architect AI</h1>
              <p className="text-xs text-blue-400 font-medium">For Godot Engine 4.x</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="p-2 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-full transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="max-w-5xl mx-auto px-4 py-8">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-80 animate-in fade-in duration-700">
               <div className="w-24 h-24 bg-[#202531] rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-gray-700">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Godot_icon.svg" 
                   alt="Godot Logo" 
                   className="w-16 h-16 opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
                 />
               </div>
               <h2 className="text-3xl font-bold text-gray-200 mb-4">何を作りますか？</h2>
               <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                 実装したいメカニクスを教えてください。<br/>
                 <span className="text-blue-400">ノード構成</span>、
                 <span className="text-green-400">GDScript</span>、
                 <span className="text-purple-400">設定のコツ</span>を提案します。
               </p>
               
               <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                 {["2段ジャンプと壁キック", "RPGのインベントリシステム", "敵のステートマシンAI", "滑らかなカメラ追従"].map((suggestion) => (
                   <button 
                     key={suggestion}
                     onClick={() => handleSendMessage(suggestion)}
                     className="px-4 py-3 bg-[#202531] border border-gray-700 hover:border-blue-500 hover:bg-[#262c3b] rounded-lg text-sm text-gray-300 transition-all text-left"
                   >
                     {suggestion}
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[90%] lg:max-w-[85%] rounded-2xl p-6 shadow-xl ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100 rounded-tr-none' 
                        : 'bg-[#202531] border border-gray-700 text-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-lg whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#202531] border border-gray-700 rounded-2xl rounded-tl-none p-6 flex items-center gap-4 shadow-xl">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">設計図を描いています...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-[#161920] border-t border-gray-800 p-4 pb-6">
         <InputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
