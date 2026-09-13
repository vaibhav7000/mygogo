import { google } from "googleapis";
import { getAuthCredentials, setAuthCredentials } from "../../utils/authstore.js";

const oAuth2Client = new google.auth.OAuth2();

export async function getUserInfo() {
    try {
        const credentials = getAuthCredentials();

        if(!credentials) {
            console.log('You does not provide mygogo access to your credentials');
            return;
        }

        oAuth2Client.on('tokens', (newToken) => {
            const newCredentials = {
                ...credentials,
                ...newToken,
                refresh_token: newToken.refresh_token || credentials.refresh_token
            }

            setAuthCredentials(newCredentials);
        })

        oAuth2Client.setCredentials(credentials);

        // const { token, res } = await oAuth2Client.getAccessToken(); -> no need to send request for getting the valid access_token userClient will handle this, but have to update the stored credentials will happen using .on("token");

        const userClient = google.oauth2({
            version: 'v2',
            auth: oAuth2Client
        });

        const {data} = await userClient.userinfo.get(); // this will make the request with the valid access_token, internally it checks if token is not valid, then gets the valid access_token and make request with that, 

        return data;
    } catch (error) {
        console.log(error);
    }
}




