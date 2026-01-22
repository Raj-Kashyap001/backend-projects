import { $ } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
const app = new Hono();

app.use("/wallpapers/*", serveStatic({ root: "src/" }));

app.get("/wallpaper", async (c) => {
  const currentWallpaper = await $`dms ipc call wallpaper get`;
  return c.json({ url: currentWallpaper.text().trimEnd() });
});

export default app;
