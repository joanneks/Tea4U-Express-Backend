const { PlaceOfOrigin } = require('../models');

async function getAllPlaceOfOrigins () {
    const placeOfOrigins = await PlaceOfOrigin.collection().fetch({});
    return placeOfOrigins;
}

async function getPlaceOfOriginById (placeOfOriginId) {
    const placeOfOrigin = await PlaceOfOrigin.where({id:placeOfOriginId}).fetch({
        require:true
    })
    return placeOfOrigin;
}

module.exports = {getAllPlaceOfOrigins, getPlaceOfOriginById};