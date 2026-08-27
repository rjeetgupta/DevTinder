"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Loader2, Send, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { UserDetailDialog } from "@/components/shared/user-detail-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractErrorMessage } from "@/services/api/ApiClient";
import { chatService } from "@/services/api/ChatService";
import { userService } from "@/services/api/UserService";
import { socketService } from "@/services/socket/SocketService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchChatHistory,
  messageReceived,
  ownMessagesMarkedSeen,
  sendConnectionRequestFromChat,
  setActiveUserId,
} from "@/store/slices/chatSlice";
import type { User } from "@/types";

function formatTime(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatWindow({ targetUserId }: { targetUserId: string }) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { messages, messagesStatus } = useAppSelector((state) => state.chat);
  const isOnline = useAppSelector(
    (state) => state.userStatus.onlineUsers[targetUserId] ?? false
  );

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "not_connected"
  >("unknown");
  // const [isOnline, setIsOnline] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mark this chat active + load history whenever the target changes.
  useEffect(() => {
    dispatch(setActiveUserId(targetUserId));
    dispatch(fetchChatHistory(targetUserId));
    return () => {
      dispatch(setActiveUserId(null));
    };
  }, [dispatch, targetUserId]);

  // Load target user profile + connection gate.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [user, connected] = await Promise.all([
          userService.getUserById(targetUserId),
          chatService.isConnected(targetUserId),
        ]);
        if (!cancelled) {
          setTargetUser(user);
          setConnectionStatus(connected ? "connected" : "not_connected");
        }
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus("not_connected");
          toast.error(extractErrorMessage(error, "Could not load this conversation."));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetUserId]);

  // Socket lifecycle: announce presence, join/leave the room, wire listeners.
  useEffect(() => {
    if (!currentUser?._id) return;

    socketService.joinChat(currentUser._id, targetUserId);

    const offMessage = socketService.onReceiveMessage((msg) => {
      dispatch(
        messageReceived({
          ...msg,
          conversationUserId: targetUserId,
        })
      );

      if (msg.senderId !== currentUser._id) {
        socketService.markSeen(currentUser._id, targetUserId);
      }
    });

    const offSeen = socketService.onMessagesSeen(() => {
      if (!currentUser?._id) return;

      dispatch(
        ownMessagesMarkedSeen({
          currentUserId: currentUser._id,
        })
      );
    });

    return () => {
      socketService.leaveChat(currentUser._id, targetUserId);

      offMessage();
      offSeen();
    };
  }, [currentUser?._id, targetUserId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim() || !currentUser?._id) return;
    socketService.sendMessage(currentUser._id, targetUserId, draft.trim());
    setDraft("");
  };

  const handleConnect = async () => {
    const result = await dispatch(sendConnectionRequestFromChat(targetUserId));
    if (sendConnectionRequestFromChat.fulfilled.match(result)) {
      setConnectionStatus("connected");
      toast.success("Connection request sent!");
    } else {
      toast.error((result.payload as string) ?? "Unable to connect.");
    }
  };

  const initials =
    `${targetUser?.firstName?.[0] ?? ""}${targetUser?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";
  console.log("TARGET USER : ", targetUser)
  return (
    <div className="flex h-full w-full flex-col">
      <button
        type="button"
        onClick={() => setDetailsOpen(true)}
        className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-left hover:bg-white/5"
      >
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage
              src={targetUser?.photo ?? undefined}
              alt={targetUser?.firstName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="border-background bg-online absolute right-0 bottom-0 size-2.5 rounded-full border-2" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">
            {targetUser?.firstName} {targetUser?.lastName}
          </p>
          <p className="text-muted-foreground text-xs">
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </button>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messagesStatus === "loading" && messages.length === 0 && (
          <div className="flex justify-center py-10">
            <Loader2 className="text-muted-foreground size-5 animate-spin" />
          </div>
        )}

        {messagesStatus === "succeeded" && messages.length === 0 && (
          <div className="flex justify-center pt-10">
            <div className="glass text-muted-foreground rounded-lg px-4 py-2 text-xs">
              Start a conversation with {targetUser?.firstName ?? "them"}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser?._id;
            return (
              <div
                key={msg._id ?? idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    isMe
                      ? "brand-gradient text-primary-foreground max-w-[75%] rounded-l-2xl rounded-tr-2xl px-4 py-2 text-sm shadow-sm"
                      : "glass max-w-[75%] rounded-tl-2xl rounded-r-2xl px-4 py-2 text-sm"
                  }
                >
                  <p className="wrap-break-words leading-relaxed">{msg.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                    {isMe &&
                      (msg.seen ? (
                        <CheckCheck className="size-3.5 text-neutral-100" />
                      ) : (
                        <Check className="size-3.5" />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message…"
            className="flex-1 rounded-full"
          />
          <Button
            size="icon"
            disabled={!draft.trim()}
            onClick={handleSend}
            aria-label="Send"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>

      <UserDetailDialog
        user={targetUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        footer={
          connectionStatus === "not_connected" ? (
            <Button className="w-full" onClick={handleConnect}>
              <UserPlus className="size-4" /> Connect
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
