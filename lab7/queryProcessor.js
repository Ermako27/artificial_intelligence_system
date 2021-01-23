const {leaves} = require('../lab1/audioTree.json');

const paramsMap = {
    'max_power': 'максимальная мощность',
    'max_frequency': 'максимальная частота',
    'min_frequency': 'минимальная частота',
    'body_height': 'высота корпуса',
    'wireless': 'беспроводные',
    'acoustic_design': 'акустическое оформление'
};

const reverseParamMap = {
    'максимальная мощность': 'max_power',
    'максимальная частота': 'max_frequency',
    'минимальная частота': 'min_frequency',
    'высота корпуса': 'body_height',
    'беспроводные': 'wireless',
    'акустическое оформление': 'acoustic_design'
}

function processQuery(intention) {

    const { queryResult: { intent: { displayName: userIntent } } } = intention;

    let response;

    if (userIntent === 'get_all_params') {
        const { queryResult: {
                    parameters: {
                        fields: {
                            model: { 
                                stringValue: modelName
                            } 
                        } 
                    } 
                } 
            } =  intention;
        response = buildAllParamsResponse(modelName);
    } else if (userIntent === 'get_certain_param') {
        const { queryResult: {
                    parameters: {
                        fields: {
                            model: { 
                                stringValue: modelName 
                            },
                            param: {
                                stringValue: param 
                            }
                        }
                    } 
                } 
            } = intention;
        response = buildCertainParamResponse(modelName, param);
    }

    return response
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

/**
 * 
 * @param {*} modelName название модели
 * @param {*} param рукописный параметр, который ввел пользователь, напирмер "акустическое оформление"
 */
function buildCertainParamResponse(modelName, param) {
    const { params } = getModelByName(modelName);

    const paramKey = reverseParamMap[param];

    return paramKey === 'wireless' ?
            `Модель ${modelName}, ${param}: ${params[paramKey] ? 'да' : 'нет'}` :
            `Модель ${modelName}, ${param}: ${params[paramKey]}`;
}

module.exports = {
    processQuery
}