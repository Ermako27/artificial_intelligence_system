const fs = require('fs');
const {leaves} = require('../lab1/audioTree.json');

const diapason = {
    'max_power': [300, 500],
    'max_frequency': [25000, 28000],
    'min_frequency': [50, 100],
    'body_height': [100, 200],
    'wireless': 1,
    'acoustic_design': 'с фазинвентором'
}

const diapason2 = {
    'acoustic_design': "электростатические",
    'body_height': [1833, 1833],
    'max_frequency': [66722, 66722],
    'max_power': [10829, 10829],
    'min_frequency': [5242, 5242],
    'wireless': 0,
}


function search(paramsDiapasons, products, recommendationsCount) {
    const matches = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const listOfParams = Object.keys(product.params);
        const {params: productParams} = product

        let matchesCount = 0;
        const matchedParams = [];

        for (let param of listOfParams) {
            switch (param) {
                case 'max_power':
                case 'max_frequency':
                case 'min_frequency':
                case 'body_height':
                    if (productParams[param] >= paramsDiapasons[param][0] && productParams[param] <= paramsDiapasons[param][1]) {
                        matchesCount += 1;
                        matchedParams.push(param);
                    }
                case 'wireless':
                case 'acoustic_design':
                    if (productParams[param] === paramsDiapasons[param]) {
                        matchesCount += 1;
                        matchedParams.push(param);
                    }
            }
        }
        matches.push({productId: i, product, matchesCount, matchedParams});
    }

    const recommendations = matches
    .sort((prod1, prod2) => prod2.matchesCount - prod1.matchesCount)
    .slice(0, recommendationsCount)

    fs.writeFileSync('./debug/search.json', JSON.stringify({matches, recommendations}));

    return recommendations

}

recommendations = search(diapason, leaves, 10);

console.log('Рекомендации по заданным параметрам')
for (let recommendation of recommendations) {
    console.log(`Product id: ${recommendation.productId} | Product name: ${recommendation.product.name} | Matches count ${recommendation.matchesCount}\n`);
    console.dir(recommendation.product.params);
    console.log('\n ------------------------------------------ \n');
}
