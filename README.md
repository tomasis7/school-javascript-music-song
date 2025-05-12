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

## Contributing

Contributions are welcome! Please create a new branch for your feature or bug fix:

```
git checkout -b feature/your-feature-name
```

After making your changes, commit them and push to the branch:

```
git commit -m "Add your message"
git push origin feature/your-feature-name
```

Then create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
