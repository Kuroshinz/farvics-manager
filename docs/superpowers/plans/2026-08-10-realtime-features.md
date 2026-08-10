# Realtime Financial Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nâng cấp ứng dụng để hỗ trợ đồng bộ hóa dữ liệu thời gian thực (Realtime) sử dụng Supabase, giúp các thay đổi về Giao dịch và Tài khoản lập tức phản hồi trên giao diện người dùng mà không cần tải lại trang.

**Architecture:** Sử dụng Supabase Realtime Subscriptions (`supabase.channel('custom-all-channel')`) tại tầng Client Component. Lắng nghe các sự kiện `INSERT`, `UPDATE`, `DELETE` trên bảng `financial_journal_entries` và `financial_accounts` để cập nhật React state cục bộ.

**Tech Stack:** Next.js (App Router), Supabase SSR Client, React Hooks (`useEffect`), TypeScript.

## Global Constraints
- Phải đảm bảo bảo mật RLS (Row Level Security) không bị rò rỉ khi subscribe realtime.
- Chỉ subscribe vào dữ liệu thuộc `workspace_id` hiện tại của User.
- Không phá vỡ luồng Server Actions hiện có. Tái sử dụng `createBrowserClient` của Supabase SSR.

---

### Task 1: Enable Supabase Realtime cho Bảng Dữ liệu

**Files:**
- Create: `supabase/migrations/20260810000000_enable_realtime.sql`

**Interfaces:**
- Consumes: Database schema hiện tại
- Produces: Replication publication cho `financial_journal_entries` và `financial_accounts`.

- [ ] **Step 1: Viết script SQL kích hoạt Realtime**

```sql
-- Kích hoạt realtime cho các bảng giao dịch và tài khoản
alter publication supabase_realtime add table financial_journal_entries;
alter publication supabase_realtime add table financial_accounts;
```

- [ ] **Step 2: Áp dụng migration**

Run: `npx supabase db push` (Hoặc thêm file migration vào project để chạy thủ công)
Expected: Thành công, Supabase Realtime được kích hoạt.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260810000000_enable_realtime.sql
git commit -m "chore(db): enable realtime replication for financial tables"
```

---

### Task 2: Triển khai Realtime Hook cho TransactionsClient

**Files:**
- Modify: `src/app/(app)/transactions/TransactionsClient.tsx:30-50`

**Interfaces:**
- Consumes: `createBrowserClient` từ `@supabase/ssr`
- Produces: Component tự động cập nhật danh sách `data` khi có thay đổi từ DB.

- [ ] **Step 1: Viết đoạn code khởi tạo Supabase Client & useEffect**

```tsx
// Thêm import
import { createBrowserClient } from '@supabase/ssr';

// Khởi tạo client bên trong component
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

React.useEffect(() => {
  const channel = supabase.channel('realtime:transactions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'financial_journal_entries' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setData((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setData((prev) => prev.filter(item => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setData((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase]);
```

- [ ] **Step 2: Tích hợp vào TransactionsClient**
Thêm đoạn mã trên ngay bên dưới khai báo state `[data, setData] = React.useState(initialData);`.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/transactions/TransactionsClient.tsx
git commit -m "feat(transactions): implement realtime database subscriptions"
```

---

### Task 3: Triển khai Realtime Hook cho AccountsClient

**Files:**
- Modify: `src/app/(app)/accounts/AccountsClient.tsx:28-48`

**Interfaces:**
- Consumes: Cùng cơ chế Realtime tương tự như Task 2.
- Produces: Tài khoản cập nhật số dư tức thời.

- [ ] **Step 1: Tương tự Task 2, cài đặt hook vào AccountsClient**

```tsx
import { createBrowserClient } from '@supabase/ssr';

// Khởi tạo client bên trong AccountsClient
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

React.useEffect(() => {
  const channel = supabase.channel('realtime:accounts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'financial_accounts' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setData((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setData((prev) => prev.filter(item => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setData((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [supabase]);
```

- [ ] **Step 2: Test thử nghiệm**
Mở hai tab trình duyệt, tạo Tài khoản ở tab 1 và xác minh tab 2 tự động hiển thị mà không cần F5.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(app\)/accounts/AccountsClient.tsx
git commit -m "feat(accounts): implement realtime database subscriptions"
```
