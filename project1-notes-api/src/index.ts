import { Hono } from 'hono'

const app = new Hono()

interface Note {
  id: number,
  text: string
}

const notes: Note[] = [
  {id: 1, text: "Hello World"},
  {id: 2, text: "Foo Bar"},
  {id: 3, text: "Lorem Ipsum"}
]

app.get('/health', (c) => {
  return c.text('Hello Hono!')
})

// Get All Notes
app.get("/notes", (c) => {
  return c.json(notes)
})


// Add one Note
app.post("/notes", async (c) => {
  try {
    const data = await c.req.json();

    // Simple Validation
    if (!data && !data.text) {
      return c.json({message: "Bad Request!"}, 400)
    }

    const id = notes.length + 1
    notes.push({...data, id})
    return c.json({message: `Note Created with id ${id}`}, 201)
  } catch (error: any) {
    console.log(error)
  }
})


// update a Note
app.put("/note/:id", async (c) => {
  try {
    const { id } = c.req.param()
    const { text } = await c.req.json()
    if (!text) {
      return c.json({message: "Bad Request!"}, 400)
    }
    notes.map(note => {
      if (note.id === parseInt(id)) {
        note.text = text;
      }
    })
  } catch (error: any) {
    console.log(error)
  }
  return c.json({message: "OK"})
})

// delete a Note
app.delete("/note/:id", (c) => {
  const { id } = c.req.param()

  if (!id) return c.json({message: "Bad Request!"})
  
  const index = notes.findIndex(note => note.id === parseInt(id))
  console.log(index)
  if (index === -1) {
    return c.json({message: "Note Not Found!"}, 404)
  }
  notes.splice(index,1);

  return c.json({message: "OK"})
})

export default app
