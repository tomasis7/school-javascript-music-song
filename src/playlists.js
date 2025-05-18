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

function removedSongFromPlaylist(playlistName, songTitle) {
  const playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) {
    return null;
  }
  const songIndex = playlist.songs.findIndex((s) => s.title === songTitle);
  if (songIndex === -1) {
    return null;
  }
  // const removedSong = playlist.songs.splice(songIndex, 1);
  // return removedSong[0];
}

function getSongsFromPlaylist(playlistId) {
  const playlist = playlists.find((p) => p.id === playlistId);
  return playlist ? playlist.songs : null;
}

function deletePlaylist(name) {
  const idx = playlists.findIndex((p) => p.name === name);
  return idx > -1 ? playlists.splice(idx, 1)[0] : null;
}

function updatePlaylist(oldName, newName) {
  const pl = playlists.find((p) => p.name === oldName);
  if (!pl) return null;
  pl.name = newName;
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
