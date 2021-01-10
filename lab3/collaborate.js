/**
 * https://habr.com/ru/post/150399/
 * https://vas3k.ru/blog/355/1
 * https://habr.com/ru/company/surfingbird/blog/139518/
 */

const fs = require('fs');
const {usersMatrix} = require('./data/usersMatrix.json');
const tree = require('../lab1/audioTree.json');

// для кого считаем рекомендации
const targetUser = usersMatrix[0];

// количество листьев (продуктов)
const {leaves} = tree;
const leavesCount = leaves.length;

// количество пользователей для рекомендаций
const MOST_CORRELATED_USERS_COUNT = 10;

// количество рекомендаций
const RECOMMENDATIONS_COUNT = 10;

/**
 * http://statistica.ru/theory/koeffitsient-korrelyatsii/
 * считаем коэффициент корреляции пирсона
 */
function correlation(vec1, vec2) {
    let numerator = 0;
    let denomPart1 = 0;
    let denomPart2 = 0;
    const vecLen = vec1.length;
    
    const avg1 = vec1.reduce((acc, el) => acc + el, 0) / vecLen;
    const avg2 = vec2.reduce((acc, el) => acc + el, 0) / vecLen;

    for (let i = 0; i < vecLen; i++) {
        numerator += (vec1[i] - avg1) * (vec2[i] - avg2);
        denomPart1 += Math.pow(vec1[i] - avg1, 2);
        denomPart2 += Math.pow(vec2[i] - avg2, 2);
    }

    const denominator = Math.sqrt(denomPart1 * denomPart2);

    return numerator / denominator;
}

/**
 * считаем корреляцию между текущим пользователем и всеми остальными пользователями
 * @param {*} targetUser - пользователь для которого считаются рекомендации
 * @param {*} users - массив пользователей
 * @return массив объектов пользователей с полем correlation - int посчитанная корреляция
 */
function calculateUserCorrelation(targetUser, users) {

    // массив объектов пользователей, с посчитанными корреляциями
    const usersWithCorrelation = []

    // убираем текущего пользователя, для которого будет считаться корреляция со всеми остальными
    const usersForCorrelation = users.filter((user) => user.name !== targetUser.name);

    // считаем корреляцию для каждого юзера
    for (let user of usersForCorrelation) {
        user.correlation = correlation(targetUser.marks, user.marks);
        usersWithCorrelation.push(user);
    }

    fs.writeFileSync('./debug/calculateUserCorrelation.json', JSON.stringify(usersWithCorrelation));
    return usersWithCorrelation;
}

/**
 * достаем MOST_CORRELATED_USERS_COUNT самых коррелирущих пользователей, сортируем по убыванию по убыванию
 * @param {*} usersWithCorrelation  - массив пользователей с посчитанной корреляцией
 * @return массив наиболее коррелирующих пользователей
 */
function selectClosestUsers(usersWithCorrelation) {
    const sortedUsers = usersWithCorrelation.sort((user1, user2) => user2.correlation - user1.correlation);

    fs.writeFileSync('./debug/selectClosestUsers.json', JSON.stringify({sortedUsers, slice: sortedUsers.slice(0, MOST_CORRELATED_USERS_COUNT)}));
    return sortedUsers.slice(0, MOST_CORRELATED_USERS_COUNT);
}

function calculateRecomendations(targetUser, usersMatrix) {
    const usersWithCorrelation = calculateUserCorrelation(targetUser, usersMatrix);
    const mostCorrelatedUsers = selectClosestUsers(usersWithCorrelation);

    // сумма значений корреляций наиболее коррелирующих пользователей
    const correlationValuesSum = mostCorrelatedUsers.reduce((acc, user) => user.correlation + acc, 0);

    // у каждого пользователя умножаем его оценку каждого продукта на его коэффициент корреляции
    // таким образом оценки более «похожих» пользователей будут сильнее влиять на итоговую позицию продукта
    for (let user of mostCorrelatedUsers) {
        user.calibratedMarks = [];
        for (let i = 0; i < leavesCount; i++) {
            user.calibratedMarks[i] = user.marks[i] * user.correlation;
        }
    }

    fs.writeFileSync('./debug/userСalibratedMarks.json', JSON.stringify({mostCorrelatedUsers}));

    /**
     * Для каждого из продуктов считает сумму калиброванных оценок наиболее близких пользователей
     * полученную сумму делим на сумму корреляций выбранных пользователей.
     */
    const productCorrelations = [];
    for (let i = 0; i < leavesCount; i++) {
        const productCorrelation = {productId: i, calibratedMarksSum: 0};
        for (let user of mostCorrelatedUsers) {
            productCorrelation.calibratedMarksSum += user.calibratedMarks[i];
        }
        productCorrelation.calibratedMarksSum /= correlationValuesSum;
        productCorrelations.push(productCorrelation)
    }

    fs.writeFileSync('./debug/productCorrelations.json', JSON.stringify({productCorrelations}));

    const productsToRecommend = productCorrelations
                                                .filter((prod) => targetUser.marks[prod.productId] === 0)
                                                .sort((prod1, prod2) => prod2.calibratedMarksSum - prod1.calibratedMarksSum)
                                                .slice(0, RECOMMENDATIONS_COUNT);
    
    fs.writeFileSync('./debug/productsToRecommend.json', JSON.stringify({productsToRecommend, targetUser}));
    return {productsToRecommend, mostCorrelatedUsers};
}

const {productsToRecommend, mostCorrelatedUsers} = calculateRecomendations(targetUser, usersMatrix);

console.log('Most correlated users')
for (let user of mostCorrelatedUsers) {
    console.log(`User name: ${user.name}, correlation coef: ${user.correlation.toFixed(5)}`);
}
console.log('\n ------------------------------------------ \n');

console.log('Recomended products');
for (let product of productsToRecommend) {
    console.log(`Product id: ${product.productId} Name: ${leaves[product.productId].name}, correlation coef: ${product.calibratedMarksSum.toFixed(5)}`);
}