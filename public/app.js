document.addEventListener("DOMContentLoaded", () => {
  const filterInput = document.getElementById("playlist-filter");
  const sortSelect = document.getElementById("playlist-sort");
  const refresh = () =>
    loadPlaylists(filterInput.value.trim(), sortSelect.value);

  filterInput.addEventListener("input", refresh);
  sortSelect.addEventListener("change", refresh);
  refresh();
});

function loadPlaylists(filter = "", sortKey = "name") {
  fetch("/playlists")
    .then((r) => r.json())
    .then((pls) => {
      let list = pls;
      if (filter) {
        list = list.filter((pl) =>
          pl.name.toLowerCase().includes(filter.toLowerCase())
        );
      }
      list.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));

      const ul = document.getElementById("playlist-list");
      ul.innerHTML = "";
      list.forEach((pl) => {
        const li = document.createElement("li");
        li.textContent = `${pl.name} (${pl.songCount} songs, ${pl.totalDuration} min)`;
        ul.appendChild(li);
      });
    });
}

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
  if (!name) return alert("Enter a name.");

  fetch("/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Failed to create playlist");
      return r.json();
    })
    .then((pl) => {
      const li = document.createElement("li");
      li.textContent = `${pl.name} (0 songs)`;
      document.getElementById("playlist-list").appendChild(li);
      nameInput.value = "";
    })
    .catch(console.error);
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
      attachSongActions(li, song);
      document.getElementById("song-list").appendChild(li);
      document.getElementById("song-title").value = "";
      document.getElementById("song-artist").value = "";
      document.getElementById("song-genre").value = "";
    })
    .catch(console.error);
});
