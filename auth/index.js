import http from "http";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import open, { apps } from "open";

import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, PORT, SCOPES } from "../utils/constants.js";
import { setAuthCredentials } from "../utils/authstore.js";

const app = express();

const oAuth2Client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
});

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
            message: "Credentials Saved Successfully on the OS Level Credentials Management Service",
        })

    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Internal Server error',
        })
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

startAuthorizationProcess();