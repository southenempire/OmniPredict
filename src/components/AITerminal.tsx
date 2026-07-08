import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
}

export const AITerminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'OmniAI Terminal initialized. Connected to Flare State Connector and FTSO nodes. How can I assist your predictions today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const sysMsg: Message = {
        id: Date.now().toString() + 'sys',
        sender: 'system',
        text: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, sysMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString() + 'err',
        sender: 'system',
        text: 'Error connecting to OmniAI core. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="ai-terminal">
      <div className="terminal-header">
        <FontAwesomeIcon icon={faTerminal} style={{ color: 'var(--cyan)' }} />
        <span>OmniAI Link (Encrypted)</span>
        <div className="terminal-status">
          <span className="dot" style={{ background: '#00ff87' }}></span> FTSO Active
        </div>
      </div>
      
      <div className="terminal-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`terminal-message ${msg.sender}`}>
            <span className="msg-prefix">{msg.sender === 'user' ? '>>' : 'sys$'}</span>
            <span className="msg-text">{msg.text}</span>
          </div>
        ))}
        {isTyping && (
          <div className="terminal-message ai typing-indicator">
            <span className="msg-prefix">sys$</span>
            <span className="msg-text">Analyzing network data<span className="dots">...</span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="terminal-input-container" onSubmit={handleSend}>
        <span className="input-prefix">&gt;&gt;</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for market analysis..."
          className="terminal-input"
        />
        <button type="submit" className="terminal-submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};
