import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
const app = new Hono();

interface User {
  id: number;
  username: string;
  password: string;
}

let id = 0;

const users: User[] = [];

app.get("/health", (c) => {
  return c.text("OK!");
});

app.get("/users", (c) => c.json(users));

function findUserByUsername(username: string): User | null {
  const user = users.find((u) => u.username === username);
  return user ?? null;
}

function findUserById(id: number): User | null {
  const user = users.find((u) => u.id === id);
  return user ?? null;
}

// signup
app.post("/signup", async (c) => {
  const { username, password } = await c.req.json();

  const user = findUserByUsername(username);
  if (user) return c.json({ message: "User Already Exist!" }, 400);

  // create user with hashed password
  const hashedPass = await Bun.password.hash(password);

  users.push({ id: ++id, username, password: hashedPass });
  setCookie(c, "userId", String(id), {
    maxAge: 60, // seconds
    // httpOnly: true only in production
  });

  return c.json({ message: "Signup Success" });
});

// login
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const cookieId = getCookie(c, "userId");
  if (!cookieId) return c.json({ message: "Unauthorized" }, 401);

  const user = findUserById(parseInt(cookieId, 10));
  if (!user) return c.json({ message: "User Not Found" }, 404);

  const validPass = await Bun.password.verify(
    password,
    user.password as string,
  );
  if (!validPass) return c.json({ message: "Unauthorized!" }, 401);
  setCookie(c, "userId", cookieId, {
    maxAge: 60, // seconds
    // httpOnly: true only in production
  });

  return c.json({
    message: "Login Success",
    data: { username: user.username },
  });
});

// logout
app.post("/logout", (c) => {
  setCookie(c, "userId", "");

  return c.json({ message: "Logout Success" });
});

export default app;
