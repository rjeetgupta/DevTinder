"use client";

import { use } from "react";
import { MessageSquareText } from "lucide-react";

import { ChatList } from "@/components/chat/chat-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId?: string[] }>;
}) {
  useDocumentTitle("Chat");
  const { userId } = use(params);
  const activeUserId = userId?.[0];

  return (
    <div className="glass flex h-full overflow-hidden rounded-lg">
      <div
        className={`w-full border-r border-white/10 sm:w-1/3 lg:w-1/4 ${
          activeUserId ? "hidden sm:block" : "block"
        }`}
      >
        <ChatList activeUserId={activeUserId} />
      </div>

      <div className={`flex-1 ${activeUserId ? "flex" : "hidden sm:flex"}`}>
        {activeUserId ? (
          <ChatWindow key={activeUserId} targetUserId={activeUserId} />
        ) : (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-3">
            <div className="glass flex size-20 items-center justify-center rounded-full">
              <MessageSquareText className="size-8" />
            </div>
            <h3 className="text-h3">Your messages</h3>
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
