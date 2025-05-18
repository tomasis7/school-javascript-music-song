const fs = require("fs");
const path = require("path");

let songs = [];
const songsFilePath = path.join(__dirname, "../public/songs.json");

try {
  const data = fs.readFileSync(songsFilePath, "utf8");
  songs = JSON.parse(data);
} catch (err) {
  console.error("Error loading songs file:", err);
  songs = [];
}

function saveSongs() {
  fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2));
}

function addSong(title, artist, genre) {
  const song = { title, artist, genre };
  songs.push(song);
  saveSongs();
  return song;
}

function getSongs() {
  return songs;
}

function deleteSong(title) {
  const index = songs.findIndex((song) => song.title === title);
  if (index !== -1) {
    const deleted = songs.splice(index, 1)[0];
    saveSongs();
    return deleted;
  }
  return null;
}

function updateSong(title, newDetails) {
  const song = songs.find((song) => song.title === title);
  if (!song) return null;

  Object.assign(song, newDetails);
  saveSongs();
  return song;
}

module.exports = {
  addSong,
  getSongs,
  deleteSong,
  updateSong,
};
