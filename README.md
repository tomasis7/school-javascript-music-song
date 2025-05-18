# Music Playlist Manager

## Overview

The Music Playlist Manager is a JavaScript-based web application that enables users to create, manage, and view playlists. The playlists are categorized by genre, artist, and song title, providing a user-friendly way to explore and organize music collections.

## Features

- Create and manage playlists with custom names
- View playlists with song counts and total duration
- Filter and sort playlists by name or date created
- Add songs with title, artist, and genre information
- View songs grouped by genre, artist, or title alphabetically
- Edit and delete songs and playlists
- Add songs to specific playlists
- Responsive and user-friendly UI

## Project Structure

```
music-playlist-manager
├── src
│   ├── index.js        # Express server and API endpoints
│   ├── playlists.js    # Functions to manage playlists
│   ├── genres.js       # Functions to manage music genres
│   ├── artists.js      # Functions to manage artists
│   └── songs.js        # Functions to manage songs
├── public
│   ├── index.html      # Main HTML interface
│   ├── app.js          # Frontend JavaScript
│   ├── styles.css      # CSS styles
│   ├── songs.json      # JSON storage for songs
│   └── playlists.json  # JSON storage for playlists
├── .gitignore          # Files and directories to ignore by Git
├── package.json        # npm configuration file
├── README.md           # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/tomasis7/school-javascript-music-song.git
   ```
2. Navigate to the project directory:
   ```
   cd school-javascript-music-song-1
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application with:
   ```
   npm run serve
   ```
2. Open your browser and go to `http://localhost:3000` to access the application.

## Application Features

### Playlist Management

- Create new playlists with custom names
- View all playlists with song counts and duration information
- Filter playlists using the search box
- Sort playlists by name or date created
- Edit playlist names with the edit button
- Delete playlists with the delete button

### Song Management

- Add songs by providing title, artist, and genre
- View all available songs in the library
- Group songs by genre, artist, or title alphabetically
- Edit song details (title, artist, genre)
- Delete songs from the library
- Add existing songs to playlists

### Playlist View

- Click on a playlist to view its contents
- Songs in playlists are automatically grouped based on the selected grouping
- Use the dropdown to switch between grouping by genre, artist, or title

### Switching Branches

To switch to another branch:

```
git checkout branch-name
```

### Merging Branches

To merge a branch (e.g., `feature/your-feature-name`) into `main`:

1. Switch to the branch you want to merge into (e.g., `main`):
   ```
   git checkout main
   ```
2. Merge your feature branch:
   ```
   git merge feature/your-feature-name
   ```

### Handling Merge Conflicts

If there are conflicts during a merge, Git will show an error and mark the conflicts in the files. To resolve:

1. Open the conflicted files. Git marks conflicts like this:
   ```
   <<<<<<< HEAD
   Your code
   =======
   Code from the other branch
   >>>>>>> feature/your-feature-name
   ```
2. Edit the file to keep the correct code (or combine as needed).
3. Save the file and mark the conflict as resolved:
   ```
   git add filename
   ```
4. Complete the merge:
   ```
   git commit
   ```

> Tip: Use a visual tool like VS Code to easily view and resolve conflicts.

## Development Guide

### Creating a Feature Branch

For each new feature, create a dedicated branch:

```
git checkout -b feature/feature-name
```

### Implementing Features

1. Make your changes in the feature branch
2. Test your changes thoroughly
3. Commit your changes with a descriptive message:
   ```
   git commit -m "Add feature: detailed description"
   ```
4. Push your changes to the remote repository:
   ```
   git push origin feature/feature-name
   ```

### Merge Process

After feature completion, merge it back to the main branch:

```
git checkout main
git merge feature/feature-name
git push origin main
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
