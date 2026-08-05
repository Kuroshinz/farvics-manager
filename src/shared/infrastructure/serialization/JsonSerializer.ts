import { ISerializer } from '../../core/Serialization';

export class JsonSerializer implements ISerializer {
  serialize<T>(obj: T): string {
    return JSON.stringify(obj);
  }

  deserialize<T>(data: string): T {
    return JSON.parse(data) as T;
  }
}
