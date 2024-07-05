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
    const response = await axios.post(
      `${process.env.PYTHON_API_URL}/search`,
      { institution_id, course_code }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Failed to search courses" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
