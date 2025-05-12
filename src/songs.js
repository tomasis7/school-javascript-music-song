const songs = [];

function addSong(title, artist, genre) {
  const song = {
    title,
    artist,
    genre,
  };
  songs.push(song);
  return song;
}

function getSongs() {
  return songs;
}

function deleteSong(title) {
  const index = songs.findIndex((song) => song.title === title);
  if (index !== -1) {
    return songs.splice(index, 1)[0];
  }
  return null;
}

function updateSong(title, newDetails) {
  const song = songs.find((song) => song.title === title);
  if (!song) return null;

  Object.assign(song, newDetails);
  return song;
}

module.exports = {
  addSong,
  getSongs,
  deleteSong,
  updateSong,
};
