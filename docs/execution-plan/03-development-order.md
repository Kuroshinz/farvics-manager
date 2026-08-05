# Development Order

1. **Database & Migrations (`TSK-103`, `TSK-201`)**: The DB is the absolute source of truth. Repositories cannot be written or tested without the schema and RLS policies existing first.
2. **Shared Validation (`TSK-202`)**: DTOs and API endpoints depend on centralized Zod validators.
3. **Backend Repositories & Server Actions (`TSK-203`)**: Must be complete before UI can be wired up. Allows parallel frontend dev using mocks.
4. **UI Integration (`TSK-104`, `TSK-204`)**: Wired to the completed Server Actions.
5. **Background Workers (`TSK-205`)**: Can be developed entirely in parallel once the outbox table schema is finalized.
