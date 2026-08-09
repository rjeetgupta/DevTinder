import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// POST /gemini/suggest-courses
export const suggestCourses = asyncHandler(async (req: Request, res: Response) => {
    const skills = req.user!.skills || [];

    if (skills.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, null, "Please add some skills to your profile first!")
        );
    }

    const prompt = `
        Act as a Senior Technical Career Coach.
        The user knows: ${skills.join(", ")}.
        Goal: Become a top-tier Full Stack MERN Developer.

        Analyze the gaps. Return a strict JSON object with three specific arrays.

        IMPORTANT:
        - Return ONLY valid JSON.
        - Do NOT use trailing commas.
        - Do NOT use comments inside JSON.
        - Do NOT use markdown formatting.

        Structure:
        {
           "mustHave": [
              {
                "skill": "Skill Name",
                "reason": "Why needed",
                "youtube": { "title": "Video Title", "url": "https://www.youtube.com/watch?v=VIDEO_ID" },
                "udemy": { "title": "Udemy Course Name", "searchQuery": "Search Term" }
              }
           ],
           "recommended": [ { "skill": "Skill Name", "reason": "Why needed" } ],
           "goodToKnow": [ { "skill": "Skill Name", "reason": "Why needed" } ]
        }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "");
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
    }

    let roadmap;
    try {
        roadmap = JSON.parse(text);
    } catch (parseError) {
        console.error("AI returned malformed JSON:", text);
        throw new ApiError(502, "AI returned malformed data. Please try again.");
    }

    return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap generated successfully"));
});
