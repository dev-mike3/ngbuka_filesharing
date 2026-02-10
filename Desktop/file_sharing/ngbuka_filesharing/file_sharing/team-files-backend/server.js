const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

// Load saved files
const loadFiles = () => {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
};

// Save files
const saveFiles = (files) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(files, null, 2));
};

// GET all files
app.get("/files", async (req, res) => {
  const savedFiles = loadFiles();
  res.json(savedFiles);
});

// POST: Add new file after upload
app.post("/add-file", (req, res) => {
  const file = req.body;

  const savedFiles = loadFiles();
  savedFiles.unshift(file); // Add newest first

  saveFiles(savedFiles);
  res.json({ message: "Saved", file });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
