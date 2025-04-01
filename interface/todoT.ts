export type Todo = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    admin: string;
    viewers: string[];
    items: todoItem[];
  };
export type todoItem = {
    title: string;
    description: string;
    completed: boolean;
}