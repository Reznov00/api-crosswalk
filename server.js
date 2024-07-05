const { default: axios } = require("axios");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", () => {
  console.log("SERVER IS LIVE");
});

// Routes
app.get("/institutions", async (req, res) => {
  // Return a list of institutions
  const response = await axios.get(
    `${process.env.PYTHON_API_URL}/institutions`
  );
  console.log(response);
  if (response.status === 200) {
    return res.status(200).json(response.data);
  }
  return res.status(500).json({ error: "Failed to fetch institutions" });
});

app.post("/courses", async (req, res) => {
  const { institutionIds } = req.body;
  let query = "";
  institutionIds.forEach((ins) => (query += "institution_id=" + ins + "&"));
  const response = await axios.get(
    `${process.env.PYTHON_API_URL}/courses?${query}`
  );
  if (response.status === 200) {
    return res.status(200).json(response.data);
  }
  return res.status(400).json({ error: "Failed to fetch courses" });
});

app.post("/search", async (req, res) => {
  const { institution_id, course_code } = req.body;
  const response = await axios.post(`${process.env.PYTHON_API_URL}/search`, {
    institution_id,
    course_code,
  });
  if (response.status === 200) {
    return res.status(200).json(response.data);
  }
  return res.status(400).json({ error: "Failed to search courses" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
