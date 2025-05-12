const express = require("express");
const bodyParser = require("body-parser");
const songs = require("./songs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/songs", (req, res) => {
  const { title, artist, genre } = req.body;
  if (!title || !artist || !genre) {
    return res
      .status(400)
      .json({ error: "Title, artist, and genre are required." });
  }
  const song = songs.addSong(title, artist, genre);
  res.status(201).json(song);
});

app.get("/songs", (req, res) => {
  res.json(songs.getSongs());
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
