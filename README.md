# Music Playlist App

## Overview

The Music Playlist App is a JavaScript-based application designed to manage music playlists. Users can create, list, and manage playlists categorized by genre, artist, and songs. This application provides a simple and intuitive user interface for music enthusiasts to organize their favorite tracks.

## Features

- Create and manage playlists
- Categorize music by genre and artist
- Add, list, and delete songs
- Responsive and user-friendly UI

## Project Structure

```
music-playlist-app
├── src
│   ├── index.js        # Entry point of the application
│   ├── playlists.js    # Functions to manage playlists
│   ├── genres.js       # Functions to manage music genres
│   ├── artists.js      # Functions to manage artists
│   └── songs.js        # Functions to manage songs
├── public
│   ├── index.html      # Main HTML file for the application
│   └── styles.css      # Styles for the application
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
   cd music-playlist-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application with Vite:
   ```
   npm run dev
   ```
2. Open your browser and go to the local address shown in the terminal (usually `http://localhost:5173`) to access the application.

## Git Workflow

### Commit

After making your changes, commit them and push to the branch:

```
git commit -m "Add your message"
git push origin feature/your-feature-name
```

### Creating a New Branch

To create a new branch, use:

```
git checkout -b branch-name
```

Example for a feature branch:

```
git checkout -b feature/your-feature-name
```

### Switching Branches

To switch to another branch:

```
git checkout branch-name
```

### Merging Branches

To merge a branch (e.g., `feature/your-feature-name`) into `development`:

1. Switch to the branch you want to merge into (e.g., `development`):
   ```
   git checkout development
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

See vscodeMerge.jpg in the main folder.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
