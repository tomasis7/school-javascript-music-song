const fs = require("fs");
const path = require("path");

let playlists = [];
const playlistsFilePath = path.join(__dirname, "../public/playlists.json");

try {
  const data = fs.readFileSync(playlistsFilePath, "utf8");
  const loadedPlaylists = JSON.parse(data);

  // Make sure each playlist has a songs array
  playlists = loadedPlaylists.map((pl) => ({
    ...pl,
    songs: pl.songs || [],
  }));
} catch (err) {
  console.error("Error loading playlists file:", err);
  playlists = [];
}

function savePlaylists() {
  const safeList = playlists.map((p) => ({
    name: p.name,
    songs: p.songs || [],
    songCount: p.songs ? p.songs.length : 0,
    totalDuration: p.songs
      ? p.songs.reduce((sum, s) => sum + (s.duration || 0), 0)
      : 0,
    dateCreated: p.dateCreated,
  }));

  fs.writeFileSync(playlistsFilePath, JSON.stringify(safeList, null, 2));
}

function createPlaylist(name) {
  const now = new Date().toISOString();
  const pl = {
    name,
    songs: [],
    songCount: 0,
    totalDuration: 0,
    dateCreated: now,
  };
  playlists.push(pl);
  savePlaylists();
  return pl;
}

function listPlaylists() {
  return playlists.map((p) => ({
    name: p.name,
    songs: p.songs || [],
    songCount: p.songs ? p.songs.length : 0,
    totalDuration: p.songs
      ? p.songs.reduce((sum, s) => sum + (s.duration || 0), 0)
      : 0,
    dateCreated: p.dateCreated,
  }));
}

function addSongToPlaylist(playlistName, song) {
  const playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) {
    return null;
  }

  if (!playlist.songs) {
    playlist.songs = [];
  }

  playlist.songs.push(song);

  playlist.songCount = playlist.songs.length;
  savePlaylists();
  return playlist;
}

function removedSongFromPlaylist(playlistName, songTitle) {
  const playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) {
    return null;
  }
  const songIndex = playlist.songs.findIndex((s) => s.title === songTitle);
  if (songIndex === -1) {
    return null;
  }
  const removedSong = playlist.songs.splice(songIndex, 1)[0];
  savePlaylists();
  return removedSong;
}

function getSongsFromPlaylist(playlistName) {
  const playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) return null;
  return playlist.songs || [];
}

function deletePlaylist(name) {
  const idx = playlists.findIndex((p) => p.name === name);
  return idx > -1 ? playlists.splice(idx, 1)[0] : null;
}

function updatePlaylist(oldName, newName) {
  const pl = playlists.find((p) => p.name === oldName);
  if (!pl) return null;
  pl.name = newName;
  savePlaylists();
  return pl;
}

module.exports = {
  createPlaylist,
  listPlaylists,
  addSongToPlaylist,
  removedSongFromPlaylist,
  getSongsFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
