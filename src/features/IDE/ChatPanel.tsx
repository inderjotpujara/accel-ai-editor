'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Message {
  id: number;
  text: string;
  role: 'user' | 'assistant';
}

export const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, role: 'user' };
    setMessages([...messages, userMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full border-t border-gray-200">
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role === 'user' ? 'text-right' : ''}>
            <div
              className={
                'inline-block px-2 py-1 rounded ' +
                (msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900')
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-200 flex space-x-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask the coding agent..."
        />
        <Button size="sm" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};
