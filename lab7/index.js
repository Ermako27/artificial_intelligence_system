const express = require('express');
const {createDialogClient, detectIntent} = require('./dialog');
const {processQuery} = require('./queryProcessor');

const {client, path} = createDialogClient()

async function handleRequest(req, res) {
    const { query } = req.body;

    // разбираем ввод пользователя
    const intention = await detectIntent(query, client, path);

    const response = processQuery(intention[0]);

    res.status(200).json(response);
    
}

const app = express();

app.use(express.json());

app.post('/', handleRequest);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
