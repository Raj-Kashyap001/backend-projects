import { Hono } from "hono";

const app = new Hono();

interface Note {
  id: number;
  text: string;
}

const notes: Note[] = [
  { id: 1, text: "Hello World" },
  { id: 2, text: "Foo Bar" },
  { id: 3, text: "Lorem Ipsum" },
];

app.get("/health", (c) => {
  return c.text("Hello Hono!");
});

// Get All Notes
app.get("/notes", (c) => {
  return c.json(notes);
});

// Add one Note
app.post("/notes", async (c) => {
  try {
    const data = await c.req.json();

    // Simple Validation
    if (!data || !data.text) {
      return c.json({ message: "Bad Request - missing text." }, 400);
    }

    const id = notes.length + 1;
    notes.push({ ...data, id });
    return c.json({ message: `Note created with id ${id}` }, 201);
  } catch (error: any) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// update a Note
app.put("/note/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { text } = await c.req.json();
    if (!text) {
      return c.json({ message: "Bad Request - missing text." }, 400);
    }

    const parsed = parseInt(id || "", 10);
    const found = notes.find((n) => n.id === parsed);
    if (!found) return c.json({ message: "Note not found." }, 404);

    found.text = text;
    return c.json({ message: "OK", data: found });
  } catch (error: any) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// delete a Note
app.delete("/note/:id", (c) => {
  const id = c.req.param("id");
  if (!id) return c.json({ message: "Bad Request - missing id." }, 400);

  const parsed = parseInt(id, 10);
  const index = notes.findIndex((note) => note.id === parsed);
  if (index === -1) {
    return c.json({ message: "Note not found." }, 404);
  }
  notes.splice(index, 1);

  return c.json({ message: "OK" });
});

export default app;
