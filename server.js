const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors"); // Import cors middleware
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Use cors middleware to allow all origins

app.get("/", (req, res) => {
  res.send("SERVER LIVE");
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
// Routes
app.get("/institutions", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.PYTHON_API_URL}/institutions`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

app.post("/courses", async (req, res) => {
  const { institutionIds } = req.body;
  let query = "";
  institutionIds.forEach((ins) => (query += "institution_id=" + ins + "&"));
  try {
    const response = await axios.get(
      `${process.env.PYTHON_API_URL}/courses?${query}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch courses" });
  }
});

app.post("/search", async (req, res) => {
  const { institution_id, course_code } = req.body;
  try {
    const response = await axios.post(`${process.env.PYTHON_API_URL}/search`, {
      institution_id,
      course_code,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Failed to search courses" });
  }
});

app.post("/search_all", async (req, res) => {
  const { course_code, title, description } = req.body;
  try {
    if (course_code > "" && title > "" && description > "") {
      const response = await axios.post(
        `${process.env.PYTHON_API_URL}/search_all`,
        {
          course_code,
          title,
          description,
        }
      );
      res.status(200).json(response.data);
    } else {
      res.status(400).json({ error: "Missing data" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

app.post("/compare_courses", async (req, res) => {
  const {
    course1_code,
    course1_title,
    course1_description,
    course2_code,
    course2_title,
    course2_description,
  } = req.body;
  console.log({
    course1_code,
    course1_title,
    course1_description,
    course2_code,
    course2_title,
    course2_description,
  });
  try {
    if (
      course1_code &&
      course1_title &&
      course1_description &&
      course2_code &&
      course2_title &&
      course2_description
    ) {
      const response = await axios.post(
        `${process.env.PYTHON_API_URL}/compare_courses`,
        {
          course1_code,
          course1_title,
          course1_description,
          course2_code,
          course2_title,
          course2_description,
        }
      );
      res.status(200).json(response.data);
    } else {
      res.status(400).json({ error: "Missing data" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to search courses" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
