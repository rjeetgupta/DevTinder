export interface Option {
    id: string;
    name: string;
  }
  
  export const GENDER_OPTIONS: Option[] = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },
    { id: "others", name: "Others" },
  ];
  
  export const EXPERIENCE_LEVEL_OPTIONS: Option[] = [
    { id: "fresher", name: "Fresher" },
    { id: "junior", name: "Junior" },
    { id: "mid", name: "Mid-Level" },
    { id: "senior", name: "Senior" },
  ];
  
  export const STATE_OPTIONS: Option[] = [
    { id: "jharkhand", name: "Jharkhand" },
    { id: "karnataka", name: "Karnataka" },
    { id: "maharashtra", name: "Maharashtra" },
    { id: "tamil_nadu", name: "Tamil Nadu" },
    { id: "telangana", name: "Telangana" },
    { id: "kerala", name: "Kerala" },
    { id: "andhra_pradesh", name: "Andhra Pradesh" },
    { id: "delhi", name: "Delhi" },
  ];
  
  export const SKILL_OPTIONS: Option[] = [
    // Frontend
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "react", name: "React" },
    { id: "next_js", name: "Next.js" },
    { id: "redux", name: "Redux" },
    { id: "tailwind_css", name: "Tailwind CSS" },
    { id: "material_ui", name: "Material UI" },
    // Backend
    { id: "node_js", name: "Node.js" },
    { id: "express_js", name: "Express.js" },
    { id: "nestjs", name: "NestJS" },
    { id: "rest_api", name: "REST APIs" },
    { id: "graphql", name: "GraphQL" },
    { id: "jwt_auth", name: "JWT Authentication" },
    // Databases
    { id: "mongodb", name: "MongoDB" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "mysql", name: "MySQL" },
    { id: "redis", name: "Redis" },
    // ORMs / Tools
    { id: "sequelize", name: "Sequelize" },
    { id: "prisma", name: "Prisma" },
    { id: "mongoose", name: "Mongoose" },
    // DevOps
    { id: "git", name: "Git" },
    { id: "github", name: "GitHub" },
    { id: "docker", name: "Docker" },
    { id: "docker_compose", name: "Docker Compose" },
    { id: "nginx", name: "Nginx" },
    { id: "ci_cd", name: "CI/CD" },
    { id: "aws", name: "AWS" },
    { id: "linux", name: "Linux" },
    { id: "pm2", name: "PM2" },
    // Testing
    { id: "jest", name: "Jest" },
    { id: "react_testing_library", name: "React Testing Library" },
    // Architecture
    { id: "microservices", name: "Microservices" },
    { id: "system_design", name: "System Design" },
    // Others
    { id: "web_security", name: "Web Security" },
    { id: "performance_optimization", name: "Performance Optimization" },
  ];
  
  export function skillIdsToNames(ids: string[]): string[] {
    return ids
      .map((id) => SKILL_OPTIONS.find((s) => s.id === id)?.name)
      .filter((name): name is string => Boolean(name));
  }
  
  export function optionLabel(options: Option[], id: string | null | undefined): string | undefined {
    return options.find((o) => o.id === id)?.name;
  }
  