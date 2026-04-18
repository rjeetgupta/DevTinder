// export enum SubscriptionTier {
//     FREE = "FREE",
//     SILVER = "SILVER",
//     GOLD = "GOLD",
// }

// export interface SubscriptionPlan {
//     tier: SubscriptionTier;
//     displayName: string;
//     price: number; // INR
//     validityDays: number; // days
//     features: string[];
//     isPopular?: boolean;
// }

// export const SubscriptionPlans: Record<SubscriptionTier, SubscriptionPlan> = {
//     [SubscriptionTier.FREE]: {
//         tier: SubscriptionTier.FREE,
//         displayName: "Free",
//         price: 0,
//         validityDays: 0,
//         features: ["Limited daily likes", "Swipe & match"],
//     },

//     [SubscriptionTier.SILVER]: {
//         tier: SubscriptionTier.SILVER,
//         displayName: "Silver",
//         price: 999,
//         validityDays: 30,
//         features: ["Unlimited likes", "Ad-free experience"],
//     },

//     [SubscriptionTier.GOLD]: {
//         tier: SubscriptionTier.GOLD,
//         displayName: "Gold",
//         price: 1999,
//         validityDays: 30,
//         isPopular: true,
//         features: [
//             "See who liked you",
//             "Priority visibility",
//             "Profile verified badge",
//         ],
//     },
// };

/**
 * Membership types supported in the system
 */
export type MembershipType = "silver" | "gold";

/**
 * Mapping of membership type to price (INR)
 */
export const memberAmount: Record<MembershipType, number> = {
    silver: 200,
    gold: 400,
};

export interface Skill {
    id: string;
    name: string;
}

export const skillList: Skill[] = [
    // ---------- Frontend ----------
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "react", name: "React" },
    { id: "next_js", name: "Next.js" },
    { id: "redux", name: "Redux" },
    { id: "tailwind_css", name: "Tailwind CSS" },
    { id: "material_ui", name: "Material UI" },

    // ---------- Backend ----------
    { id: "node_js", name: "Node.js" },
    { id: "express_js", name: "Express.js" },
    { id: "nestjs", name: "NestJS" },
    { id: "rest_api", name: "REST APIs" },
    { id: "graphql", name: "GraphQL" },
    { id: "jwt_auth", name: "JWT Authentication" },

    // ---------- Databases ----------
    { id: "mongodb", name: "MongoDB" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "mysql", name: "MySQL" },
    { id: "redis", name: "Redis" },

    // ---------- ORMs / Tools ----------
    { id: "sequelize", name: "Sequelize" },
    { id: "prisma", name: "Prisma" },
    { id: "mongoose", name: "Mongoose" },

    // ---------- DevOps ----------
    { id: "git", name: "Git" },
    { id: "github", name: "GitHub" },
    { id: "docker", name: "Docker" },
    { id: "docker_compose", name: "Docker Compose" },
    { id: "nginx", name: "Nginx" },
    { id: "ci_cd", name: "CI/CD" },
    { id: "aws", name: "AWS" },
    { id: "linux", name: "Linux" },
    { id: "pm2", name: "PM2" },

    // ---------- Testing ----------
    { id: "jest", name: "Jest" },
    { id: "react_testing_library", name: "React Testing Library" },

    // ---------- Architecture ----------
    { id: "microservices", name: "Microservices" },
    { id: "system_design", name: "System Design" },

    // ---------- Others ----------
    { id: "web_security", name: "Web Security" },
    { id: "performance_optimization", name: "Performance Optimization" },
];
