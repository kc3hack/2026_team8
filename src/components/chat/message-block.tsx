"use client";

import { User, Bot, Copy, Pencil, HelpCircle, Check } from "lucide-react";
import { Block } from "@/types/db";

// コネクタの設定型定義
export type ConnectorConfig = {
    style: "straight" | "branched"; // 名前変更: zigzag -> branched
    type: "continue" | "split";
    options?: {
        showReturn?: boolean;
        showBranch?: boolean;
    };
};

interface MessageBlockProps {
    block: Block;
    connector: ConnectorConfig;
    onBranch?: (blockId: string) => void;
}

export function MessageBlock({ block, connector, onBranch }: MessageBlockProps) {
    const { style, type, options } = connector;
    const isSplit = type === "split";
    const isBranched = style === "branched"; // 変数名も変更

    // --- レイアウト定数 ---
    const INTER_HEIGHT = 80;
    const INTER_DOT_Y = 45;
    const LAST_HEIGHT = 140;
    const SPLIT_START_Y = 20;
    const MAIN_NODE_Y = 110;

    const BTN_CY = 60;
    const LEFT_BTN_CX = 40;
    const RIGHT_BTN_CX = 160;

    const LINE_COLOR = "text-gray-300";
    const LINE_WIDTH = "2";

    // --- 太陽型ノード (ブランチが切られている状態を表す) ---
    // 名前変更: ZigzagNode -> BranchNode
    const BranchNode = ({ cy }: { cy: number }) => {
        const spikes = 10;
        const outerRadius = 12;
        const innerRadius = 7;

        let points = "";
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            // -Math.PI / 2 で12時の方向から描画開始
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            const x = 100 + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            points += `${x},${y} `;
        }

        return (
            <g>
                {/* 背景の線を隠すための白円 */}
                <circle cx="100" cy={cy} r={outerRadius} fill="white" />
                {/* ギザギザ部分 */}
                <polygon points={points} fill="currentColor" className={LINE_COLOR} />
                {/* 中抜きの白円 */}
                <circle cx="100" cy={cy} r={5} fill="white" />
            </g>
        );
    };

    return (
        <div className="flex flex-col items-center w-full">

            {/* 1. メッセージカード本体 */}
            <div className="relative w-full max-w-3xl bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm z-10">
                <div className="flex gap-4 mb-6 justify-end items-start">
                    <div className="flex flex-col gap-3 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-muted-foreground hover:text-foreground transition-colors"><Copy className="h-4 w-4" /></button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-4 w-4" /></button>
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
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><Copy className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <div className="w-10 shrink-0" aria-hidden="true" />
                </div>
            </div>

            {/* 2. 接続・分岐 UI */}
            <div className="relative w-[200px] -mt-2 z-0" style={{ height: isSplit ? LAST_HEIGHT : INTER_HEIGHT }}>

                <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">

                    {/* --- 共通: 中心線 --- */}
                    <line
                        x1="100" y1="0"
                        x2="100" y2={isSplit ? MAIN_NODE_Y : INTER_HEIGHT}
                        stroke="currentColor"
                        strokeWidth={LINE_WIDTH}
                        className={LINE_COLOR}
                    />

                    {/* --- Continue (中間ブロック) の場合 --- */}
                    {!isSplit && (
                        isBranched ? (
                            // ブランチ済み（太陽型）ノード
                            <BranchNode cy={INTER_DOT_Y} />
                        ) : (
                            // 通常の中間ドット
                            <circle cx="100" cy={INTER_DOT_Y} r="4" fill="currentColor" className={LINE_COLOR} />
                        )
                    )}

                    {/* --- Split (末端分岐) の場合 --- */}
                    {isSplit && (
                        <>
                            {/* ブランチ済み指定があれば、分岐の手前に表示 */}
                            {isBranched && <BranchNode cy={SPLIT_START_Y + 25} />}

                            {/* 末尾ドット (黒) */}
                            <circle cx="100" cy={MAIN_NODE_Y} r="5" fill="currentColor" className="text-black" />

                            {/* 左への分岐 (✓) */}
                            {options?.showReturn && (
                                <path
                                    d={`M 100 ${SPLIT_START_Y} C 100 ${BTN_CY} 80 ${BTN_CY} ${LEFT_BTN_CX + 20} ${BTN_CY}`}
                                    fill="none" stroke="currentColor" strokeWidth={LINE_WIDTH} className={LINE_COLOR}
                                />
                            )}

                            {/* 右への分岐 (?) */}
                            {options?.showBranch && (
                                <path
                                    d={`M 100 ${SPLIT_START_Y} C 100 35 ${RIGHT_BTN_CX} 25 ${RIGHT_BTN_CX} ${BTN_CY - 20}`}
                                    fill="none" stroke="currentColor" strokeWidth={LINE_WIDTH} className={LINE_COLOR}
                                />
                            )}
                        </>
                    )}
                </svg>

                {/* ボタン配置 (Split時のみ) */}
                {isSplit && (
                    <>
                        {options?.showReturn && (
                            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: LEFT_BTN_CX, top: BTN_CY }}>
                                <button className="h-10 w-10 rounded-full bg-[#F9FAFB] hover:bg-white border border-gray-100 hover:border-gray-300 flex items-center justify-center transition-all shadow-sm">
                                    <Check className="h-4 w-4 text-foreground/60" />
                                </button>
                            </div>
                        )}
                        {options?.showBranch && (
                            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: RIGHT_BTN_CX, top: BTN_CY }}>
                                <button
                                    onClick={() => onBranch?.(block.block_id)}
                                    className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-foreground hover:bg-foreground hover:text-white flex items-center justify-center transition-all shadow-sm group"
                                >
                                    <HelpCircle className="h-5 w-5 text-foreground group-hover:text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}