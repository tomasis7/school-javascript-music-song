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

app.post("/playlists", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Playlist name is required." });
  }
  const playlist = playlists.createPlaylist(name);
  res.status(201).json(playlist);
});

app.post("/playlists/:name/songs", (req, res) => {
  const { name } = req.params;
  const { title, artist, genre } = req.body;

  if (!title || !artist || !genre) {
    return res
      .status(400)
      .json({ error: "Title, artist, and genre are required." });
  }

  const song = { title, artist, genre };
  const updatedPlaylist = playlists.addSongToPlaylist(name, song);

  if (!updatedPlaylist) {
    return res.status(404).json({ error: "Playlist not found." });
  }

  res.status(201).json(updatedPlaylist);
});

app.get("/songs", (req, res) => {
  const allSongs = songs.getSongs();
  res.json(allSongs);
});

app.delete("/songs/:title", (req, res) => {
  const { title } = req.params;
  const deletedSong = songs.deleteSong(title);
  if (!deletedSong) {
    return res.status(404).json({ error: "Song not found." });
  }
  res.json(deletedSong);
});

app.put("/songs/:title", (req, res) => {
  const { title } = req.params;
  const newDetails = req.body;

  if (!newDetails.title && !newDetails.artist && !newDetails.genre) {
    return res
      .status(400)
      .json({ error: "At least one field must be updated." });
  }

  const updatedSong = songs.updateSong(title, newDetails);
  if (!updatedSong) {
    return res.status(404).json({ error: "Song not found." });
  }

  res.json(updatedSong);
});

const playlists = require("./playlists");

app.get("/playlists", (req, res) => {
  const allPlaylists = playlists.listPlaylists();
  res.json(allPlaylists);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
