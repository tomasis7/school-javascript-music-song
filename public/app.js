document.addEventListener("DOMContentLoaded", () => {
  const filterInput = document.getElementById("playlist-filter");
  const sortSelect = document.getElementById("playlist-sort");
  const groupBySelect = document.getElementById("group-by");

  const refresh = () =>
    loadPlaylists(filterInput.value.trim(), sortSelect.value);

  groupBySelect.addEventListener("change", function () {
    currentGrouping = this.value;
    fetchAndDisplaySongs();
  });

  filterInput.addEventListener("input", refresh);
  sortSelect.addEventListener("change", refresh);

  refresh();
  fetchAndDisplaySongs();
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
        li.textContent = `${pl.name} (${pl.songCount || 0} songs, ${
          pl.totalDuration || 0
        } min)`;

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
      .then((updatedPlaylist) => {
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
  edit.onclick = (event) => {
    event.stopPropagation();

    const newName = prompt("Rename playlist:", pl.name);
    if (!newName || newName === pl.name) return;

    fetch(`/playlists/${encodeURIComponent(pl.name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then((upd) => {
        li.firstChild.textContent = `${upd.name} (${pl.songCount} songs, ${pl.totalDuration} min)`;

        const oldName = pl.name;
        pl.name = upd.name;

        if (window.currentPlaylist === oldName) {
          window.currentPlaylist = upd.name;
          document.getElementById("title").textContent = upd.name;
        }

        refreshAllPlaylistDropdowns();
      })
      .catch((err) => {
        console.error("Failed to update playlist:", err);
        alert("Failed to update playlist. Please try again.");
      });
  };

  const del = document.createElement("button");
  del.textContent = "🗑️";
  del.onclick = () => {
    fetch(`/playlists/${encodeURIComponent(pl.name)}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) {
          li.remove();
          refreshAllPlaylistDropdowns();
        }
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

      refreshAllPlaylistDropdowns();
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
        .then((songsData) => {
          const songs = Array.isArray(songsData) ? songsData : [];

          if (!Array.isArray(songsData)) {
            console.warn(
              "Expected array from /songs endpoint but got:",
              songsData
            );
          }

          displaySongsByGroup(songs, document.getElementById("group-by").value);
        })
        .catch((err) => {
          console.error("Error loading playlist songs:", err);
          groupsDiv.innerHTML = "<p>Error loading songs</p>";
        });
    })
    .catch(console.error);
}

let currentGrouping = "genre";

document.getElementById("group-by").addEventListener("change", function () {
  currentGrouping = this.value;
  fetchAndDisplaySongs();
});

function fetchAndDisplaySongs() {
  fetch("/songs")
    .then((response) => response.json())
    .then((songs) => {
      displaySongsByGroup(songs, currentGrouping);
    })
    .catch((error) => {
      console.error("Error fetching songs:", error);
      document.getElementById("song-list").innerHTML =
        '<li class="empty-message">Error loading songs. Please try again.</li>';
    });
}

function displaySongsByGroup(songs, groupBy) {
  const songList = document.getElementById("song-list");
  songList.innerHTML = "";

  if (!songs || songs.length === 0) {
    songList.innerHTML = '<li class="empty-message">No songs available</li>';
    return;
  }

  const groupedSongs = {};

  songs.forEach((song) => {
    let groupKey;

    if (groupBy === "genre") {
      groupKey = song.genre || "Unknown Genre";
    } else if (groupBy === "artist") {
      groupKey = song.artist || "Unknown Artist";
    } else if (groupBy === "title") {
      groupKey = song.title.charAt(0).toUpperCase() || "#";
      if (!/[A-Z]/.test(groupKey)) {
        groupKey = "#";
      }
    }

    if (!groupedSongs[groupKey]) {
      groupedSongs[groupKey] = [];
    }

    groupedSongs[groupKey].push(song);
  });

  const sortedGroups = Object.keys(groupedSongs).sort();

  sortedGroups.forEach((group) => {
    const groupHeader = document.createElement("li");
    groupHeader.className = "group-header";
    groupHeader.textContent = group;
    songList.appendChild(groupHeader);

    groupedSongs[group].forEach((song) => {
      const songItem = document.createElement("li");
      songItem.className = "song-item";

      const songText = document.createElement("div");
      songText.className = "song-info";
      songText.innerHTML = `
        <span class="song-title">${song.title}</span> - 
        <span class="song-artist">${song.artist}</span> 
        (<span class="song-genre">${song.genre}</span>)
      `;

      const actionDiv = document.createElement("div");
      actionDiv.className = "song-actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.className = "edit-song";
      editBtn.onclick = () => {
        const title = prompt("New title:", song.title);
        const artist = prompt("New artist:", song.artist);
        const genre = prompt("New genre:", song.genre);

        if (!title && !artist && !genre) return;

        fetch(`/songs/${encodeURIComponent(song.title)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, artist, genre }),
        })
          .then((r) => r.json())
          .then(() => fetchAndDisplaySongs())
          .catch(console.error);
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.className = "delete-song";
      delBtn.onclick = () => {
        if (confirm(`Delete song "${song.title}"?`)) {
          fetch(`/songs/${encodeURIComponent(song.title)}`, {
            method: "DELETE",
          })
            .then((r) => {
              if (r.ok) fetchAndDisplaySongs();
            })
            .catch(console.error);
        }
      };

      const playlistSelect = document.createElement("select");
      playlistSelect.setAttribute("data-playlist-select", "true");
      const placeholderOpt = document.createElement("option");
      placeholderOpt.textContent = "-- Add to playlist --";
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
      addBtn.onclick = () => {
        const selected = playlistSelect.value;
        if (!selected) return alert("Please select a playlist");

        fetch(`/playlists/${encodeURIComponent(selected)}/songs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(song),
        })
          .then((r) => {
            if (!r.ok) throw new Error("Failed to add song to playlist");
            return r.json();
          })
          .then((updatedPlaylist) => {
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

      actionDiv.appendChild(editBtn);
      actionDiv.appendChild(delBtn);
      actionDiv.appendChild(playlistSelect);
      actionDiv.appendChild(addBtn);

      songItem.appendChild(songText);
      songItem.appendChild(actionDiv);
      songList.appendChild(songItem);
    });
  });
}

document.getElementById("song-list").innerHTML = "";

function refreshAllPlaylistDropdowns() {
  const playlistSelects = document.querySelectorAll(
    'select[data-playlist-select="true"]'
  );

  fetch("/playlists")
    .then((r) => r.json())
    .then((playlists) => {
      playlistSelects.forEach((select) => {
        const currentValue = select.value;

        while (select.options.length > 1) {
          select.remove(1);
        }

        playlists.forEach((playlist) => {
          const option = document.createElement("option");
          option.value = playlist.name;
          option.textContent = playlist.name;

          if (currentValue === playlist.name) {
            option.selected = true;
          }

          select.appendChild(option);
        });
      });
    })
    .catch((error) => {
      console.error("Error refreshing playlist dropdowns:", error);
    });
}
