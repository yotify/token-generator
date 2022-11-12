import SpotfiyWebApi from "spotify-web-api-node";
import config from 'config';

var spotifyApi = new SpotfiyWebApi({
  clientId: config.get("api.spotify.clientId"),
  clientSecret: config.get("api.spotify.clientSecret"),
  redirectUri: config.get("api.spotify.redirectUri"),
});

export class SpotifyTokenGenerator {
  scopes: string[] = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
  ];
  getAuthUrl(state: string) {
    return spotifyApi.createAuthorizeURL(this.scopes, state);
  }
}
