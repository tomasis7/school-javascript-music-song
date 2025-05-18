document.addEventListener("DOMContentLoaded", () => {
  fetch("/playlists")
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
