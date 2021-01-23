const {leaves} = require('../lab1/audioTree.json');

const paramsMap = {
    'max_power': 'максимальная мощность',
    'max_frequency': 'максимальная частота',
    'min_frequency': 'минимальная частота',
    'body_height': 'высота корпуса',
    'wireless': 'беспроводные',
    'acoustic_design': 'акустическое оформление'
};

function processQuery(intent, model) {
    switch (intent) {
        case 'get_all_params':
            return buildAllParamsResponse(model)
    }
}

function getModelByName(name) {
    return leaves.filter((leaf) => leaf.name === name)[0]
}

function buildAllParamsResponse(modelName) {
    const { params } = getModelByName(modelName);

    let response = `Все параметры модели: ${modelName}: \n`;
    for (let param in params) {
        if (param === 'wireless') {
            response += `${paramsMap[param]}: ${params[param] ? 'да' : 'нет'} \n`;
        } else {
            response += `${paramsMap[param]}: ${params[param]} \n`;
        }
    }

    return response
}

module.exports = {
    processQuery
}