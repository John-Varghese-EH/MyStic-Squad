"use client";

import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      // Placeholder for Gemini API integration
      // Replace with actual API call to Gemini for drug awareness information
      const botResponse = "This is a placeholder bot response about drug awareness.";
      setMessages(currentMessages => [...currentMessages, { text: botResponse, sender: 'bot' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-4">AI Chatbot for Drug Awareness</h1>
        <p className="mb-4">This chatbot is designed to provide information and raise awareness about drugs. (Gemini API integration coming soon)</p>
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-white">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border rounded-l-lg p-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="bg-blue-500 text-white rounded-r-lg px-6 py-3 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}