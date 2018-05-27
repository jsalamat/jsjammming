const redirectUri = "http://localhost:3000/";
const clientID ;

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    //method to retrieve the access token and expiration time from the URL.
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expirationTimeMatch = window.location.href.match(/expires_in=([^&]*)/);
    //If the access token is not already set, check the URL to see if it has just been obtained
    if(accessTokenMatch && expirationTimeMatch) {
      //Set the access token value
      accessToken = accessTokenMatch[1];
      //Set a variable for expiration time
      let expirationTimeToken = expirationTimeMatch[1];
      //Set the access token to expire at the value for expiration time
      window.setTimeout(() => accessToken = '', expirationTimeToken * 1000);
      //Clear the parameters from the URL, so the app doesn't try grabbing the access token after it has expired
      window.history.pushState('Access Token', null, '/');
    } else {
      const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      window.location = spotifyUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    const variableUrl= `https://api.spotify.com/v1/search?type=track&q=${term}`
    //The second argument is an object with one field called headers.
    //Set headers to an object with one Authorization property with the user's access token.
    //Use the format in step four of the implicit grant flow.
    return fetch(variableUrl, {
        headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      } else {
        return [];
      }
    });
  },

  savePlaylist(playlist, trackUri) {
    if(!playlist && !trackUri) {
      return
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch('https://api.spotify.com/v1/me', {
      headers: headers
    }).then(response => response.json()

    ).then(jsonResponse => {
      userId = jsonResponse.id
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlist})

      }).then(jsonResponse => {
        const playlistId = jsonResponse.id
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({tracks: trackUri})
        });
      });
    })
  }
};


export default Spotify;
