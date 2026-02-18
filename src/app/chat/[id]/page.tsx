"use client";

import { use } from "react";
import { Header } from "@/components/header";
import { ChatWindow } from "@/components/chat/chat-window";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);

  // ※ Headerのタイトルは、ChatWindow内でデータ取得後に
  //   親へ伝える仕組み(コールバック等)を作るか、
  //   もしくは「Git-Chat AI」固定にして、ChatWindow内にタイトルを表示する形が
  //   マルチウィンドウ化を見据えると自然です。
  //   今回は ChatWindow 内にタイトル表示を含めたため、親ヘッダーは固定タイトルにします。

  return (
    <>
      <Header title="Git-Chat AI" className="bg-background border-b" />

      <main className="flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        {/* ここに ChatWindow を配置 */}
        {/* 将来的にここを flex-row にして ChatWindow を複数並べれば分割表示になります */}
        <ChatWindow chatId={id} className="w-full h-full" />
      </main>
    </>
  );
}