import React, { useState } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { MessageSquare, Send, ShieldCheck, User, Clock, CheckCheck, Bot } from 'lucide-react';

interface MessagesViewProps {
  initialMessages: ChatMessage[];
  user: UserProfile;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  initialMessages,
  user,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      fromId: user.id,
      toId: 'admin',
      content: inputText.trim(),
      isAdmin: false,
      isRead: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate realistic Admin Support response
    setIsTyping(true);
    setTimeout(() => {
      const adminReply: ChatMessage = {
        id: Date.now() + 1,
        fromId: 'admin',
        toId: user.id,
        content: `Thank you for contacting SlotGT Support! Our verified directory audit confirms all 47 partner platforms are currently active with valid SSL certificates. If you need assistance with promo vouchers or affiliate tags, let us know!`,
        isAdmin: true,
        isRead: true,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setMessages((prev) => [...prev, adminReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>SlotGT Direct Support & Announcements</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Official support communication thread synced with database records.
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Support Online</span>
          </span>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col h-[520px] overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isFromAdmin = msg.isAdmin || msg.fromId === 'admin';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  isFromAdmin ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isFromAdmin
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isFromAdmin ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                    isFromAdmin
                      ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                      : 'bg-emerald-600 text-slate-950 font-medium rounded-tr-xs shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] font-bold">
                    <span className={isFromAdmin ? 'text-emerald-400' : 'text-slate-950'}>
                      {isFromAdmin ? 'Admin Moderator' : 'You'}
                    </span>
                    <span
                      className={`font-mono text-[9px] ${
                        isFromAdmin ? 'text-slate-500' : 'text-slate-950/70'
                      }`}
                    >
                      {msg.createdAt.split(' ')[1] || msg.createdAt}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 items-center text-slate-400 text-xs italic">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">Admin is typing a reply...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message to Admin support..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed p-2.5 text-slate-950 transition active:scale-95 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
