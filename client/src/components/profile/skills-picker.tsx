"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SKILL_OPTIONS, skillIdsToNames } from "@/lib/constants/profile-options";
import { cn } from "@/lib/utils";

export function SkillsPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILL_OPTIONS;
    return SKILL_OPTIONS.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);
  };

  const selectedNames = skillIdsToNames(value);

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((id, i) => (
            <Badge key={id} variant="secondary" className="gap-1 pr-1">
              {selectedNames[i] ?? id}
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-label={`Remove ${selectedNames[i] ?? id}`}
                className="hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        placeholder="Search skills…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="max-h-40 overflow-y-auto rounded-md border border-input p-2">
        <div className="flex flex-wrap gap-1.5">
          {filtered.map((skill) => {
            const isSelected = value.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggle(skill.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  isSelected
                    ? "border-primary/40 bg-primary/20 text-foreground"
                    : "border-input text-muted-foreground hover:bg-white/5"
                )}
              >
                {skill.name}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-muted-foreground p-2 text-xs">No skills match &quot;{query}&quot;</p>
          )}
        </div>
      </div>
    </div>
  );
}
