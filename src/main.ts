import { TaskService } from "./services/task.service";
import { Priority, Status } from "./types/task";

const service = new TaskService();

console.log("\n========================================");
console.log("   📝 TypeScript Task Manager Demo");
console.log("========================================\n");

// --- CREATE ---
console.log("✅ Creating tasks...\n");

const t1 = service.create({
  title: "Learn TypeScript generics",
  priority: Priority.High,
  status: Status.InProgress,
  tags: ["learning", "ts"],
  dueDate: new Date("2025-07-01"),
});

const t2 = service.create({
  title: "Build REST API",
  priority: Priority.Medium,
  status: Status.Todo,
  tags: ["backend"],
  dueDate: null,
});

const t3 = service.create({
  title: "Write tests",
  priority: Priority.Low,
  status: Status.Todo,
  tags: ["testing"],
  dueDate: new Date("2025-08-01"),
});

const t4 = service.create({
  title: "",   // ❌ intentionally bad — to show Result error handling
  priority: Priority.Low,
  status: Status.Todo,
  tags: [],
  dueDate: null,
});

// Show Result<T> error handling
if (!t4.success) {
  console.log("❌ Expected error caught:", t4.error, "\n");
}

// --- LIST ---
console.log("📋 All tasks (TaskSummary — Pick<Task>):");
console.table(service.getAll());

// --- FILTER ---
console.log("🔥 Filter by HIGH priority (type guard + Result<T>):");
const highResult = service.filterByPriority(Priority.High);
if (highResult.success) {
  console.table(highResult.data.map((t) => ({ title: t.title, priority: t.priority })));
}

// Type guard catches bad input
const badFilter = service.filterByPriority("URGENT"); // not a valid Priority
if (!badFilter.success) {
  console.log("❌ Bad filter caught:", badFilter.error, "\n");
}

// --- UPDATE ---
if (t1.success) {
  console.log("✏️  Updating task status...");
  const updated = service.update(t1.data.id, { status: Status.Done });
  if (updated.success) {
    console.log(`   "${updated.data.title}" → ${updated.data.status}\n`);
  }
}

// --- SORT ---
console.log("🗂️  Tasks sorted by dueDate (literal SortField type):");
console.table(
  service.sortBy("dueDate").map((t) => ({
    title: t.title,
    dueDate: t.dueDate?.toDateString() ?? "No date",
  }))
);

// --- STATS ---
console.log("📊 Task stats (Record<Priority, number> — mapped type):");
console.log(service.stats(), "\n");

// --- READONLY SNAPSHOT ---
console.log("🔒 DeepReadonly snapshot (custom mapped type):");
const snapshot = service.getReadonlySnapshot();
console.log(`   Got ${snapshot.length} readonly task(s)`);
// snapshot[0].title = "hack" // ← Uncomment to see TS compile error!

console.log("\n========================================");
console.log("   Done! All TS concepts exercised 🎉");
console.log("========================================\n");