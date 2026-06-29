import { randomUUID } from "crypto";
import { Repository } from "../repository/task.repo";
import { Result, ok, err } from "../types/result";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskSummary,
  Priority,
  SortField,
} from "../types/task";
import { isPriority } from "../utils/guards";

//  Mapped type — makes every property deeply readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export class TaskService {
  private repo = new Repository<Task>();

  //  Result<T> pattern for typed error handling
  create(input: CreateTaskInput): Result<Task> {
    if (!input.title.trim()) {
      return err("Title cannot be empty");
    }

    const task: Task = {
      ...input,
      id: randomUUID(),
      createdAt: new Date(),
    };

    return ok(this.repo.add(task));
  }

  update(id: string, changes: UpdateTaskInput): Result<Task> {
    const updated = this.repo.update(id, changes);
    return updated ? ok(updated) : err(`Task with id "${id}" not found`);
  }

  delete(id: string): Result<boolean> {
    const deleted = this.repo.delete(id);
    return deleted ? ok(true) : err(`Task with id "${id}" not found`);
  }

  getById(id: string): Result<Task> {
    const task = this.repo.findById(id);
    return task ? ok(task) : err(`Task "${id}" not found`);
  }

  //  Pick<Task, ...> — returns only summary fields
  getAll(): TaskSummary[] {
    return this.repo.findAll().map(({ id, title, status, priority }) => ({
      id,
      title,
      status,
      priority,
    }));
  }

  //  Type guard in action
  filterByPriority(p: unknown): Result<Task[]> {
    if (!isPriority(p)) return err(`Invalid priority value: "${p}"`);
    return ok(this.repo.findWhere("priority", p));
  }

  //  Literal type (SortField) constrains what can be passed
  sortBy(field: SortField): Task[] {
    return [...this.repo.findAll()].sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (av == null) return 1;
      if (bv == null) return -1;
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
  }

  //  Record<K, V> mapped type
  stats(): Record<Priority, number> {
    const counts = Object.values(Priority).reduce(
      (acc, p) => ({ ...acc, [p]: 0 }),
      {} as Record<Priority, number>
    );
    this.repo.findAll().forEach((t) => counts[t.priority]++);
    return counts;
  }

  //  DeepReadonly custom mapped type in use
  getReadonlySnapshot(): DeepReadonly<Task>[] {
    return this.repo.findAll() as DeepReadonly<Task>[];
  }
}