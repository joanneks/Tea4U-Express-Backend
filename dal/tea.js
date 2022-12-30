const { Tea, TeaType, Brand, Packaging, PlaceOfOrigin, TasteProfile} = require('../models');

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

async function getTeaTypeById (teaTypeId) {
    const teaType = await TeaType.where({id:teaTypeId}).fetch({
        require:true
    })
    return teaType;
}

async function getAllPackaging (){
    const packaging = await Packaging.fetchAll().map(packaging => {
        return [packaging.get('id'),packaging.get('name')];
    });
    return packaging;
}

async function getAllPlaceOfOrigins (){
    const placeOfOrigins = await PlaceOfOrigin.fetchAll().map(placeOfOrigin => {
        return [placeOfOrigin.get('id'),placeOfOrigin.get('name')];
    });
    return placeOfOrigins;
}

async function getAllTasteProfiles (){
    const tasteProfiles = await TasteProfile.fetchAll().map(tasteProfile => {
        return [tasteProfile.get('id'),tasteProfile.get('name')];
    });
    return tasteProfiles;
}

async function getTeaById(teaId){
    const tea = await Tea.where({id:teaId}).fetch({
        require:true,
        withRelated:['teaType','brand','packaging','placeOfOrigin','tasteProfile']
    });
    return tea;
};

async function getAllTea(){
    const tea = await Tea.collection().fetch({
        withRelated:['teaType','brand','packaging','placeOfOrigin','tasteProfile']
    });
    return tea;
};

async function setTeaQuantity(teaId,updatedTeaQuantity){
    const tea = await getTeaById(teaId);
    tea.set('quantity',updatedTeaQuantity);
    await tea.save();
}

module.exports = {getAllTeaTypes, getTeaTypeById, getAllBrands, getAllPackaging, getAllPlaceOfOrigins, getAllTasteProfiles, getTeaById, getAllTea, setTeaQuantity}