// "use client";

// import { useEffect, use, useState, useRef } from "react";
// import { ChatDetailResponse } from "@/types/db";
// import { Header } from "@/components/header";
// import { MessageBlock } from "@/components/chat/message-block"; // 作成したコンポーネント
// import { Button } from "@/components/ui/button";
// import { Send, Plus } from "lucide-react";

// interface ChatPageProps {
//   params: Promise<{ id: string }>;
// }

// export default function ChatPage({ params }: ChatPageProps) {
//   const { id } = use(params);
//   const [chatData, setChatData] = useState<ChatDetailResponse | null>(null);
//   const [input, setInput] = useState("");
//   // 自動スクロール用のref
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const res = await fetch(`/api/chats/${id}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         setChatData(data);
//       } catch (e) {
//         console.error(e);
//       }
//     };
//     fetchChat();
//   }, [id]);

//   // ブランチ作成ボタンが押されたときの処理 (まだログ出しのみ)
//   const handleBranch = (blockId: string) => {
//     console.log(`Create new branch from block: ${blockId}`);
//     alert(`「${blockId}」からブランチを切ります（機能実装予定）`);
//   };

//   if (!chatData) return <div className="p-8 text-muted-foreground">Loading...</div>;

//   return (
//     <>
//       <Header title={chatData.chat_title} className="bg-background" />

//       <main className="flex-1 bg-background relative flex flex-col">
//         {/* メッセージリストエリア */}
//         <div className="flex-1 overflow-y-auto p-4 pb-40">
//            {/* ブランチ情報などのメタデータ表示 (必要なら) */}
//            <div className="max-w-3xl mx-auto mb-8 p-4 border rounded-lg bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
//              <div className="flex items-center gap-2">
//                <span className="font-mono bg-background px-1.5 py-0.5 rounded border">
//                  {chatData.branches[0]?.branch_title || "Main"}
//                </span>
//                <span>Active Branch</span>
//              </div>
//              <div>ID: {chatData.chat_id}</div>
//            </div>

//            {/* メッセージブロックのレンダリング */}
//            {chatData.blocks.map((blk, index) => (
//              <MessageBlock 
//                key={blk.block_id} 
//                block={blk} 
//                isLast={index === chatData.blocks.length - 1}
//                onBranch={handleBranch}
//              />
//            ))}
//            <div ref={scrollRef} />
//         </div>

//         {/* 入力エリア (固定) */}
//         <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t p-4">
//           <div className="max-w-3xl mx-auto relative">
//             <div className="bg-muted/30 border rounded-2xl p-2 flex items-end gap-2 focus-within:ring-1 ring-primary/20 transition-all">
//               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground shrink-0">
//                 <Plus className="h-5 w-5" />
//               </Button>
              
//               <textarea 
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Reply to Main Branch..."
//                 className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 min-h-[44px] max-h-[200px]"
//                 rows={1}
//               />
              
//               <Button size="icon" className="h-10 w-10 rounded-full shrink-0">
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="text-center text-[10px] text-muted-foreground mt-2">
//               AI can make mistakes. Please check important information.
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { MessageBlock, ConnectorConfig } from "@/components/chat/message-block"; 
import { Block } from "@/types/db";

// --- テスト用のダミーブロックデータを作成 ---
const createMockBlock = (id: string, text: string): Block => ({
  block_id: id,
  branch_id: "b-test",
  user_content: "テスト用プロンプト: " + text,
  ai_content: "これはコネクタの表示パターンのテストです。\nUIを確認してください。",
  created_at: new Date().toISOString(),
  update_at: new Date().toISOString(),
});

const mockBlocks = {
  block1: createMockBlock("1", "通常・継続"),
  block2: createMockBlock("2", "省略・継続"),
  block3: createMockBlock("3", "メインブランチ末端"),
  block4: createMockBlock("4", "ネスト最大末端"),
  block5: createMockBlock("5", "省略・末端"),
};

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const title = "コネクタUI パターン確認";

  return (
    <>
      <Header title={title} className="bg-background" />

      <main className="flex-1 bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-0 pb-20">
          
          {/* パターン1: 通常・継続 */}
          <MessageBlock 
            block={mockBlocks.block1} 
            connector={{ style: "straight", type: "continue" }} 
          />

          {/* パターン2: ブランチ済み・継続 (太陽アイコン) */}
          <MessageBlock 
            block={mockBlocks.block2} 
            connector={{ style: "branched", type: "continue" }} 
          />

          {/* パターン3: メインブランチ末端 */}
          <MessageBlock 
            block={mockBlocks.block3} 
            connector={{ 
              style: "straight", 
              type: "split", 
              options: { showReturn: false, showBranch: true } 
            }} 
          />

          {/* パターン4: ネスト最大末端 */}
          <MessageBlock 
            block={mockBlocks.block4} 
            connector={{ 
              style: "straight", 
              type: "split", 
              options: { showReturn: true, showBranch: false } 
            }} 
          />

          {/* パターン5: ブランチ済み・末端 (太陽アイコン + 分岐) */}
          <MessageBlock 
            block={mockBlocks.block5} 
            connector={{ 
              style: "branched", 
              type: "split", 
              options: { showReturn: true, showBranch: true } 
            }} 
          />

        </div>
      </main>
    </>
  );
}