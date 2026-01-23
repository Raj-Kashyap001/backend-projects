import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

const app = new Hono();

// Secret keys (in production, use environment variables)
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";

// Simulated user database
const users: Record<string, { password: string; id: string }> = {
  user1: { password: "password123", id: "1" },
  user2: { password: "password456", id: "2" },
};

// Refresh token store (in production, use a database)
const refreshTokens: Set<string> = new Set();

// Generate tokens using Hono's JWT utilities
async function generateAccessToken(userId: string, username: string) {
  const payload = { userId, username, iat: Date.now() };
  return await sign(payload, ACCESS_TOKEN_SECRET);
}

async function generateRefreshToken(userId: string, username: string) {
  const payload = { userId, username, iat: Date.now() };
  return await sign(payload, REFRESH_TOKEN_SECRET);
}

// Generate token pair
async function generateTokens(userId: string, username: string) {
  const accessToken = await generateAccessToken(userId, username);
  const refreshToken = await generateRefreshToken(userId, username);
  refreshTokens.add(refreshToken);
  return { accessToken, refreshToken };
}

// Health check
app.get("/health", (c) => c.json({ status: "OK" }));

// Register endpoint
app.post("/register", async (c) => {
  try {
    const { username, password } = (await c.req.json()) as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      return c.json({ message: "Username and password are required" }, 400);
    }

    if (users[username]) {
      return c.json({ message: "User already exists" }, 409);
    }

    users[username] = { password, id: String(Object.keys(users).length + 1) };

    return c.json({ message: "User registered successfully", username }, 201);
  } catch (err: any) {
    return c.json({ message: "Registration failed", error: err.message }, 500);
  }
});

// Login endpoint
app.post("/login", async (c) => {
  try {
    const { username, password } = (await c.req.json()) as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      return c.json({ message: "Username and password are required" }, 400);
    }

    const user = users[username];
    if (!user || user.password !== password) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      username,
    );

    return c.json(
      {
        message: "Login successful",
        accessToken,
        refreshToken,
        user: { id: user.id, username },
      },
      200,
    );
  } catch (err: any) {
    return c.json({ message: "Login failed", error: err.message }, 500);
  }
});

// Refresh token endpoint
app.post("/refresh", async (c) => {
  try {
    const { refreshToken } = (await c.req.json()) as { refreshToken: string };

    if (!refreshToken) {
      return c.json({ message: "Refresh token is required" }, 400);
    }

    if (!refreshTokens.has(refreshToken)) {
      return c.json({ message: "Invalid refresh token" }, 401);
    }

    const decoded = (await verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      "HS256",
    )) as {
      userId: string;
      username: string;
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      decoded.userId,
      decoded.username,
    );

    refreshTokens.delete(refreshToken);

    return c.json(
      {
        message: "Token refreshed",
        accessToken,
        refreshToken: newRefreshToken,
      },
      200,
    );
  } catch (err: any) {
    return c.json({ message: "Token refresh failed", error: err.message }, 401);
  }
});

// Logout endpoint
app.post("/logout", async (c) => {
  try {
    const { refreshToken } = (await c.req.json()) as { refreshToken: string };

    if (refreshToken && refreshTokens.has(refreshToken)) {
      refreshTokens.delete(refreshToken);
    }

    return c.json({ message: "Logout successful" }, 200);
  } catch (err: any) {
    return c.json({ message: "Logout failed", error: err.message }, 500);
  }
});

// Protected route
app.get("/profile", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ message: "Authorization header is required" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = (await verify(token, ACCESS_TOKEN_SECRET, "HS256")) as {
      userId: string;
      username: string;
    };

    return c.json(
      {
        message: "Access granted",
        user: { userId: decoded.userId, username: decoded.username },
      },
      200,
    );
  } catch (err: any) {
    return c.json(
      { message: "Profile access failed", error: err.message },
      500,
    );
  }
});

export default app;
