export interface ISerializer {
  serialize<T>(obj: T): string;
  deserialize<T>(data: string): T;
}
