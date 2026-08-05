import { FarvicsClient } from '../sdk/FarvicsClient';
import { QueryCache } from '../cache';

describe('BFF and Query Gateway Validation', () => {
  it('FarvicsClient instantiates modular sub-clients securely', () => {
    const client = new FarvicsClient({ endpoint: 'http://localhost' });
    expect(client.query).toBeDefined();
    expect(client.mutation).toBeDefined();
    expect(client.realtime).toBeDefined();
  });

  it('QueryCache sets, retrieves, and invalidates by tag properly', async () => {
    const cache = new QueryCache();
    await cache.set('key1', { value: 1 }, { ttlMs: 10000, tags: ['projectionA'] });
    expect(await cache.get('key1')).toBeDefined();
    await cache.invalidateByTag('projectionA');
    expect(await cache.get('key1')).toBeNull();
  });
});

