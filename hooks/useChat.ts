import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Aquí puedes implementar la lógica para obtener la respuesta del bot
    // Por ahora, solo agregamos un mensaje de ejemplo
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Gracias por tu mensaje. Estoy procesando tu solicitud...',
      sender: 'bot',
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return {
    messages,
    sendMessage,
  };
} 