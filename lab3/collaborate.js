const {usersMatrix} = require('./data/usersMatrix.json');
const tree = require('../../lab1/audioTree.json');

const targetUser = usersMatrix[0];
const {leaves} = tree;
const leavesCount = leaves.length;

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
 * массив объектов пользователей, с посчитанными корреляциями
 */
function calculateUserCorrelation(targetUser, users) {

    // массив объектов пользователей, с посчитанными корреляциями
    const usersWithCorrelation = []

    // фильтруем текущего пользователя, для которого будет считаться корреляция со всеми остальными
    const usersForCorrelation = users.filter((user) => user.name !== targetUser.name);

    for (let user of usersForCorrelation) {
        user.correlation = correlation(targetUser.marks, user.marks);
        usersWithCorrelation.push(user);
    }

    return usersWithCorrelation;
}

// достаем countOfUsers самых коррелирущих пользователей, сортировка по убыванию
function selectClosestUsers(countOfUsers, usersWithCorrelation) {
    const sortedUsers = usersWithCorrelation.sort((user1, user2) => user2.correlation - user1.correlation);
    return sortedUsers.slice(0, countOfUsers + 1);
}

function calculateRecomendations(targetUser, usersMatrix, recomendationsCount) {
    const usersWithCorrelation = calculateUserCorrelation(targetUser, usersMatrix);
    const mostCorrelatedUsers = selectClosestUsers(10, usersWithCorrelation);

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

    /**
     * Для каждого из продуктов считает сумму калиброванных оценок наиболее близких пользователей
     * полученную сумму делим на сумму корреляций выбранных пользователей.
     */
    const productCorrelations = [];
    for (let i = 0; i < leavesCount; i++) {
        const productCorrelation = {productId: i, correlation: 0};
        for (let user of mostCorrelatedUsers) {
            productCorrelation.correlation += user.calibratedMarks[i];
        }
        productCorrelation.correlation /= correlationValuesSum;
        productCorrelations.push(productCorrelations)
    }

    /**
     * @TODO 
     * 1) из productCorrelations фильтрануть по id все продукты, у которых у targetUser оценка !== 0 (зачем показывать, то что он уже оценил)
     * 2) оставшиеся продукты в productCorrelations отсортировать по productCorrelations.correlation
     * 3) вернуть recomendationsCount продуктов из productCorrelations
     */




}

const usersWithCorrelation = calculateUserCorrelation(targetUser, usersMatrix);
const mostCorrelatedUsers = selectClosestUsers(3, usersWithCorrelation);

console.log(mostCorrelatedUsers);