const { Brand } = require('../models');

async function getAllBrands () {
    const brands = await Brand.collection().fetch({});
    return brands;
}

async function getBrandById (brandId) {
    const brand = await Brand.where({id:brandId}).fetch({
        require:true
    })
    return brand;
}

module.exports = {getAllBrands, getBrandById};