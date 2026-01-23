# Project 3 — Wallpaper Utility

Small service that exposes wallpaper information and serves static wallpaper assets. Intended as a compact utility that demonstrates calling host tools from Bun and serving static files with `Hono`.

## Features

- Serve static wallpaper files under `/wallpapers/*`
- Endpoint to return the current wallpaper URL (reads from host `dms` tool)
- Health check endpoint

## Quick start

```bash
bun install
bun run --hot src/index.ts
```

## Endpoints

- `GET /health` — liveness check
- `GET /wallpaper` — returns current wallpaper URL (may call host tools)
- `GET /wallpapers/<file>` — serves static files from `src/wallpapers/`

## Notes

- The `/wallpaper` endpoint invokes a local shell command; ensure the environment has the expected tool (`dms` in the example) or update the command to your environment.
- For a production deployment, avoid executing shell commands directly from request handlers without strong validation and sandboxing.

## License

MIT

# Wallpaper Sync Engine for linux and android

### backend

```http
GET api/wallpaper
```

**result url of current wallpaper**
eg. api/wallpaper/wallaper1.png
