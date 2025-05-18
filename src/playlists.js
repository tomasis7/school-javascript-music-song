const playlists = [];

function createPlaylist(name) {
  const playlist = { name, songs: [] };
  playlists.push(playlist);
  return playlist;
}

function listPlaylists() {
  return playlists.map((pl) => ({
    name: pl.name,
    songs: pl.songs,
    songCount: pl.songs.length,
    totalDuration: pl.songs.reduce((sum, s) => sum + (s.duration || 0), 0),
    dateCreated: pl.createdAt,
  }));
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
