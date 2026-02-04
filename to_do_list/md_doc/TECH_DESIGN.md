# Technical Design Document (Tech Design)

## 1. 技术栈 (Tech Stack)

- **Framework**: React 18+ (使用 Vite 构建)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (全局状态管理)
- **Persistence**: LocalStorage (封装为 Utility 工具)
- **Icons**: Lucide React

## 2. 数据模型 (Data Models)

### Todo Interface

```typescript
interface Todo {
  id: string; // 使用 UUID 或 Date.now() 生成
  text: string; // 任务内容
  completed: boolean; // 是否完成
  createdAt: number; // 创建时间戳
}
```

## 3.目录结构

src/
├── components/
│ ├── AddTodo.tsx // 包含表单输入和验证
│ ├── TodoList.tsx // 渲染列表
│ ├── TodoItem.tsx // 单个任务项
│ └── TodoFilter.tsx // 筛选器
├── store/
│ └── useTodoStore.ts // Zustand Store
├── utils/
│ └── storage.ts // LocalStorage 工具函数
├── types/
│ └── todo.ts // 类型定义
└── App.tsx
