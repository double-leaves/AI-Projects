### 文档 3: AI 代理指令 (AGENTS.md)

这份文档是**执行脚本**，把大任务拆解成 Trae 能理解的 Step-by-Step 指令。

```markdown
# AI Agent Instructions (AGENTS)

**Role**: 你是一名精通 React、TypeScript 和 Zustand 的前端开发专家。

**Context**: 我们已经有了详细的 PRD 和 Technical Design。现在需要你按照以下步骤逐步实现代码。

**Global Rules**:

1. 始终使用 TypeScript 并定义严格的类型。
2. 使用 Tailwind CSS 进行样式编写。
3. 保持组件功能单一（Single Responsibility Principle）。
4. **每完成一个步骤，请停止并等待我的确认，不要一次性生成所有代码。**

---

## Phase 1: 基础架构搭建

**Step 1.1: 类型与工具函数**

- **Action**:
  1. 在 `src/types/todo.ts` 中定义 `Todo` 接口和 `FilterType` 类型。
  2. 在 `src/utils/storage.ts` 中创建 `STORAGE_KEY` 常量，并实现 `loadTodos` 和 `saveTodos` 函数，需包含 try-catch 错误处理。

**Step 1.2: Zustand 状态管理**

- **Action**:
  1. 安装 zustand (`npm install zustand`)。
  2. 创建 `src/store/useTodoStore.ts`。
  3. 实现 `todos` 数组和 `filter` 状态。
  4. 实现 `addTodo`, `toggleTodo`, `deleteTodo`, `setFilter` 方法。
  5. **关键点**: 确保每次更新 state 后，自动调用 `saveTodos` 持久化数据。

---

## Phase 2: 组件开发

**Step 2.1: AddTodo 组件**

- **Action**: 创建 `src/components/AddTodo.tsx`。
- **Requirements**:
  - 包含一个 input 和一个 submit 按钮。
  - 使用 Tailwind 美化样式（建议：输入框要有 focus ring）。
  - **Logic**: 提交表单时，验证输入是否为空。如果通过，调用 store 的 `addTodo` 并清空输入框；如果不通过，不执行任何操作（可选：显示简单的 toast 或红框提示）。

**Step 2.2: TodoItem 与 TodoList 组件**

- **Action**:
  1. 创建 `TodoItem.tsx`: 接收 todo 对象，渲染 checkbox、文本和删除按钮。
  2. 创建 `TodoList.tsx`: 从 store 获取 `todos` 和 `filter`，根据 filter 计算出需要展示的任务列表，循环渲染 `TodoItem`。
  3. 添加 Empty State（当没有任务时显示“暂无任务”的提示）。

**Step 2.3: 筛选组件与主界面组装**

- **Action**:
  1. 创建 `TodoFilter.tsx`: 渲染三个按钮 (All/Active/Completed)，高亮当前选中的状态。
  2. 在 `App.tsx` 中组装所有组件：Title -> AddTodo -> TodoFilter -> TodoList。
  3. 使用 Tailwind 设置一个居中的 Layout 容器 (max-w-md, mx-auto, etc.)。

---

## Phase 3: 验收与优化

- **Action**: 检查所有功能是否符合 PRD。
- **Check**: 尝试刷新页面，确认 LocalStorage 数据是否成功回显。
```
