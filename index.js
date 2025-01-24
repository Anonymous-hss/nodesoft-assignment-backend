const express = require("express");
const pg = require("./db");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());
// Create a student
app.post("/student", async (req, res) => {
  const { id, first_name, last_name, date_of_birth, email } = req.body;

  try {
    const result = await pg.query(
      'INSERT INTO "student1" (first_name, last_name, date_of_birth, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, date_of_birth, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Get All Students
app.get("/student", async (req, res) => {
  try {
    const result = await pg.query("SELECT * FROM student1");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Student by ID with Marks
app.get("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await pg.query("SELECT * FROM student1 WHERE id = $1", [
      id,
    ]);
    const marks = await pg.query("SELECT * FROM Marks2 WHERE student_id = $1", [
      id,
    ]);

    if (student.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json({ student: student.rows[0], marks: marks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Student
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, email } = req.body;
  try {
    const result = await pg.query(
      "UPDATE student1 SET first_name = $1, last_name = $2, date_of_birth = $3, email = $4 WHERE id = $5 RETURNING *",
      [first_name, last_name, date_of_birth, email, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pg.query(
      "DELETE FROM student1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/students", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const students = await pg.query(
      "SELECT * FROM student1 LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    const total = await pg.query("SELECT COUNT(*) FROM student1");
    res.json({
      students: students.rows,
      total: parseInt(total.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
