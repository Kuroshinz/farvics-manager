export interface IConfiguration {
  get<T>(key: string): T;
  getString(key: string): string;
  getNumber(key: string): number;
  getBoolean(key: string): boolean;
  has(key: string): boolean;
}
