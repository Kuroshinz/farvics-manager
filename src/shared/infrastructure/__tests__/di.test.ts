import { ServiceContainer } from '../di/ServiceContainer';

describe('ServiceContainer', () => {
  it('resolves transient services', () => {
    const container = new ServiceContainer();
    let counter = 0;
    container.registerTransient('Counter', () => ++counter);
    
    expect(container.resolve('Counter')).toBe(1);
    expect(container.resolve('Counter')).toBe(2);
  });

  it('resolves singleton services', () => {
    const container = new ServiceContainer();
    let counter = 0;
    container.registerSingleton('Counter', () => ++counter);
    
    expect(container.resolve('Counter')).toBe(1);
    expect(container.resolve('Counter')).toBe(1);
  });
});
