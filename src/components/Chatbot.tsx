import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User } from 'lucide-react';
import { getChatbotResponse } from '../services/gemini';
import type { Content } from '@google/generative-ai';

// Define the structure for a message
interface Message {
  role: 'user' | 'model';
  content: string;
}

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    className="flex items-center space-x-1 p-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
  </motion.div>
);

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm the Synergy AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // **THE FIX IS HERE**
    // Prepare history for the AI model, filtering out the initial greeting
    const historyForAI = messages
        .filter((msg, index) => !(index === 0 && msg.role === 'model')) // Exclude the first message if it's from the model
        .map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        })) as Content[];

    historyForAI.push({ role: 'user', parts: [{ text: input }] });

    const aiResponse = await getChatbotResponse(historyForAI);
    const modelMessage: Message = { role: 'model', content: aiResponse };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 h-[60vh] bg-surface rounded-2xl shadow-2xl border border-border flex flex-col z-50"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-border bg-background rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Synergy AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={20} />
              </button>
            </header>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-background border border-border text-text-primary rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                   {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-4 border-t border-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="w-full p-3 pr-12 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-md text-white hover:bg-primary/90 disabled:bg-primary/50"
                >
                  <Send size={18} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-8 h-14 w-14 bg-primary rounded-full text-white flex items-center justify-center shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }}>
              <Bot size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}