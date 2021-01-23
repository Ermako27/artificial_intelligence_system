const fs = require('fs');
const {leaves} = require('../../lab1/audioTree.json');

function entity(name) {
    return {
        "value": name,
        "synonyms": [
            name
        ]
    }
}

function createJson() {
    const entities = [];
    for (let leaf of leaves) {
        entities.push(entity(leaf.name));
    }

    fs.writeFileSync('./entities.json', JSON.stringify({entities}));
}

createJson();