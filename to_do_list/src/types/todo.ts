export interface Todo {
  id: number;
  content: string;
  is_completed: boolean;
}

export type FilterType = "All" | "Active" | "Completed";
