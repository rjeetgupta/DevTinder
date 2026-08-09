/**
 * Membership pricing (in INR). Keys must match `memberShipType` on the
 * User/Payment models and the frontend's `MembershipType` union
 * ("silver" | "gold").
 */
export const memberAmount: Record<string, number> = {
    silver: 200,
    gold: 400,
};

/** How many days a paid membership stays active before it needs renewal. */
export const membershipValidityDays: Record<string, number> = {
    silver: 30,
    gold: 30,
};

export interface Skill {
    id: string;
    name: string;
}

/**
 * Master skill list used for the profile "skills" picker and the
 * `/user/suggested-skills` endpoint.
 */
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

/** Skills suggested to a user, chosen from the popular/high-value subset. */
export const popularSkillIds: string[] = [
    "react",
    "node_js",
    "express_js",
    "mongodb",
    "postgresql",
    "typescript",
    "next_js",
    "redux",
    "tailwind_css",
    "docker",
    "aws",
    "git",
    "ci_cd",
    "system_design",
    "microservices",
    "graphql",
];
