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

document.getElementById("add-song").addEventListener("click", () => {
  const t = document.getElementById("song-title").value.trim();
  const a = document.getElementById("song-artist").value.trim();
  const g = document.getElementById("song-genre").value.trim();
  if (!t || !a || !g) return alert("All fields required.");

  fetch("/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: t, artist: a, genre: g }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Failed to create song");
      return r.json();
    })
    .then((song) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} – ${song.artist} [${song.genre}]`;
      document.getElementById("song-list").appendChild(li);
      // clear inputs
      document.getElementById("song-title").value = "";
      document.getElementById("song-artist").value = "";
      document.getElementById("song-genre").value = "";
    })
    .catch(console.error);
});
