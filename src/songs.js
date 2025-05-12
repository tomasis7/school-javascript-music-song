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
