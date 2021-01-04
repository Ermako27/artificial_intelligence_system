const tree = require('../lab1/audioTree.json')
/**
 *       "_gvid": 70,
      "name": "Chora 816",

            "_gvid": 92,
      "name": "805",
 */

const {nodes} = tree;

const node1 = nodes[70];
const node2 = nodes[92];

// console.log(node1, node2);

const audioDesignMap = {
    "боковой басовый динамик": 1,
    "закрытый корпус": 2,
    "с фазинвентором": 3,
    "электростатические": 4,
    "с динамиком рупорного типа": 5,
    "с активным басом": 6,
    "модульная конструкция": 7,
    "открытый": 8
}

function euclideanDistance(node1, node2) {
    const a1 = Math.pow(node1.params['max_power'] - node2.params['max_power'], 2);
    const a2 = Math.pow(node1.params['max_frequency'] - node2.params['max_frequency'], 2);
    const a3 = Math.pow(node1.params['min_frequency'] - node2.params['min_frequency'], 2);
    const a4 = Math.pow(node1.params['body_height'] - node2.params['body_height'], 2);
    const a5 = Math.pow(node1.params['wireless'] - node2.params['wireless'], 2);
    const a6 = Math.pow(
        audioDesignMap[node1.params['acoustic_design']] - audioDesignMap[node2.params['acoustic_design']],
        2
    );

    return Math.sqrt(a1 + a2 + a3 + a4 + a5 + a6);
}

function manhattanDistance(node1, node2) {
    const a1 = Math.abs(node1.params['max_power'] - node2.params['max_power']);
    const a2 = Math.abs(node1.params['max_frequency'] - node2.params['max_frequency']);
    const a3 = Math.abs(node1.params['min_frequency'] - node2.params['min_frequency']);
    const a4 = Math.abs(node1.params['body_height'] - node2.params['body_height']);
    const a5 = Math.abs(node1.params['wireless'] - node2.params['wireless']);
    const a6 = Math.abs(
        audioDesignMap[node1.params['acoustic_design']] - audioDesignMap[node2.params['acoustic_design']]
    );

    return (a1 + a2 + a3 + a4 + a5 + a6);
}

function treeDistance(tree, node1, node2) {
    let currentNode1 = node1;
    let currentNode2 = node2;

    let path1Len = 0;
    let path2Len = 0;

    /**
     * пока не найдем общего родителя
     * если передали одну и ту же ноду, то не зайдем в цикл
     */
    while (currentNode1.id !== currentNode2.id) {
        path1Len++;
        path2Len++;

        currentNode1 = tree[currentNode1.parent];
        currentNode2 = tree[currentNode2.parent];
    }

    return path1Len + path2Len;
}

/**
 * http://statistica.ru/theory/koeffitsient-korrelyatsii/
 */
function correlation(node1, node2) {
    let numerator = 0;
    let denomPart1 = 0;
    let denomPart2 = 0;

    const avg1 = (
        node1.params['max_power'] +
        node1.params['max_frequency'] +
        node1.params['min_frequency'] +
        node1.params['body_height'] +
        node1.params['wireless'] +
        audioDesignMap[node1.params['acoustic_design']]
    ) / 6;

    const avg2 = (
        node2.params['max_power'] +
        node2.params['max_frequency'] +
        node2.params['min_frequency'] +
        node2.params['body_height'] +
        node2.params['wireless'] +
        audioDesignMap[node2.params['acoustic_design']]
    ) / 6;

    const params = Object.keys(node1.params);

    for (let param of params) {
        if (param === 'acoustic_design') {
            numerator += (audioDesignMap[node1.params[param]] - avg1) * (audioDesignMap[node2.params[param]] - avg2);
            denomPart1 += Math.pow(audioDesignMap[node1.params[param]] - avg1, 2);
            denomPart2 += Math.pow(audioDesignMap[node2.params[param]] - avg2, 2);
    
        } else {
            numerator += (node1.params[param] - avg1) * (node2.params[param] - avg2);
            denomPart1 += Math.pow(node1.params[param] - avg1, 2);
            denomPart2 += Math.pow(node2.params[param] - avg2, 2);
        }        
    }

    const denominator = Math.sqrt(denomPart1 * denomPart2);

    return numerator / denominator;
}

console.log('Лист дерева 1:', node1, '\n');
console.log('Лист дерева 2:', node2,)
console.log('-----------------------------------')


console.log('Евклидово растояние: ',euclideanDistance(node1, node2));
console.log('Манхетанское растояние: ',manhattanDistance(node1, node2));
console.log('Расстояние по дереву: ',treeDistance(nodes, node1, node2));
console.log('Корреляция: ',correlation(node1, node2));