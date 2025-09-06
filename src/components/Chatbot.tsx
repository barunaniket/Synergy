import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Mic, Globe, RefreshCw } from 'lucide-react';
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

// --- Add SpeechRecognition interface for TypeScript ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm the Synergy AI Assistant. How can I help you today? You can also use the microphone to talk to me.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [recognitionLang, setRecognitionLang] = useState('en-IN'); // Default to English (India)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, recognitionError]);

  // --- Speech Recognition Logic ---
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setRecognitionError(null); // Clear previous errors
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'network') {
        setRecognitionError("Voice service unavailable. Please check your network connection.");
      } else if (event.error === 'no-speech') {
        setRecognitionError("No speech was detected. Please make sure your microphone is working.");
      } else {
        setRecognitionError("An error occurred with voice recognition.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognition) {
        alert("Sorry, your browser does not support voice recognition.");
        return;
    }

    setRecognitionError(null); // Clear error on new attempt

    if (isListening) {
        recognition.stop();
        setIsListening(false);
    } else {
        setInput('');
        recognition.lang = recognitionLang;
        recognition.start();
        setIsListening(true);
    }
  };


  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const historyForAI = messages
        .filter((msg, index) => !(index === 0 && msg.role === 'model'))
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
    if (e.key === 'Enter' && !isListening) {
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
            {/* Header with Language Selector */}
            <header className="flex items-center justify-between p-4 border-b border-border bg-background rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Synergy AI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Globe size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                  <select
                    value={recognitionLang}
                    onChange={(e) => setRecognitionLang(e.target.value)}
                    className="pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-surface appearance-none focus:ring-1 focus:ring-primary focus:outline-none"
                    title="Select voice language"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">हिन्दी (Hindi)</option>
                  </select>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
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
              {recognitionError && (
                  <div className="flex flex-col items-center justify-center gap-2 my-2">
                      <p className="text-xs text-red-500 bg-red-100/50 px-3 py-1 rounded-full">{recognitionError}</p>
                      <button onClick={handleToggleListening} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <RefreshCw size={12} />
                        Try Again
                      </button>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="p-4 border-t border-border bg-background rounded-b-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Ask a question..."}
                  className="w-full p-3 pr-4 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none flex-1"
                  disabled={isLoading}
                />
                <button
                    onClick={handleToggleListening}
                    className={`p-3 rounded-lg border border-transparent transition-colors ${isListening ? 'text-red-500 bg-red-100/50' : 'text-text-secondary hover:text-primary hover:bg-primary/10'}`}
                    title={isListening ? 'Stop listening' : 'Use microphone'}
                >
                    <Mic size={18} />
                </button>
                <button
                  onClick={handleSend}
                  disabled={isLoading || input.trim() === ''}
                  className="p-3 bg-primary rounded-lg text-white hover:bg-primary/90 disabled:bg-primary/50 transition-colors"
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
        <AnimatePresence mode="wait">
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