import { create } from "zustand";
import type { Todo, FilterType } from "../types/todo";
import api from "../api/client";

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  setFilter: (filter: FilterType) => void;
}

export const useTodoStore = create<TodoState>()((set, get) => ({
  todos: [],
  filter: "All",

  fetchTodos: async () => {
    try {
      const response = await api.get<Todo[]>("/todos");
      set({ todos: response.data });
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  },

  addTodo: async (text: string) => {
    try {
      const newTodo: Todo = {
        id: 0,
        content: text.trim(),
        is_completed: false,
      };
      await api.post<Todo>("/todos", newTodo);
      await get().fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  },

  toggleTodo: async (id: number) => {
    try {
      const todo = get().todos.find((t) => t.id === id);
      if (!todo) return;

      const updatedTodo = { ...todo, is_completed: !todo.is_completed };
      await api.patch<Todo>(`/todos/${id}`, updatedTodo);
      await get().fetchTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  },

  deleteTodo: async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      await get().fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  },

  setFilter: (filter: FilterType) => {
    set({ filter });
  },
}));
