document.addEventListener("DOMContentLoaded", () => {
  // Playlists
  fetch("/playlists")
    .then((r) => r.json())
    .then((playlists) => {
      const playlistList = document.getElementById("playlist-list");
      playlistList.innerHTML = "";
      playlists.forEach((pl) => {
        const li = document.createElement("li");
        li.textContent = pl.name;
        attachPlaylistActions(li, pl); // ← add this
        playlistList.appendChild(li);
      });
    });

  // Songs
  fetch("/songs")
    .then((r) => r.json())
    .then((songs) => {
      const songList = document.getElementById("song-list");
      songList.innerHTML = "";
      songs.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} by ${song.artist} (${song.genre})`;
        attachSongActions(li, song); // ← add this
        songList.appendChild(li);
      });
    });
});

function attachSongActions(li, song) {
  const edit = document.createElement("button");
  edit.textContent = "✏️";
  edit.onclick = () => {
    const title = prompt("New title:", song.title);
    const artist = prompt("New artist:", song.artist);
    const genre = prompt("New genre:", song.genre);
    fetch(`/songs/${encodeURIComponent(song.title)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, genre }),
    })
      .then((r) => r.json())
      .then((upd) => {
        li.firstChild.textContent = `${upd.title} by ${upd.artist} (${upd.genre})`;
      })
      .catch(console.error);
  };

  const del = document.createElement("button");
  del.textContent = "🗑️";
  del.onclick = () => {
    fetch(`/songs/${encodeURIComponent(song.title)}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) li.remove();
      })
      .catch(console.error);
  };

  li.append(" ", edit, " ", del);
}

function attachPlaylistActions(li, pl) {
  const edit = document.createElement("button");
  edit.textContent = "✏️";
  edit.onclick = () => {
    const newName = prompt("Rename playlist:", pl.name);
    fetch(`/playlists/${encodeURIComponent(pl.name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName }),
    })
      .then((r) => r.json())
      .then((upd) => {
        li.firstChild.textContent = upd.name;
        pl.name = upd.name;
      })
      .catch(console.error);
  };

  const del = document.createElement("button");
  del.textContent = "🗑️";
  del.onclick = () => {
    fetch(`/playlists/${encodeURIComponent(pl.name)}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) li.remove();
      })
      .catch(console.error);
  };

  li.append(" ", edit, " ", del);
}

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
      attachPlaylistActions(li, playlist); // ← add this
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
      attachSongActions(li, song); // ← add this
      document.getElementById("song-list").appendChild(li);
      // clear inputs
      document.getElementById("song-title").value = "";
      document.getElementById("song-artist").value = "";
      document.getElementById("song-genre").value = "";
    })
    .catch(console.error);
});
