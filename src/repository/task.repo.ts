//  Generic constraint
export interface Identifiable {
  id: string;
}

//  Generic class
export class Repository<T extends Identifiable> {
  private store = new Map<string, T>();

  add(item: T): T {
    this.store.set(item.id, item);
    return item;
  }

  findById(id: string): T | undefined {
    return this.store.get(id);
  }

  findAll(): T[] {
    return [...this.store.values()];
  }

  //  Partial + Omit utility types
  update(id: string, changes: Partial<Omit<T, "id">>): T | undefined {
    const item = this.store.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...changes };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  //  Keyof + generic indexed access
  findWhere<K extends keyof T>(key: K, value: T[K]): T[] {
    return this.findAll().filter((item) => item[key] === value);
  }
}








