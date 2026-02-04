import { useEffect } from "react";
import { AddTodo } from "./components/AddTodo";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { useTodoStore } from "./store/useTodoStore";

function App() {
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          待办清单
        </h1>

        <AddTodo />
        <TodoFilter />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
