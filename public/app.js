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

        li.addEventListener("click", () => {
          window.currentPlaylist = pl.name;
          loadDetails(pl.name);
        });

        attachPlaylistActions(li, pl);

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

  const playlistSelect = document.createElement("select");
  const placeholderOpt = document.createElement("option");
  placeholderOpt.textContent = "-- select playlist --";
  placeholderOpt.disabled = true;
  placeholderOpt.selected = true;
  playlistSelect.appendChild(placeholderOpt);

  fetch("/playlists")
    .then((r) => r.json())
    .then((pls) => {
      pls.forEach((pl) => {
        const opt = document.createElement("option");
        opt.value = pl.name;
        opt.textContent = pl.name;
        playlistSelect.appendChild(opt);
      });
    })
    .catch(console.error);

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕";
  addBtn.title = "Add to playlist";
  addBtn.onclick = () => {
    const selected = playlistSelect.value;
    if (!selected) return alert("Please select a playlist.");

    fetch(`/playlists/${encodeURIComponent(selected)}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(song),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to add song to playlist");
        return r.json();
      })
      .then(() => {
        alert(`"${song.title}" added to "${selected}"`);

        const filterInput = document.getElementById("playlist-filter");
        const sortSelect = document.getElementById("playlist-sort");
        loadPlaylists(filterInput.value.trim(), sortSelect.value);

        if (window.currentPlaylist === selected) {
          loadDetails(selected);
        }
      })
      .catch(console.error);
  };

  li.append(" ", playlistSelect, " ", addBtn);
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

function loadDetails(playlistName) {
  document.getElementById("title").textContent = playlistName;
  const groupsDiv = document.getElementById("groups");
  groupsDiv.innerHTML = "";

  fetch("/playlists")
    .then((r) => r.json())
    .then((playlists) => {
      const playlist = playlists.find((p) => p.name === playlistName);
      if (!playlist) {
        groupsDiv.innerHTML = "<p>Playlist not found</p>";
        return;
      }

      fetch(`/playlists/${encodeURIComponent(playlistName)}/songs`)
        .then((r) => r.json())
        .then((songs) => {
          displaySongsByGroup(songs, document.getElementById("group-by").value);
        })
        .catch((err) => {
          console.error("Error loading playlist songs:", err);
          groupsDiv.innerHTML = "<p>Error loading songs</p>";
        });
    })
    .catch(console.error);
}

function displaySongsByGroup(songs, groupBy) {
  const groupsDiv = document.getElementById("groups");
  groupsDiv.innerHTML = "";

  const groups = {};
  songs.forEach((song) => {
    const key = song[groupBy] || "Unknown";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(song);
  });

  const sortedKeys = Object.keys(groups).sort();

  sortedKeys.forEach((key) => {
    const groupSection = document.createElement("section");
    groupSection.className = "song-group";

    const groupTitle = document.createElement("h3");
    groupTitle.textContent = key;
    groupSection.appendChild(groupTitle);

    const songsList = document.createElement("ul");
    songsList.className = "songs-in-group";

    groups[key]
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((song) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} – ${song.artist} [${song.genre}]`;
        attachSongActions(li, song);
        songsList.appendChild(li);
      });

    groupSection.appendChild(songsList);
    groupsDiv.appendChild(groupSection);
  });

  if (window.Sortable) {
    document.querySelectorAll(".songs-in-group").forEach((list) => {
      new Sortable(list, {
        animation: 150,
        ghostClass: "sortable-ghost",
        onEnd: function () {},
      });
    });
  }
}

document.getElementById("group-by").addEventListener("change", function () {
  if (window.currentPlaylist) {
    fetch(`/playlists/${encodeURIComponent(window.currentPlaylist)}/songs`)
      .then((r) => r.json())
      .then((songs) => {
        displaySongsByGroup(songs, this.value);
      })
      .catch(console.error);
  }
});
