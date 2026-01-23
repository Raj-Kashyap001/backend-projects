# Project 2 — Auth System (Cookie-based)

This repository contains a concise demonstration of a cookie-based authentication flow implemented with `Hono` on `Bun`. It is intended as an instructional example and a starting point for a more complete auth system.

## Features

- Basic signup/login/logout flow using signed/hashed passwords (via Bun's password APIs).
- Cookie-based session handling (short-lived cookie in this demo).

## Security notes

- This demo stores users in-memory — switch to a secure database for real applications.
- Use `httpOnly`, `secure`, and proper cookie attributes in production.
- Use environment variables for secrets and configuration.

## Quick start

```bash
bun install
bun run --hot src/index.ts
```

## Endpoints

- `POST /signup` — body: `{ "username": "...", "password": "..." }`
- `POST /login` — body: `{ "username": "...", "password": "..." }`
- `POST /logout` — clears the session cookie
- `GET /users` — returns the in-memory user list (demo-only)

## Next steps

- Add CSRF protection if you keep cookie-based sessions.
- Add email/username validation and rate limiting.

## License

MIT
To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000
