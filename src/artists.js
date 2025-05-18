const artists = [];

function addArtist(name) {
  const artist = { id: artists.length + 1, name };
  artists.push(artist);
  return artist;
}

function getArtists() {
  return artists;
}

function deleteArtist(id) {
  const index = artists.findIndex((artist) => artist.id === id);
  if (index !== -1) {
    return artists.splice(index, 1)[0];
  }
  return null;
}

module.exports = {
  addArtist,
  getArtists,
  deleteArtist,
};
