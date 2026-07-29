export interface SkillMatch {
    percentage: number;
    commonSkills: string[];
  }
  
  /** Percentage overlap between two users' skill-id arrays (Jaccard-style). */
  export function calculateSkillMatch(mySkills: string[] = [], otherSkills: string[] = []): SkillMatch {
    if (!Array.isArray(mySkills) || !Array.isArray(otherSkills)) {
      return { percentage: 0, commonSkills: [] };
    }
  
    const setA = new Set(mySkills);
    const setB = new Set(otherSkills);
  
    const commonSkills = [...setA].filter((skill) => setB.has(skill));
    const totalUniqueSkills = new Set([...mySkills, ...otherSkills]).size;
  
    const percentage =
      totalUniqueSkills === 0 ? 0 : Math.round((commonSkills.length / totalUniqueSkills) * 100);
  
    return { percentage, commonSkills };
  }
  