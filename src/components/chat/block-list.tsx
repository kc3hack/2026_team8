"use client";

import { Block } from "@/types/db";
import { MessageBlock, ConnectorConfig } from "./message-block";

interface BlockListProps {
  blocks: Block[];
  onBranchCreate?: (blockId: string) => void;
}

export function BlockList({ blocks, onBranchCreate }: BlockListProps) {
  if (!blocks.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-20">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-0 pb-10">
      {blocks.map((block, index) => {
        // --- コネクタの自動判定ロジック ---
        const isLast = index === blocks.length - 1;

        // 将来的には、blockデータ内に「branch_status」のような
        // フラグを持たせて、style: "branched" に切り替える判定もここで行います。
        
        let connector: ConnectorConfig;

        if (isLast) {
          // 最後のブロック: 分岐UI (Split)
          connector = {
            style: "straight", // デフォルトは直線
            type: "split",
            options: {
              showReturn: true,  // 必要に応じて制御
              showBranch: true,
            },
          };
        } else {
          // 途中のブロック: 継続線 (Continue)
          connector = {
            style: "straight",
            type: "continue",
          };
        }

        return (
          <MessageBlock
            key={block.block_id}
            block={block}
            connector={connector}
            onBranch={onBranchCreate}
          />
        );
      })}
    </div>
  );
}