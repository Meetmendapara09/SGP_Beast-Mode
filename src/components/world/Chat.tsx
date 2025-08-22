
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export interface Message {
  author: string;
  text: string;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export default function Chat({ messages, onSendMessage }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-container flex flex-col h-[40vh] md:h-auto md:flex-grow mt-4 md:mt-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <h3 className="text-lg font-semibold text-foreground neon-glow">Global Chat</h3>
        <div className="flex-1"></div>
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--neon-green))]"></div>
      </div>
      
      <ScrollArea className="flex-grow bg-gradient-to-b from-background/50 to-muted/30">
        <div ref={scrollAreaRef} className="h-full w-full overflow-auto">
            <div className="space-y-3 p-4">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.author === 'You' ? 'own-message ml-8' : 'mr-8'}`}>
                  <div className="flex items-start gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${msg.author === 'You' 
                        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' 
                        : msg.author === 'System' || msg.author === 'Server'
                        ? 'bg-gradient-to-br from-muted to-muted-foreground text-muted-foreground'
                        : 'bg-gradient-to-br from-accent to-primary text-accent-foreground'
                      }
                      shadow-lg
                    `}>
                      {msg.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`
                          font-bold text-sm
                          ${msg.author === 'You' 
                            ? 'text-primary' 
                            : (msg.author === 'System' || msg.author === 'Server') 
                            ? 'text-muted-foreground' 
                            : 'text-accent'
                          }
                        `}>
                          {msg.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-foreground break-words leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
        </div>
      </ScrollArea>
      
      <Separator className="bg-border/50" />
      
      <form onSubmit={handleSubmit} className="p-4 bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="chat-input flex-grow bg-input/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/70"
            maxLength={500}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="game-button shrink-0 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground"
            disabled={!inputValue.trim()}
          >
            <SendHorizonal className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send</span>
          <span>{inputValue.length}/500</span>
        </div>
      </form>
    </div>
  );
}
