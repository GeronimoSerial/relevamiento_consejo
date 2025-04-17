/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useState, useRef, useEffect, useCallback, memo, useTransition } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';

// Componente memoizado para los mensajes
const MessageBubble = memo(({ message }: { message: { id: string; text: string; sender: 'user' | 'bot'; timestamp: Date } }) => (
  <div
    className={`mb-4 flex ${
      message.sender === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[80%] rounded-lg p-3 ${
        message.sender === 'user'
          ? 'bg-[#3fa038] text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      <p className="text-sm">{message.text}</p>
      <p className="mt-1 text-xs opacity-70">
        {message.timestamp.toLocaleTimeString()}
      </p>
    </div>
  </div>
));

MessageBubble.displayName = 'MessageBubble';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim()) {
      startTransition(() => {
        sendMessage(inputValue);
        setInputValue('');
        inputRef.current?.focus();
      });
    }
  }, [inputValue, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Cerrar el chat al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          // Enfocar el input cuando se abre el chat
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#3fa038] text-white shadow-lg transition-all hover:shadow-xl"
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[400px] rounded-xl bg-white p-4 shadow-lg sm:w-80"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3fa038]">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-800">Asistente CGE</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                <span className="text-sm">Cerrar</span>
              </button>
            </div>

            <div ref={messagesContainerRef} className="mt-4 h-[60vh] max-h-[400px] overflow-y-auto">
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-[#3fa038]/10 p-3 text-center">
                  <p className="text-sm font-medium text-[#3fa038]">
                    ¡Hola! ¿Cómo podemos ayudarte?
                  </p>
                </div>
              </div>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex gap-2 border-t pt-4">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3fa038] focus:outline-none"
                disabled={isPending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isPending}
                className="flex items-center justify-center rounded-lg bg-[#3fa038] px-4 py-2 text-white transition-all hover:bg-[#2d7a2a] disabled:opacity-50 disabled:hover:bg-[#3fa038]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 