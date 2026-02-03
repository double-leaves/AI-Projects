# Public 资源文件夹

将你的静态资源文件放在这里，它们会被直接复制到构建输出目录。

## 建议的文件结构

```
public/
├── avatar.jpg          # 你的头像照片（推荐尺寸：400x400px 或更大）
├── vite.svg           # Vite 图标（已有）
└── projects/          # 项目截图
    ├── project1.jpg
    ├── project2.jpg
    └── project3.jpg
```

## 如何添加头像

1. 准备一张正方形的个人照片（推荐 400x400px 或更大）
2. 将照片重命名为 `avatar.jpg` 或 `avatar.png`
3. 放入 `public/` 目录
4. 在 `src/components/Hero.tsx` 中取消注释图片代码：

```tsx
// 将这行：
<span className="text-6xl">👨‍💻</span>

// 替换为：
<img src="/avatar.jpg" alt="头像" className="w-full h-full object-cover" />
```

## 如何添加项目图片

1. 在 `public/` 目录下创建 `projects/` 文件夹
2. 将项目截图放入该文件夹
3. 在 `src/data/projects.ts` 中引用：

```typescript
{
  id: 1,
  name: "我的项目",
  image: "/projects/project1.jpg",  // 引用 public 目录下的图片
  // ...
}
```

## 图片优化建议

- **头像**：400x400px，JPEG 格式，质量 85%
- **项目截图**：1200x800px 或 16:9 比例，JPEG 格式
- **图标**：SVG 格式优先
- 使用在线工具压缩图片：TinyPNG、Squoosh 等
