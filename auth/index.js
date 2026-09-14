import http from "http";
import express from "express";
import { google } from "googleapis";
import open, { apps } from "open";

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, PORT, SCOPES } from "../utils/constants.js";
import { deleteAuthCredentials, getAuthCredentials, setAuthCredentials } from "../utils/authstore.js";

const app = express();

const oAuth2Client = new google.auth.OAuth2({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
})

const authorizationServerUrl = oAuth2Client.generateAuthUrl({
    scope: SCOPES,
    access_type: 'offline', // so that we can get the refresh_token
    prompt: 'consent',
})

app.get('/callback', async (req, res) => {
    try {
        const {code} = req.query;

        if(!code) {
            res.status(400).json({
                valid: false,
                message: 'BAD REQUEST <require code as query params>',
            })
            return;
        }

        const response = await oAuth2Client.getToken(code);

        const credentials = response.tokens;

        // save that tokens in OS SECURE Credentials managements utility in mac, it is default to keychain-access

        try {
            setAuthCredentials(credentials);
        } catch (error) {
            res.status(500).json({
                valid: false,
                message: 'Not able to store the credentials in OS',
            })
            return            
        }

        res.status(201).json({
            valid: true,
            message: "Credentials Saved Successfully on the OS Level Credentials Management Service, Close the browser window and use the application",
        });

        console.log("Successfully Signed up");

    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Internal Server error',
        })

        throw error;
    } finally {
        server.close();
    }
})

const server = http.createServer(app);

export function startAuthorizationProcess() {
    server.listen(PORT, () => {
        // currently opening brave browser, should be the default one
        const browserChildProcess = open(authorizationServerUrl, {
            app: {
                name: apps.brave
            }
        })
    })
}

export async function startSignOutProcess() {
    const credentials = getAuthCredentials();

    if(!credentials) {
        console.log('You are currently not signed in the application');
        return;
    }

    oAuth2Client.setCredentials(credentials);

    try {
        const result = await oAuth2Client.revokeCredentials();        
        console.log(result);

        const response = deleteAuthCredentials();

        console.log('everthing revoked');
    } catch (error) {
        console.log(error);
    }
}
