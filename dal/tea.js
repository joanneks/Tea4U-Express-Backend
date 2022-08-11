const { Tea, TeaType, Brand} = require('../models');

async function getAllBrands(){
    const brands = await Brand.fetchAll().map(brand => {
        return [brand.get('id'),brand.get('name')];
    });
    return brands;
};

async function getAllTeaTypes(){
    const teaTypes = await TeaType.fetchAll().map(teaType => {
        return [teaType.get('id'),teaType.get('name')];
    });
    return teaTypes;
};


async function getAllTea(){
    return await Tea.collection.fetchAll({
        withRelated:'teaType'
    })
}

module.exports = {getAllTeaTypes, getAllTea, getAllBrands}