const fs = require('fs');

const fileName = 'data.txt';

const splittedData = fs.readFileSync(fileName, "utf8").split('\n').slice(1,-1);

function Node(name, parent = null) {
    this.name = name;
    this.children = [];
    this.parent = parent;
}

/**
 * 
 * @param {Array} data - массив строк из файла data.txt без первой и последней строки
 */
function createTree(data) {
    const nodes = {}
    let rootNodeName = null;
    let caseName;

    for (el of data) {

        if (el.includes('"')) {
            const splittedEl = el.split('"').slice(0,4);
            caseName = splittedEl[0].trim(); // удаляем пробел
        }

        if (rootNodeName === null) {
            rootNodeName = splittedEl[1]
        }

        switch (splittedEl[0]) {
            case 'node':
                const nodeName = splittedEl[1];
                nodes[nodeName] = new Node(nodeName);
                break
            case 'edge':
                const parentNodeName = splittedEl[1];

                
                const childNodeName = splittedEl[2] === ' ' ? splittedEl[3] : splittedEl[2];

                console.log(splittedEl)

                const parentNode = nodes[parentNodeName];
                const childNode = nodes[childNodeName];

                parentNode.children.push(childNode);
                childNode.parent = parentNode;
        }
    }

    return nodes[rootNodeName];
}

console.log(createTree(splittedData));

// function Tree() {
//     this.nodeMap = {};
//     this.root = null;
// }

// Tree.prototype.addNode = function addNode(node, parent) {

//     if (this.root === null) {
//         this.root = node;
//     } else {
//         parent.children.push(node)
//     }
// }

// /**
//  * получение ноды обходом в глубину
//  * @param {*} nodeName  имя искомой ноды
//  * @param {*} node корень поддерева
//  */
// Tree.prototype.getNode = function getNode(nodeName, node) {
//     if (node.children.length === 0) {
//         return null;
//     } else if (node.name === nodeName) {
//         return node
//     }

//     let resultNode;
//     for (childNode of node.children) {
//         resultNode = getNode(nodeName, childNode);

//         if (resultNode !== null) {
//             return resultNode;
//         }
//     }
// }