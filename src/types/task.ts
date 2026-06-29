//  Enums
export enum Priority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
}

export enum Status {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}

//  Core interface
export interface Task {
  readonly id: string;         // readonly
  title: string;
  description?: string;        // optional
  priority: Priority;
  status: Status;
  tags: string[];
  dueDate: Date | null;        // union type
  createdAt: Date;
}

//  Utility types
export type CreateTaskInput = Omit<Task, "id" | "createdAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;
export type TaskSummary    = Pick<Task, "id" | "title" | "status" | "priority">;

//  Intersection type
export type TaggedTask = Task & { matchedTags: string[] };

//  as const + literal type
export const SORT_FIELDS = ["priority", "dueDate", "createdAt", "title"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
