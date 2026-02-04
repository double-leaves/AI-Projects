import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo, FilterType } from "../types/todo";
import { saveTodos, loadTodos } from "../utils/storage";

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: "All",

      addTodo: (text: string) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
        };

        const newTodos = [newTodo, ...get().todos];
        set({ todos: newTodos });
        saveTodos(newTodos);
      },

      toggleTodo: (id: string) => {
        const newTodos = get().todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        );
        set({ todos: newTodos });
        saveTodos(newTodos);
      },

      deleteTodo: (id: string) => {
        const newTodos = get().todos.filter((todo) => todo.id !== id);
        set({ todos: newTodos });
        saveTodos(newTodos);
      },

      setFilter: (filter: FilterType) => {
        set({ filter });
      },
    }),
    {
      name: "todo-store",
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.todos = loadTodos();
          }
        };
      },
    },
  ),
);
