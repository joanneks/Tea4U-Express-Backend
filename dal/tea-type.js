const { TeaType } = require('../models');

async function getAllTeaTypes () {
    const teaTypes = await TeaType.collection().fetch({});
    return teaTypes;
}
async function getTeaTypeById (teaTypeId) {
    const teaType = await TeaType.where({id:teaTypeId}).fetch({
        require:true
    })
    return teaType;
}

module.exports = {getAllTeaTypes, getTeaTypeById};