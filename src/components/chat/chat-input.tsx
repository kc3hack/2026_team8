"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Plus, Image as ImageIcon, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキスト量に合わせて高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    // 送信後に高さをリセット
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t p-4 z-20">
      <div className="max-w-3xl mx-auto relative">
        <div className="bg-muted/30 border rounded-[24px] p-2 flex items-end gap-2 focus-within:ring-1 ring-primary/20 transition-all shadow-sm">
          
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground shrink-0 hover:bg-muted">
            <Plus className="h-5 w-5" />
          </Button>
          
          <textarea 
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply to this branch..."
            className="flex-1 bg-transparent border-none outline-none resize-none py-3 min-h-[44px] max-h-[200px] text-base"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          
          {input.trim() ? (
            <Button 
              onClick={handleSend}
              size="icon" 
              className="h-10 w-10 rounded-full shrink-0 transition-all duration-200 animate-in zoom-in-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
             <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted">
                  <Mic className="h-5 w-5" />
                </Button>
             </div>
          )}
        </div>
        <div className="text-center text-[10px] text-muted-foreground mt-2">
          Git-Chat AI can make mistakes. Please check important information.
        </div>
      </div>
    </div>
  );
}