const teaDataLayer = require('../dal/tea');

async function updateTeaQuantity(teaId,purchaseQuantity){
    const tea = await teaDataLayer.getTeaById(teaId);
    const teaQuantity = tea.get('quantity')
    if(teaQuantity>=purchaseQuantity){
        let updatedTeaQuantity = teaQuantity - purchaseQuantity;
        teaDataLayer.setTeaQuantity(teaId,updatedTeaQuantity)
    } else {
        return false
    }
}

module.exports = {
    updateTeaQuantity
};