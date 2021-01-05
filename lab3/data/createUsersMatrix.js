const fs = require('fs');
const tree = require('../../lab1/audioTree.json');
const { getRandomInt } = require('../../utils/randomInt');


const {leaves} = tree;
const leavesCount = leaves.length;

function User(name) {
    this.name = name;
    this.marks = []; // вектор оценок каждого листа (продукта) из дерева, индекс оценки соответствует индексу листа (продукта) из leaves
}
function createUserMatrix() {
    const usersMatrix = [];

    // количество пользователей равно количеству листьев (продуктов) в дереве;
    for (let i = 1; i < leavesCount + 1; i++) {
        const user = new User(`user${i}`);

        // рандомим пользователю массив оценок для каждого листа (продукта) из дерева
        for (let j = 0; j < leavesCount; j++) {
            user.marks.push(getRandomInt(0,5))
        }
        usersMatrix.push(user);
    }

    return {usersMatrix}
}

const matrix = createUserMatrix();

fs.writeFileSync('./usersMatrix.json', JSON.stringify(matrix));