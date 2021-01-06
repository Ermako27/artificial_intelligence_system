const fs = require('fs');
const {leaves} = require('../lab1/audioTree.json');

function search(paramsDiapasons, products) {
    const matches = [];

    for (let product of products) {
        const {params} = product;
        const matchesCount = 0;
        for (let param of params) {
            switch (param) {
                case 'max_power':
                case 'max_frequency':
                case 'min_frequency':
                case 'body_height':
                    if (params[param] >= paramsDiapasons[param][0] && params[param] <= paramsDiapasons[param][1]) {
                        matchesCount += 1;
                    }
                case 'wireless':
                case 'acoustic_design':
                    if (params[param] === paramsDiapasons[param]) {
                        matchesCount += 1;
                    }
            }
        }
        matches.push({product, matchesCount});
    }
}
