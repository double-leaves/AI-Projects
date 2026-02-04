import { TodoItem } from "./TodoItem";
import { useTodoStore } from "../store/useTodoStore";

export const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.is_completed;
    if (filter === "Completed") return todo.is_completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return <div className="text-center py-8 text-gray-500">暂无任务</div>;
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
