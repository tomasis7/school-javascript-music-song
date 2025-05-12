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

module.exports = {
  addSong,
  getSongs,
  deleteSong,
};
