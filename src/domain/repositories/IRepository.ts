export interface IRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
