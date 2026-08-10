"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Info, Loader2, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { optionLabel, skillIdsToNames, STATE_OPTIONS } from "@/lib/constants/profile-options";
import { calculateSkillMatch } from "@/lib/skill-match";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkIsConnected, sendFeedRequest } from "@/store/slices/feedSlice";
import type { User } from "@/types";

const PREVIEW_SKILL_LIMIT = 4;

export function FeedCard({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loggedInUser = useAppSelector((state) => state.auth.user);
  const pendingUserId = useAppSelector((state) => state.feed.pendingUserId);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isCheckingChat, setIsCheckingChat] = useState(false);

  const isPending = pendingUserId === user._id;
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const stateName = optionLabel(STATE_OPTIONS, user.location?.state);

  const allSkillNames = skillIdsToNames(user.skills ?? []);
  const { percentage, commonSkills } = calculateSkillMatch(
    loggedInUser?.skills ?? [],
    user.skills ?? []
  );
  const commonSkillNames = skillIdsToNames(commonSkills);
  const previewSkills = allSkillNames.slice(0, PREVIEW_SKILL_LIMIT);
  const remainingSkillsCount = allSkillNames.length - PREVIEW_SKILL_LIMIT;

  const handleSendRequest = async (status: "intrested" | "ignored") => {
    const result = await dispatch(sendFeedRequest({ userId: user._id, status }));
    if (sendFeedRequest.fulfilled.match(result)) {
      setDetailsOpen(false);
      toast.success(status === "intrested" ? "Request sent!" : "User ignored");
    } else {
      toast.error((result.payload as string) ?? "Action failed");
    }
  };

  const handleChatClick = async () => {
    setIsCheckingChat(true);
    try {
      const isConnected = await dispatch(checkIsConnected(user._id)).unwrap();
      if (isConnected) {
        router.push(`/chat/${user._id}`);
      } else {
        toast.error("🔒 Upgrade to Premium to chat with people outside your connections.");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCheckingChat(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden p-0 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/15 hover:shadow-[0_10px_15px_rgba(0,0,0,0.3)]">
        <button
          type="button"
          onClick={() => setDetailsOpen(true)}
          className="block w-full text-left"
        >
          <div className="relative flex flex-col items-center gap-3 p-6 pb-4">
            {percentage > 0 && (
              <Badge className="absolute top-4 right-4">{percentage}% match</Badge>
            )}
            <Avatar
              className={`size-28 ring-2 ring-offset-2 ring-offset-transparent ${
                user.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
              }`}
            >
              <AvatarImage src={user.photo ?? undefined} alt={user.firstName} />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-h3 flex items-center justify-center gap-1.5">
                {user.firstName} {user.lastName}
                {user.age ? (
                  <span className="text-muted-foreground text-sm font-normal">, {user.age}</span>
                ) : null}
              </h3>
              {stateName && <p className="text-muted-foreground text-xs">{stateName}, India</p>}
            </div>
            {user.bio ? (
              <p className="line-clamp-2 text-center text-sm text-muted-foreground italic">
                &quot;{user.bio}&quot;
              </p>
            ) : (
              <p className="text-muted-foreground/60 text-xs italic">No bio available</p>
            )}
          </div>
        </button>

        <CardContent className="flex flex-col gap-3 pt-0">
          {previewSkills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {previewSkills.map((name) => (
                <Badge
                  key={name}
                  variant={commonSkillNames.includes(name) ? "default" : "glass"}
                >
                  {name}
                </Badge>
              ))}
              {remainingSkillsCount > 0 && (
                <Badge variant="outline">+{remainingSkillsCount} more</Badge>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleSendRequest("ignored")}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
              Ignore
            </Button>
            <Button variant="glass" size="sm" onClick={() => setDetailsOpen(true)}>
              <Info className="size-4" />
              Details
            </Button>
            <Button size="sm" disabled={isPending} onClick={() => handleSendRequest("intrested")}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Heart className="size-4" />
              )}
              Connect
            </Button>
          </div>

          <Button variant="ghost" size="sm" disabled={isCheckingChat} onClick={handleChatClick}>
            {isCheckingChat ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessageCircle className="size-4" />
            )}
            Message
          </Button>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center gap-3">
              <Avatar
                className={`size-24 ring-2 ring-offset-2 ring-offset-transparent ${
                  user.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
                }`}
              >
                <AvatarImage src={user.photo ?? undefined} alt={user.firstName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <DialogTitle>
                {user.firstName} {user.lastName}
                {user.age ? `, ${user.age}` : ""}
              </DialogTitle>
              {stateName && <DialogDescription>{stateName}, India</DialogDescription>}
            </div>
          </DialogHeader>

          {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}

          {allSkillNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allSkillNames.map((name) => (
                <Badge key={name} variant={commonSkillNames.includes(name) ? "default" : "glass"}>
                  {name}
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleSendRequest("ignored")}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
              Ignore
            </Button>
            <Button disabled={isPending} onClick={() => handleSendRequest("intrested")}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Heart className="size-4" />
              )}
              Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
