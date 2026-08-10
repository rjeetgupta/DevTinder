import { Globe } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { optionLabel, skillIdsToNames, STATE_OPTIONS } from "@/lib/constants/profile-options";

export interface ProfilePreviewData {
  firstName: string;
  lastName?: string;
  age?: number | string | null;
  bio?: string;
  skills: string[];
  state?: string;
  photoPreview?: string | null;
  isPremium?: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
}

const SOCIAL_LINKS: Array<{
  key: keyof ProfilePreviewData;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = [
  { key: "githubUrl", icon: FaGithub, label: "GitHub" },
  { key: "linkedinUrl", icon: FaLinkedin, label: "LinkedIn" },
  { key: "twitterUrl", icon: FaXTwitter, label: "Twitter" },
  { key: "portfolioUrl", icon: Globe, label: "Portfolio" },
];

export function ProfilePreviewCard({ data }: { data: ProfilePreviewData }) {
  const initials = `${data.firstName?.[0] ?? ""}${data.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const skillNames = skillIdsToNames(data.skills);
  const stateName = optionLabel(STATE_OPTIONS, data.state);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <Avatar
          className={`size-28 ring-2 ring-offset-2 ring-offset-transparent ${
            data.isPremium ? "ring-primary ring-offset-background shadow-[0_0_16px_rgba(245,158,11,0.35)]" : "ring-primary/50"
          }`}
        >
          <AvatarImage src={data.photoPreview ?? undefined} alt={data.firstName} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="text-h3 flex items-center justify-center gap-1.5">
            {data.firstName || "Your name"} {data.lastName}
            {data.age ? (
              <span className="text-muted-foreground text-sm font-normal">, {data.age}</span>
            ) : null}
          </h3>
          {stateName && <p className="text-muted-foreground text-xs">{stateName}, India</p>}
        </div>

        {data.bio ? (
          <p className="text-sm italic text-muted-foreground line-clamp-3">&quot;{data.bio}&quot;</p>
        ) : (
          <p className="text-muted-foreground/60 text-xs italic">No bio yet</p>
        )}

        {skillNames.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {skillNames.slice(0, 6).map((name) => (
              <Badge key={name} variant="glass">
                {name}
              </Badge>
            ))}
            {skillNames.length > 6 && (
              <Badge variant="outline">+{skillNames.length - 6} more</Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          {SOCIAL_LINKS.map(({ key, icon: Icon, label }) => {
            const url = data[key] as string | undefined;
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
