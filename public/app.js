document.addEventListener("DOMContentLoaded", () => {
  fetch("playlists.json")
    .then((response) => response.json())
    .then((playlists) => {
      const playlistList = document.getElementById("playlist-list");
      playlistList.innerHTML = "";
      playlists.forEach((playlist) => {
        const li = document.createElement("li");
        li.textContent = playlist.name;
        playlistList.appendChild(li);
      });
    });
});

fetch("songs.json")
  .then((response) => response.json())
  .then((songs) => {
    const songList = document.getElementById("song-list");
    songList.innerHTML = "";
    songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} by ${song.artist} (${song.genre})`;
      songList.appendChild(li);
    });
  });
