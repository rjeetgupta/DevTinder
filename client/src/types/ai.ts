import { z } from "zod";

const roadmapItemSchema = z.object({
  skill: z.string(),
  reason: z.string(),
});

const mustHaveItemSchema = roadmapItemSchema.extend({
  youtube: z.object({ url: z.string().optional() }).optional(),
  udemy: z.object({ title: z.string().optional() }).optional(),
});

export const roadmapSchema = z.object({
  mustHave: z.array(mustHaveItemSchema).default([]),
  recommended: z.array(roadmapItemSchema).default([]),
  goodToKnow: z.array(roadmapItemSchema).default([]),
});

export type Roadmap = z.infer<typeof roadmapSchema>;
export type RoadmapItem = z.infer<typeof roadmapItemSchema>;
export type MustHaveItem = z.infer<typeof mustHaveItemSchema>;
