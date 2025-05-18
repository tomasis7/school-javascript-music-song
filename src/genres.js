const genres = [];

const addGenre = (genre) => {
  if (!genres.includes(genre)) {
    genres.push(genre);
    return true;
  }
  return false;
};

const getGenres = () => {
  return genres;
};

const deleteGenre = (genre) => {
  const index = genres.indexOf(genre);
  if (index > -1) {
    genres.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  addGenre,
  getGenres,
  deleteGenre,
};
