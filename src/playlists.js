const playlists = [];

function createPlaylist(name) {
  const playlist = { name, songs: [] };
  playlists.push(playlist);
  return playlist;
}

function listPlaylists() {
  return playlists;
}

function addSongToPlaylist(playlistName, song) {
  const playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) {
    return null;
  }
  playlist.songs.push(song);
  return playlist;
}

module.exports = {
  createPlaylist,
  listPlaylists,
  addSongToPlaylist,
};
