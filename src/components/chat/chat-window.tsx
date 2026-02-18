"use client";

import { useEffect, useState, useRef } from "react";
import { ChatDetailResponse, Block } from "@/types/db";
import { BlockList } from "@/components/chat/block-list";
import { ChatInput } from "@/components/chat/chat-input";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  chatId: string;
  className?: string; // 外部から幅や高さを調整できるようにする
}

export function ChatWindow({ chatId, className }: ChatWindowProps) {
  const [chatData, setChatData] = useState<ChatDetailResponse | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- 1. データ取得 ---
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/chats/${chatId}`);
        if (!res.ok) return;
        const data = await res.json();
        setChatData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchChat();
  }, [chatId]);

  // --- 2. 自動スクロール ---
  useEffect(() => {
    if (chatData?.blocks.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData?.blocks.length]); // ブロック数が増えた時のみ発火

  // --- 3. アクションハンドラ ---
  const handleBranchCreate = (blockId: string) => {
    console.log("Create branch from:", blockId);
    // 将来的にここにブランチ作成モーダルなどを連携
  };

  const handleSendMessage = (text: string) => {
    if (!chatData) return;

    // 楽観的UI更新
    const newBlock: Block = {
      block_id: `temp-${Date.now()}`,
      branch_id: chatData.branches[0].branch_id, // 仮: 現在のブランチID
      user_content: text,
      ai_content: "（AIが回答を生成中...）",
      created_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    setChatData({
      ...chatData,
      blocks: [...chatData.blocks, newBlock]
    });
  };

  if (!chatData) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        Loading...
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-background relative", className)}>
      
      {/* (オプション) ウィンドウごとのヘッダー/メタ情報 */}
      {/* 3画面分割時などはここにブランチ名などを出すと分かりやすい */}
      <div className="px-6 py-4 border-b bg-muted/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
           <div className="flex items-center gap-2">
             <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">
               {chatData.branches[0]?.branch_title || "Main"}
             </span>
             <span>Active Branch</span>
           </div>
           <div>ID: {chatData.chat_id}</div>
        </div>
        <h2 className="max-w-4xl mx-auto mt-1 text-lg font-bold truncate">
            {chatData.chat_title}
        </h2>
      </div>

      {/* メッセージリストエリア (スクロール可能) */}
      <div className="flex-1 overflow-y-auto px-4 pt-6">
         <div className="max-w-4xl mx-auto">
           <BlockList 
             blocks={chatData.blocks} 
             onBranchCreate={handleBranchCreate}
           />
           <div ref={bottomRef} className="h-4" />
         </div>
      </div>

      {/* 入力エリア (固定) */}
      <ChatInput onSend={handleSendMessage} />
      
    </div>
  );
}