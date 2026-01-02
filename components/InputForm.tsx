import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-end gap-2 bg-[#202531] p-2 rounded-xl border border-gray-600 shadow-2xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <div className="pl-3 pb-3 text-gray-400">
           <Sparkles className="w-5 h-5" />
        </div>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="作りたいメカニクスを入力してください (例: 2段ジャンプ、インベントリ、敵の追跡AI...)"
          className="w-full bg-transparent text-white placeholder-gray-500 text-base p-3 max-h-48 min-h-[56px] resize-none focus:outline-none scrollbar-thin scrollbar-thumb-gray-600"
          disabled={isLoading}
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-lg flex items-center justify-center transition-all ${
            input.trim() && !isLoading
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">
        Godot 4.x • GDScript 2.0 • Expert Advice
      </div>
    </form>
  );
};

export default InputForm;
