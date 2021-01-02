const fs = require('fs');
const audioData = require('./audio.json');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function Node({name, params = null, randomIntervals = null}) {
    this.name = name;
    this.children = [];
    this.params = params;
    this.randomIntervals = randomIntervals;
}

function createNodes(objects) {
    const nodes = []

    for (let elem of objects) {
        const {name, params = null, randomIntervals = null} = elem;
        const node = new Node({name, params, randomIntervals});
        nodes.push(node)
    }

    return nodes;
}

function createParams(randomIntervals) {
    return {
        "max_power": getRandomInt(randomIntervals.max_power[0], randomIntervals.max_power[1]),
        "max_frequency": getRandomInt(randomIntervals.max_frequency[0], randomIntervals.max_frequency[1]),
        "min_frequency": getRandomInt(randomIntervals.min_frequency[0], randomIntervals.min_frequency[1]),
        "body_height": getRandomInt(randomIntervals.body_height[0], randomIntervals.body_height[1]),
        "wireless": getRandomInt(0, 1),
        "acoustic_design": randomIntervals.acoustic_design[getRandomInt(0, randomIntervals.acoustic_design.length - 1)]
    }
}

function createTree(data, withParams = false) {
    const {objects, edges} = data;

    const nodes = createNodes(objects);

    for (let edge of edges) {
        const {tail, head} = edge;
        const parentNode = nodes[tail];
        const childNode = nodes[head];

        if (withParams && parentNode.randomIntervals) {
            const {randomIntervals} = parentNode;
            const params = createParams(randomIntervals);
            childNode.params = params;
            parentNode.params = null;
            childNode.randomIntervals = randomIntervals
        }

        parentNode.children.push(childNode);
    }

    return nodes[0];
}

const tree = createTree(audioData, true);

fs.writeFileSync('./audioTree.json', JSON.stringify(tree));
