import { Priority, Task } from "../types/task";

//  Type guard for Priority enum
export function isPriority(value: unknown): value is Priority {
  return Object.values(Priority).includes(value as Priority);
}

//  Type guard for Task shape
export function isTask(obj: unknown): obj is Task {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "title" in obj &&
    "priority" in obj
  );
}

//  Non-null assertion helper with generics
export function assertNonNull<T>(val: T | null | undefined, msg: string): T {
  if (val == null) throw new Error(msg);
  return val;
}


