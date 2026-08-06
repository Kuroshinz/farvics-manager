const fs = require('fs');
const p = 'd:\\ManagerMn\\src\\middleware.ts';
let txt = fs.readFileSync(p, 'utf8');

// Use request-scoped cookie getters/setters like the official Supabase docs
txt = txt.replace(
  `const supabase = createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\n    {\n      cookies: {\n        get(name: string) {\n          return request.cookies.get(name)?.value;\n        },\n        set(name: string, value: string, options: CookieOptions) {\n          request.cookies.set({\n            name,\n            value,\n            ...options,\n          });\n          response = NextResponse.next({\n            request: {\n              headers: request.headers,\n            },\n          });\n          response.cookies.set({\n            name,\n            value,\n            ...options,\n          });\n        },\n        remove(name: string, options: CookieOptions) {\n          request.cookies.set({\n            name,\n            value: '',\n            ...options,\n          });\n          response = NextResponse.next({\n            request: {\n              headers: request.headers,\n            },\n          });\n          response.cookies.set({\n            name,\n            value: '',\n            ...options,\n          });\n        },\n      },\n    }\n  );`,
  `const supabase = createServerClient(\n    process.env.NEXT_PUBLIC_SUPABASE_URL!,\n    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\n    {\n      cookies: {\n        getAll() {\n          return request.cookies.getAll();\n        },\n        setAll(cookiesToSet) {\n          cookiesToSet.forEach(({ name, value, options }) =>\n            request.cookies.set(name, value)\n          );\n          response = NextResponse.next({\n            request: {\n              headers: request.headers,\n            },\n          });\n          cookiesToSet.forEach(({ name, value, options }) =>\n            response.cookies.set(name, value, options)\n          );\n        },\n      },\n    }\n  );`
);

fs.writeFileSync(p, txt);
console.log('Middleware rewritten');
