"use client";

import { User, Bot, Copy, Pencil, HelpCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Block } from "@/types/db";

interface MessageBlockProps {
  block: Block;
  isLast: boolean;
  isMain?: boolean;
  onBranch?: (blockId: string) => void;
}

export function MessageBlock({ block, isLast, isMain = true, onBranch }: MessageBlockProps) {
  // SVGやボタンの配置に使用する定数
  const CONTAINER_HEIGHT = 80;
  const CENTER_Y = CONTAINER_HEIGHT / 2; // 40px (中間地点)
  const LINE_COLOR = "text-gray-300"; // 薄いグレーに変更
  const LINE_WIDTH = "1.5"; // 線を細く (2 -> 1.5)

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* ------------------------------------------------
          1. メッセージカード本体
      -------------------------------------------------- */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm z-10">
        
        {/* --- User Row --- */}
        <div className="flex gap-4 mb-6 justify-end items-start">
          <div className="flex flex-col gap-3 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
              <Copy className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors" title="Edit">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#E6F0FF] rounded-2xl rounded-tr-sm px-6 py-4 text-foreground/90 min-w-[120px] max-w-xl">
            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{block.user_content}</p>
          </div>

          <div className="shrink-0 pt-1">
             <div className="h-10 w-10 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
               <User className="h-5 w-5 text-muted-foreground" />
             </div>
          </div>
        </div>

        {/* --- AI Row --- */}
        <div className="flex justify-between items-start">
          <div className="shrink-0 pt-1">
             <div className="h-10 w-10 rounded-full border border-gray-100 bg-white flex items-center justify-center shadow-sm">
               <Bot className="h-5 w-5 text-foreground" />
             </div>
          </div>

          <div className="flex flex-col flex-1 mx-4">
            <div className="border border-gray-200 rounded-2xl rounded-tl-sm px-6 py-4 w-full bg-white mb-2 text-foreground/90">
               <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{block.ai_content}</p>
            </div>
            
            <div className="flex justify-start">
               <button className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Copy Response">
                 <Copy className="h-4 w-4" />
               </button>
            </div>
          </div>

          <div className="w-10 shrink-0" aria-hidden="true" />
        </div>
      </div>

      {/* ------------------------------------------------
          2. 接続・分岐 UI (修正版)
      -------------------------------------------------- */}
      <div className="relative w-[200px] -mt-2 z-0" style={{ height: CONTAINER_HEIGHT }}>
        
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
          
          {/* 共通: 上から降りてくる縦線 (中間地点のドットまで) */}
          <line 
            x1="100" y1="0" 
            x2="100" y2={CENTER_Y} 
            stroke="currentColor" 
            strokeWidth={LINE_WIDTH} 
            className={LINE_COLOR} 
          />
          
          {/* ノード (黒丸) - 完全に中間に配置 */}
          <circle 
            cx="100" cy={CENTER_Y} 
            r="3.5" 
            fill="currentColor" 
            className="text-foreground" 
          />

          {isLast ? (
            /* --- 末尾ブロック: 分岐ライン --- */
            <>
              {/* 左への分岐 (To Checkmark) 
                  始点(100, 15) -> 終点(60, 40: ボタンの右端, Yはセンター)
              */}
              <path 
                d={`M 100 15 C 100 ${CENTER_Y} 80 ${CENTER_Y} 60 ${CENTER_Y}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={LINE_WIDTH} 
                className={LINE_COLOR}
              />

              {/* 右への分岐 (To Question)
                  始点(100, 15) -> 終点(160, 32: ボタンの上端)
              */}
              <path 
                d="M 100 15 C 100 35 160 10 160 32" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={LINE_WIDTH} 
                className={LINE_COLOR}
              />
            </>
          ) : (
            /* --- 途中ブロック: 下へ続く線 --- */
            <line 
              x1="100" y1={CENTER_Y} 
              x2="100" y2={CONTAINER_HEIGHT} 
              stroke="currentColor" 
              strokeWidth={LINE_WIDTH} 
              className={LINE_COLOR} 
            />
          )}
        </svg>

        {/* ボタン配置 (Lastのみ) */}
        {isLast && (
          <>
             {/* 左ボタン (✓) - 垂直位置をCENTER_Y (40px) に合わせる */}
             <div 
               className="absolute left-[20px] -translate-y-1/2"
               style={{ top: CENTER_Y }}
             >
                <button 
                  className="h-10 w-10 rounded-full bg-[#F9FAFB] hover:bg-white border border-gray-100 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm"
                  title="Confirm / Parent"
                >
                  <Check className="h-4 w-4 text-foreground/60" />
                </button>
             </div>

             {/* 右ボタン (?) - 線が上に刺さるので、少し下に配置 */}
             <div 
               className="absolute left-[140px]"
               style={{ top: 32 }} // パスの終点Yに合わせる
             >
                <button 
                  onClick={() => onBranch?.(block.block_id)}
                  className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-foreground hover:bg-foreground hover:text-white flex items-center justify-center transition-all shadow-sm group"
                  title="New Branch"
                >
                  <HelpCircle className="h-5 w-5 text-foreground group-hover:text-white" />
                </button>
             </div>
          </>
        )}
      </div>
    </div>
  );
}