const dialogflow = require('@google-cloud/dialogflow');
const credentials = require("./credentials.json");
const uuid = require('uuid');

const projectId = 'sii-audio-nxin';
const lang = 'ru';

function createDialogClient() {
    const sessionId = uuid.v4();
    const client = new dialogflow.SessionsClient({credentials});
    const path = client.projectAgentSessionPath(projectId, sessionId);
    
    return {client, path};
}

async function detecIntent(query, client, path) {
    try {
        const request = {
            session: path,
            queryInput: {
                text: {
                    text: query,
                    languageCode: lang,
                },
            },
        };
    
        const response = await client.detectIntent(request);
    
        return response;
    } catch (error) {
        console.log(error);
        return {}
    }
}

const {client, path} = createDialogClient();
detecIntent('привет', client, path).then((response) => {console.log(response)})
