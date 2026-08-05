export interface CachePolicy {
  ttlMs: number;
  tags: string[];
}

export interface IQueryCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, policy: CachePolicy): Promise<void>;
  invalidateByTag(tag: string): Promise<void>;
}

export class QueryCache implements IQueryCache {
  private store = new Map<string, { value: unknown; expiresAt: number }>();
  private tagMap = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, policy: CachePolicy): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + policy.ttlMs });
    for (let i = 0; i < policy.tags.length; i++) {
      const tag = policy.tags[i];
      if (!this.tagMap.has(tag)) this.tagMap.set(tag, new Set());
      this.tagMap.get(tag)!.add(key);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = this.tagMap.get(tag);
    if (!keys) return;
    keys.forEach(key => {
      this.store.delete(key);
    });
    this.tagMap.delete(tag);
  }
}

export class CacheInvalidation {
  constructor(private readonly cache: IQueryCache) {}
  async onProjectionUpdated(projectionName: string): Promise<void> {
    await this.cache.invalidateByTag(projectionName);
  }
}
