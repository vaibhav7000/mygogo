import { Entry } from "@napi-rs/keyring";

export const APPLICATION_NAME = "mygogo"; // serviceName
export const OAUTHCREDENTIALS = "OAUTHCREDENTIALS" // serviceName
export const CLIENT_ID = process.env.CLIENT_ID; // have to replace
export const CLIENT_SECRET = process.env.CLIENT_SECRET; // have to replace this
export const REDIRECT_URI = "http://localhost:8080/callback";
export const PORT = 8080;
export const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar'];


// keyring constants
export const AUTHENTRY = new Entry(APPLICATION_NAME, OAUTHCREDENTIALS);

// accoutName will be linked with different keys and keys will have the corresponding values