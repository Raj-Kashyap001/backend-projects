# Project 1 — Notes API

A compact, dependency-light REST API for managing short notes. Built with `Hono` on `Bun` for minimal startup time and a small operational footprint. The implementation focuses on clarity and is suitable as a learning reference or a foundation for a production service.

- Language: TypeScript
- Runtime: Bun
- Framework: Hono

## Features

- List, create, update, and delete notes
- Small in-memory store (swap for a persistent DB in production)
- Health endpoint

## Getting started

1. Install Bun (https://bun.sh/) if you don't already have it.
2. Install dependencies:

```bash
bun install
```

3. Run in development mode:

```bash
bun run --hot src/index.ts
```

Or start the app directly:

```bash
bun run src/index.ts
```

## Endpoints

- `GET /health` — simple liveness check
- `GET /notes` — returns all notes
- `POST /notes` — create a note: JSON `{ "text": "..." }`
- `PUT /note/:id` — update a note's text
- `DELETE /note/:id` — delete a note

## Notes for production

- Replace the in-memory `notes` array with a persistent store (Postgres, SQLite, etc.).
- Add proper request validation and authentication.
- Use environment variables for configuration (do not commit secrets).

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
