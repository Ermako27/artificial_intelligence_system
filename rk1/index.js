const express = require('express');
const {collaborate} = require('../lab3/collaborate')
const {contentBased} = require('../lab4/contentBased'); 
const {recSearch} = require('../lab5/search');

const app = express();

app.use(express.json());

function handleCollaborate(req, res) {
    const {targetUserId} = req.body;

    const {productsToRecommend, mostCorrelatedUsers} = collaborate(targetUserId);

    const userData = [];

    for (let user of mostCorrelatedUsers) {
        userData.push({'name': user.name})
    }

    const response = {
        products: {
            data: productsToRecommend,
            description: 'Recommended products'
        },
        users: {
            data: userData,
            description: 'Most correlated users'
        }
    }

    res.status(200).json(response);
}

function handleContentBased(req, res) {
    const {targetUserId} = req.body;

    const {dataByGroup, dataByOne} = contentBased(targetUserId);

    const recommendationsByOne = {
        data: [],
        description: 'Recommendations by one product'
    }

    for (let elem of dataByOne) {
        recommendationsByOne.data.push({'name': elem.product.name, 'correlation': elem.correlation.toFixed(5)})
    }
//////////////////////////////////
    const recommendationsByGroup = {
        data: [],
        description: 'Recommendations by group of favorite products'
    }

    for (let elem of dataByGroup) {
        recommendationsByGroup.data.push({'name': elem.product.name, 'avgCorrelation': elem.avgCorrelation.toFixed(5)})
    }

    const response = {
        recommendationsByOne,
        recommendationsByGroup
    }
    
    res.status(200).json(response);

}

function handleSearch(req, res) {
    const {diapason, recommendationsCount} = req.body;

    const recommendations = recSearch(diapason, recommendationsCount);
    console.log(recommendations)

    const response = {
        data: recommendations,
        description: 'Result of search'
    };

    res.status(200).json(response);
}

app.post('/collaborate', handleCollaborate);
app.post('/contentBased', handleContentBased);
app.post('/search', handleSearch);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
