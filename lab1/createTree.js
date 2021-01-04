const fs = require('fs');
const audioData = require('./audio.json'); // файл сгенеренный командой из https://graphviz.org/doc/info/output.html, в которой ручками были добавлены randomIntervals на узлы 3 уровня, чтобы сгенерировать данные на все листья
const { getRandomInt } = require('../utils/randomInt');

function Node({name, params = null, randomIntervals = null, id}) {
    this.id = id;
    this.name = name;
    this.parent = null;
    this.children = [];
    this.params = params;
    this.randomIntervals = randomIntervals;
}

function createNodes(objects) {
    const nodes = []
    for (let elem of objects) {
        const {name, params = null, randomIntervals = null, _gvid} = elem;
        const node = new Node({name, params, randomIntervals, id: _gvid});
        nodes.push(node)
    }

    return nodes;
}

// рандомим параметры
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

function createJsonTree(data) {
    const {objects, edges} = data;

    const nodes = createNodes(objects);

    for (let edge of edges) {

        const {tail, head} = edge;
        const parentNode = nodes[tail];
        const childNode = nodes[head];

        if (parentNode.randomIntervals) {
            const {randomIntervals} = parentNode;
            const params = createParams(randomIntervals);
            childNode.params = params;
            parentNode.params = null;
            childNode.randomIntervals = randomIntervals
        }

        parentNode.children.push(childNode.id);
        childNode.parent = parentNode.id;
    }

    const leaves = nodes.filter((node) => node.children.length === 0);

    return {nodes, leaves};
}

const tree = createJsonTree(audioData);

fs.writeFileSync('./audioTree.json', JSON.stringify(tree));
