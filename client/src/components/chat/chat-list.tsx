"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { socketService } from "@/services/socket/SocketService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchChatList } from "@/store/slices/chatSlice";

function formatTime(dateString?: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatList({ activeUserId }: { activeUserId?: string }) {
  const dispatch = useAppDispatch();
  const { list, listStatus, listError } = useAppSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  useEffect(() => {
    const offMessage = socketService.onReceiveMessage(() => {
      dispatch(fetchChatList());
    });
    const offUnread = socketService.onUnreadCountUpdated(() => {
      dispatch(fetchChatList());
    });
    return () => {
      offMessage();
      offUnread();
    };
  }, [dispatch]);

  const sortedList = useMemo(
    () =>
      [...list].sort(
        (a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()
      ),
    [list]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <h2 className="text-h3">Chats</h2>
        {sortedList.length > 0 && <Badge variant="glass">{sortedList.length}</Badge>}
      </div>

      <div className="flex-1 overflow-y-auto">
        {listStatus === "loading" && list.length === 0 && (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {listStatus === "failed" && (
          <p className="text-destructive p-4 text-sm">{listError}</p>
        )}

        {listStatus === "succeeded" && sortedList.length === 0 && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 p-10 text-center">
            <MessageSquareText className="size-8" />
            <p className="text-sm">No conversations yet</p>
          </div>
        )}

        {sortedList.map((chat) => {
          const isActive = activeUserId === chat.user._id;
          const initials =
            `${chat.user.firstName?.[0] ?? ""}${chat.user.lastName?.[0] ?? ""}`.toUpperCase() ||
            "?";

          return (
            <Link
              key={chat.chatId}
              href={`/chat/${chat.user._id}`}
              className={cn(
                "flex items-center gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-white/5",
                isActive ? "border-l-primary bg-white/5" : "border-l-transparent"
              )}
            >
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={chat.user.photo ?? undefined} alt={chat.user.firstName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={cn("truncate text-sm font-semibold", isActive && "text-primary")}>
                    {chat.user.firstName} {chat.user.lastName}
                  </h4>
                  <span className="text-muted-foreground shrink-0 text-[11px]">
                    {formatTime(chat.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-xs",
                      chat.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {chat.lastMessage || "Start a conversation"}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge className="h-4 min-w-4 justify-center px-1 text-[10px]">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
