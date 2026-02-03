# 个人作品集网站

使用 React + TypeScript + Vite + Tailwind CSS 构建的个人作品集网站。

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

## 项目结构

```
src/
├── components/        # React 组件
│   ├── Header.tsx    # 导航栏
│   ├── Hero.tsx      # 首页主视觉
│   ├── About.tsx     # 关于我
│   ├── Projects.tsx  # 项目展示
│   ├── Contact.tsx   # 联系方式
│   └── Footer.tsx    # 页脚
├── data/             # 数据文件
│   ├── projects.ts   # 项目数据
│   └── skills.ts     # 技能数据
├── App.tsx           # 主应用组件
├── main.tsx          # 应用入口
└── index.css         # 全局样式
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 自定义

### 修改个人信息

1. 编辑 `src/components/Hero.tsx` - 修改名字和简介
2. 编辑 `src/components/About.tsx` - 修改个人介绍
3. 编辑 `src/components/Contact.tsx` - 修改联系方式链接

### 添加项目

编辑 `src/data/projects.ts` 文件，在 `projects` 数组中添加新项目：

```typescript
{
  id: 2,
  name: "项目名称",
  description: "项目描述",
  image: "/project-image.jpg",
  tech: ["React", "TypeScript"],
  link: "https://project-url.com",
  github: "https://github.com/username/repo"
}
```

### 修改技能列表

编辑 `src/data/skills.ts` 文件，添加或修改技能分类和技能项。

## 设计特点

- 深色主题（背景 #0a0a0a）
- 渐变色强调（紫色到粉色）
- 平滑滚动动画
- 完全响应式设计
- 移动端优化

## 部署

项目可以部署到任何静态网站托管平台：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## License

MIT
