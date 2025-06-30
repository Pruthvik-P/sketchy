'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
  color: string;
}

interface ChatPanelProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  users: User[];
}

export function ChatPanel({ messages, currentUserId, onSendMessage, users }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const getUserColor = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.color || '#6B7280';
  };

  const getUserInitial = (userName: string) => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Chat</h3>
          <span className="text-sm text-muted-foreground">({messages.length})</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${
                  message.userId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback 
                    className="text-white text-sm font-medium"
                    style={{ backgroundColor: getUserColor(message.userId) }}
                  >
                    {getUserInitial(message.userName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${message.userId === currentUserId ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{message.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  
                  <div
                    className={`inline-block max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.userId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Typing indicator could go here */}
        <div className="mt-2 text-xs text-muted-foreground">
          {users.length > 1 && (
            <span>{users.length - 1} other{users.length > 2 ? 's' : ''} online</span>
          )}
        </div>
      </div>
    </div>
  );
}