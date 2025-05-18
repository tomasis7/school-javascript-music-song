const express = require("express");
const bodyParser = require("body-parser");
const songs = require("./songs");
const playlists = require("./playlists");
const genres = require("./genres");
const artists = require("./artists");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/songs", (req, res) => {
  const { title, artist, genre } = req.body;
  if (!title || !artist || !genre) {
    return res
      .status(400)
      .json({ error: "Title, artist, and genre are required." });
  }

  const song = songs.addSong(title, artist, genre);

  const filePath = path.join(__dirname, "../public/songs.json");
  fs.writeFile(filePath, JSON.stringify(songs.getSongs(), null, 2), (err) => {
    if (err) console.error("Failed to save songs file:", err);
  });

  res.status(201).json(song);
});

app.post("/playlists", (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ error: "Playlist name is required." });

  const pl = playlists.createPlaylist(name);
  const fp = path.join(__dirname, "../public/playlists.json");
  fs.writeFile(
    fp,
    JSON.stringify(playlists.listPlaylists(), null, 2),
    (err) => {
      if (err)
        return res.status(500).json({ error: "Failed to save playlists." });
      res.status(201).json(pl);
    }
  );
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

  const fp = path.join(__dirname, "../public/playlists.json");
  fs.writeFile(
    fp,
    JSON.stringify(playlists.listPlaylists(), null, 2),
    (err) => {
      if (err) {
        console.error("Failed to save playlists:", err);
        return res.status(500).json({ error: "Failed to save changes" });
      }
      res.status(201).json(updatedPlaylist);
    }
  );
});

app.post("/genres", (req, res) => {
  const { genre } = req.body;
  if (!genre) {
    return res.status(400).json({ error: "Genre is required." });
  }
  const addedGenre = genres.addGenre(genre);
  if (!addedGenre) {
    return res.status(400).json({ error: "Genre already exists." });
  }
  res.status(201).json({ genre });
});
app.post("/artists", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Artist name is required." });
  }
  const addedArtist = artists.addArtist(name);
  if (!addedArtist) {
    return res.status(400).json({ error: "Artist already exists." });
  }
  res.status(201).json(addedArtist);
});

app.delete("/songs/:title", (req, res) => {
  const { title } = req.params;
  const deletedSong = songs.deleteSong(title);
  if (!deletedSong) {
    return res.status(404).json({ error: "Song not found." });
  }
  res.json(deletedSong);
});

app.delete("/playlists/:name/songs/:title", (req, res) => {
  const { name, title } = req.params;
  const removedSong = playlists.removedSongFromPlaylist(name, title);
  if (!removedSong) {
    return res.status(404).json({ error: "Playlist or song not found." });
  }
  res.json(removedSong);
});

app.delete("/playlists/:name", (req, res) => {
  const { name } = req.params;
  const removed = playlists.deletePlaylist(name);
  if (!removed) return res.status(404).json({ error: "Playlist not found." });

  // Persist
  const fp = path.join(__dirname, "../public/playlists.json");
  fs.writeFile(
    fp,
    JSON.stringify(playlists.listPlaylists(), null, 2),
    () => {}
  );
  res.json(removed);
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

app.put("/playlists/:name", (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ error: "New name is required" });
  }

  const updatedPlaylist = playlists.updatePlaylist(name, newName);

  if (!updatedPlaylist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  // Save changes to the playlists.json file
  const fp = path.join(__dirname, "../public/playlists.json");
  fs.writeFile(
    fp,
    JSON.stringify(playlists.listPlaylists(), null, 2),
    (err) => {
      if (err) {
        console.error("Failed to save playlist changes:", err);
        return res.status(500).json({ error: "Failed to save changes" });
      }
      res.json(updatedPlaylist);
    }
  );
});

app.get("/playlists", (req, res) => {
  res.json(playlists.listPlaylists());
});

app.get("/songs", (req, res) => {
  const filePath = path.join(__dirname, "../public/songs.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read songs file." });
    }
    const allSongs = JSON.parse(data);
    res.json(allSongs);
  });
});

app.get("/playlists/:id/songs", (req, res) => {
  const playlistId = parseInt(req.params.id, 10);
  const songsInPlaylist = playlists.getSongsFromPlaylist(playlistId);
  if (!songsInPlaylist) {
    return res.status(404).json({ error: "Playlist not found." });
  }
  res.json(songsInPlaylist);
});

app.get("/genres", (req, res) => {
  const allGenres = genres.getGenres();
  res.json(allGenres);
});

app.get("/artists", (req, res) => {
  const allArtists = artists.getArtists();
  res.json(allArtists);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
