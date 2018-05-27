import React, { Component } from 'react';
import './App.css';

import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';

import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state= {
      searchResults: [
        //{name: 'Common', artist: 'Common', album: 'Be', id: 1},
        //{name: 'Nas', artist: 'Nas', album: 'Illmatic', id: 2},
        //{name: 'Drake', artist: 'Drake', album: 'Take Care', id: 3}
      ],
      playlistName: 'New Playlist',
      playlistTracks: [
        //{name: 'Common', artist: 'Common', album: 'Be', id: 1},
        //{name: 'Nas', artist: 'Nas', album: 'Illmatic', id: 2},
        //{name: 'Drake', artist: 'Drake', album: 'Take Care', id: 3}
      ]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
  //  if (this.state.playlistTracks.some(savedTrack => savedTrack.id === track.id)) {
        // it isn't already in playlistTracks
        // you make a variable that equals playlistTracks,
        let tracks = this.state.playlistTracks;
        // push that
        tracks.push(track);
        // then set the new state of playlistTracks to that;
        this.setState({playlistTracks: tracks});
  //  }
  }

  removeTrack(track) {
    //Accepts a track argument
    let tracks = this.state.playlistTracks;
    //Uses the track's id property to filter it out of playlistTracks
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    //Sets the new state of the playlist
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    //Accepts a name argument
    this.setState({playlistName: name});
    //Sets the state of the playlist name to the input argument
  }

  savePlaylist() {
    //Generates an array of uri values called trackURIs from the playlistTracks property
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    //In a later step, you will pass the trackURIs array
    //and playlistName to a method that will save the user's playlist to their account.
    //savePlaylist() method to call Spotify.savePlaylist()
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      //reset the state of playlistName to 'New Playlist' and playlistTracks to an empty array.
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    //Accepts a search term
    console.log(term)
    //Logs the term to the console
    //In a later assessment we will hook this method up to the Spotify API
    Spotify.search(term).then(searchResults => {
      // update the .search() method with the Spotify.search() method
      // Update the state of searchResults with the value resolved from Spotify.search()'s promise.
      this.setState({searchResults : searchResults});
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
