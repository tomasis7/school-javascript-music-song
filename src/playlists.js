const playlists = [];

function createPlaylist(name) {
  const playlist = { name, songs: [] };
  playlists.push(playlist);
  return playlist;
}

function listPlaylists() {
  return playlists;
}

module.exports = {
  createPlaylist,
  listPlaylists,
};
