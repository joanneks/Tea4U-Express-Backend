const { Tea, TeaType, Brand, Packaging, PlaceOfOrigin} = require('../models');

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

async function getAllPackaging (){
    const packaging = await Packaging.fetchAll().map(packaging => {
        return [packaging.get('id'),packaging.get('name')];
    });
    return packaging;
}

async function getAllPlaceOfOrigin (){
    const placeOfOrigin = await PlaceOfOrigin.fetchAll().map(placeOfOrigin => {
        return [placeOfOrigin.get('id'),placeOfOrigin.get('name')];
    });
    return placeOfOrigin;
}

async function getTeaById(teaId){
    const tea = await Tea.where({id:teaId}).fetch({
        require:true,
        withRelated:['teaType','brand','packaging']
    });
    return tea;
};

async function getAllTea(){
    const tea = await Tea.collection().fetch({
        withRelated:['teaType','brand','packaging','placeOfOrigin']
    });
    return tea;
};

module.exports = {getAllTeaTypes, getAllBrands, getAllPackaging, getAllPlaceOfOrigin, getTeaById, getAllTea}