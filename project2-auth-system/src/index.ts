import { Hono } from 'hono'
import { setCookie, getCookie } from 'hono/cookie';
const app = new Hono()

interface User {
  id:       number,
  username: string,
  password: string
}

let id = 0;

const users: User[] = []

app.get('/health', (c) => {
  return c.text('OK!')
})

app.get('/users', (c) => c.json(users));

function findUserByUsername(username: string) {
  const user = users.filter(user => user.username === username);
  return user.length > 0 ? user : null;
}

function findUserById(id: number) {
  const user = users.filter(user => user.id === id);
  return user.length > 0 ? user : null;
}

// signup
app.post("/signup", async (c) => {
  const { username, password } = await c.req.json();
  
  const user = findUserByUsername(username);
  if (user) return c.json({ message: "User Already Exist!" }, 400);

  // create user with hashed password
  const hashedPass = await Bun.password.hash(password);
  
  users.push({ id: ++id, username, password: hashedPass})
  setCookie(c, "userId", id, {
    maxAge: 60, // seconds
    // httpOnly: true only in production
  });

  return c.json({message: "Signup Success"});
})

// login
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const id = getCookie(c, 'userId');
  if (!id) return c.json({ message: "Unauthorized!" }, 401);

  const user = findUserById(parseInt(id));
  if (!user) return c.json({ message: "User Not Found!" }, 404);

  const validPass = await Bun.password.verify(password, user.password);
  if (!validPass) return c.json({ message: "Unauthorized!" }, 401);

  setCookie(c, "userId", id, {
    maxAge: 60, // seconds
    // httpOnly: true only in production
  });

  return c.json({message: "Login Success", data: {username: user.username} });
})

// logout
app.post("/logout", (c) => {

  setCookie(c, "userId", null);

  return c.json({message: "Logout Success"});
})

export default app
