# AI 聊天助手

基于 React + TypeScript + Vite 开发的智谱 AI 聊天助手。

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- react-markdown - Markdown 渲染
- react-syntax-highlighter - 代码高亮
- 智谱 AI API

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的智谱 AI API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
VITE_ZHIPU_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产构建

```bash
npm run preview
```

## 功能特性

- ✅ 多轮对话，AI 记住上下文
- ✅ 流式输出，AI 回答逐字显示
- ✅ 本地存储对话历史
- ✅ 支持 Markdown 格式和代码高亮
- ✅ 微信风格的聊天界面
- ✅ 可清空对话历史

## 项目结构

```
AI_Chat/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # 应用入口
│   ├── index.css        # 全局样式
│   └── vite-env.d.ts    # Vite 类型声明
├── public/              # 静态资源
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── postcss.config.js    # PostCSS 配置
└── package.json         # 项目依赖
```

## 开发规范

- 使用 TypeScript 确保类型安全
- 使用 Tailwind CSS 编写样式
- API Key 从环境变量读取，不要硬编码
- 错误处理要有友好的提示
