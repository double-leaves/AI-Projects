// 项目数据接口
export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  github?: string;
}

// 项目数据
export const projects: Project[] = [
  {
    id: 1,
    name: "示例项目 1",
    description: "这是一个示例项目的简短描述",
    image: "/project1.jpg",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    link: "https://example.com",
    github: "https://github.com/example/project1"
  },
  // 可以在此添加更多项目
];
