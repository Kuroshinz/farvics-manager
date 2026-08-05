import { vi } from 'vitest';
import { SupabaseUserRepository } from '../infrastructure/SupabaseUserRepository';
import { User } from '../domain/User';
import { UserId, Email, DisplayName } from '../domain/ValueObjects';
import { IdentityErrors } from '../domain/Errors';

// Mock Supabase client
const mockSupabase: any = {};
mockSupabase.from = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.select = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.update = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.insert = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.eq = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.is = vi.fn().mockReturnValue(mockSupabase);
mockSupabase.single = vi.fn();

describe('SupabaseUserRepository Integration', () => {
  let repo: SupabaseUserRepository;

  beforeEach(() => {
    repo = new SupabaseUserRepository(mockSupabase as any);
    vi.clearAllMocks();
  });

  it('should find a user by ID', async () => {
    mockSupabase.single.mockResolvedValueOnce({
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@farvics.com',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        version: 1,
      },
      error: null,
    });

    const user = await repo.findById(new UserId('123e4567-e89b-12d3-a456-426614174000'));
    
    expect(user).toBeDefined();
    expect(user?.email.value).toBe('test@farvics.com');
    expect(user?.firstName?.value).toBe('John');
  });

  it('should save a user and handle OCC', async () => {
    // Setup initial user state
    const user = User.create({
      id: new UserId('123e4567-e89b-12d3-a456-426614174000'),
      email: new Email('test@farvics.com'),
      firstName: new DisplayName('John'),
      lastName: new DisplayName('Doe'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    });

    user.updateProfile('Jane', 'Doe');

    mockSupabase.eq.mockReturnValueOnce(mockSupabase).mockReturnValueOnce(Promise.resolve({ error: null, count: 1 } as any));

    await repo.save(user);

    expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
      first_name: 'Jane',
      version: 2
    }));
  });
});








