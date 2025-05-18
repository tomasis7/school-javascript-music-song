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

fetch("/songs")
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

document.getElementById("create-playlist").addEventListener("click", () => {
  const nameInput = document.getElementById("playlist-name");
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter a playlist name.");

  fetch("/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to create playlist");
      return res.json();
    })
    .then((playlist) => {
      const li = document.createElement("li");
      li.textContent = playlist.name;
      document.getElementById("playlist-list").appendChild(li);
      nameInput.value = "";
    })
    .catch((err) => console.error(err));
});
