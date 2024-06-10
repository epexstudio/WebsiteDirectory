const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let websites = [];

app.get("/api/websites", (req, res) => {
  res.json(websites);
});

app.post("/api/websites", (req, res) => {
  const { title, url } = req.body;
  if (title && url) {
    websites.push({ title, url });
    res.status(201).json({ message: "Website added successfully" });
  } else {
    res.status(400).json({ message: "Title and URL are required" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
