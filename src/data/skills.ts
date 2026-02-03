// 技能分类接口
export interface SkillCategory {
  category: string;
  skills: string[];
}

// 技能数据
export const skills: SkillCategory[] = [
  {
    category: "前端开发",
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"]
  },
  {
    category: "后端开发",
    skills: ["Node.js", "Express", "Python"]
  },
  {
    category: "工具",
    skills: ["Git", "VS Code", "Vite", "npm"]
  }
];
