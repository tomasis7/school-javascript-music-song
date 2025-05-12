const express = require("express");
const bodyParser = require("body-parser");
const songs = require("./songs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/songs", (req, res) => {
  const { title, artist, genre } = req.body;
  const song = songs.addSong(title, artist, genre);
  res.status(201).json(song);
});
