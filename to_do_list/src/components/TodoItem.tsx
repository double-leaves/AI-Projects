import { Trash2 } from "lucide-react";
import type { Todo } from "../types/todo";
import { useTodoStore } from "../store/useTodoStore";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
      />
      <span
        className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
