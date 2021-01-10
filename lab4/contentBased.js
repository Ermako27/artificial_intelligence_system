const fs = require('fs');
const {correlation} = require('../lab2/methods')
const {usersMatrix} = require('../lab3/data/usersMatrix.json');
const tree = require('../lab1/audioTree.json');

// для кого считаем рекомендации
const targetUser = usersMatrix[0];

// количество рекомендаций
const RECOMMENDATIONS_COUNT = 10;

function extractIds(targetUser) {
    const {marks} = targetUser;

    const marksCount = marks.length;

    // id продуктов, которых пользователь оценил на 5
    const mostRatedProdIds = [];
    // id продуктов, у которых оценка 0 - не оценены пользователем
    const notRatedProdIds = []

    // id оценки соответствует id продукта
    for (let i = 0; i < marksCount; i++) {
        if (marks[i] === 0) {
            notRatedProdIds.push(i);
        } else if (marks[i] === 5) {
            mostRatedProdIds.push(i);
        }
    }

    fs.writeFileSync('./debug/extractIds.json', JSON.stringify({targetUser, mostRatedProdIds, notRatedProdIds}));
    return {mostRatedProdIds, notRatedProdIds};
}

/**
 * 
 * @param {*} ratedProductId - id продукта с оценкой 5 
 * @param {*} notRatedProdIds - id продуктов с оценкой 0, то есть не оцененых пользователем
 * @param {*} products - все продукты, то есть все листья в дереве
 */
function recommendationsByOne(ratedProductId, notRatedProdIds, products) {

    const ratedProduct = products[ratedProductId];

    const productsWithCorrelation = [];

    // считаем корреляцию для всех неоцененных продуктов с одним оцененым
    for (let productId of notRatedProdIds) {
        productsWithCorrelation.push({product: products[productId], correlation: correlation(ratedProduct, products[productId])})
    }

    const recommendations = productsWithCorrelation
    .sort((prod1, prod2) => prod2.correlation - prod1.correlation)
    .slice(0, RECOMMENDATIONS_COUNT);
                                            
                                            
    fs.writeFileSync('./debug/recommendationsByOne.json', JSON.stringify({recommendations, ratedProduct}));

    return recommendations;

}

function recommendationsByGroup(mostRatedProdIds, notRatedProdIds, products) {
    const productsWithCorrelation = [];

    // для каждого не оцененного продукта
    for (let notRatedProdId of notRatedProdIds) {
        let correlationSum = 0;
        // считаем среднюю корреляцию со всеми оцененными продуктами
        for (let ratedProdId of mostRatedProdIds) {
            correlationSum += correlation(products[notRatedProdId], products[ratedProdId])
        }

        productsWithCorrelation.push({product: products[notRatedProdId], avgCorrelation: correlationSum / mostRatedProdIds.length});
    }

    const recommendations = productsWithCorrelation
    .sort((prod1, prod2) => prod2.avgCorrelation - prod1.avgCorrelation)
    .slice(0, RECOMMENDATIONS_COUNT);

    fs.writeFileSync('./debug/recommendatiosByGroup.json', JSON.stringify({recommendations}));

    return recommendations;

}

const {mostRatedProdIds, notRatedProdIds} = extractIds(targetUser);
const recommendations1 = recommendationsByOne(mostRatedProdIds[0], notRatedProdIds, tree.leaves);
const recommendations2 = recommendationsByGroup(mostRatedProdIds, notRatedProdIds, tree.leaves);


console.log('1 элемент, уже оцененный пользователем');
console.log(`Product id: ${mostRatedProdIds[0]} | Product name: ${tree.leaves[mostRatedProdIds[0]].name} | User mark ${targetUser.marks[mostRatedProdIds[0]]}`);

console.log(`\n\nСформированные рекомендации по одному, уже оцененному, элементу:`);
for (let {product, correlation} of recommendations1) {
    console.log(`Product id: ${product.id} | Product name: ${product.name} | Correlation сoef ${correlation.toFixed(5)}`);
}

console.log('\n ------------------------------------------ \n');

console.log(`${mostRatedProdIds.length} элементов, уже оцененных пользователем:`)
for (let id of mostRatedProdIds) {
    console.log(`Product id: ${id} | Product name: ${tree.leaves[id].name} | User mark ${targetUser.marks[id]}`);
}

console.log(`\n\nСформированные рекомендации по массиву из ${mostRatedProdIds.length} элементов, уже оцененных пользователем:`);
for (let {product, avgCorrelation} of recommendations2) {
    console.log(`Product id: ${product.id} | Product name: ${product.name} | Correlation сoef ${avgCorrelation.toFixed(5)}`);
}