import { AUTHENTRY } from "./constants.js";


let credentials = undefined;
let shouldRefreshCredentials = true;

export function getAuthCredentials() {

    if(!shouldRefreshCredentials) {
        return credentials;
    }

    try {
        credentials = AUTHENTRY.getPassword();
        shouldRefreshCredentials = false;

        if(credentials) {
            return JSON.parse(credentials);
        }

        return credentials;
    } catch (error) {
        throw "Not able to get the credentials"
    }
}

export function setAuthCredentials(data) {
    try {
        AUTHENTRY.setPassword(JSON.stringify(data));
        shouldRefreshCredentials = true;
    } catch (error) {
        console.log(error);
        throw "not able to set the data in the OS level utility"
    }
}