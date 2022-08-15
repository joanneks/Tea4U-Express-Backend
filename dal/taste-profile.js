const { TasteProfile } = require('../models');

async function getAllTasteProfiles () {
    const tasteProfiles = await TasteProfile.collection().fetch({});
    return tasteProfiles;
}

async function getTasteProfileById (tasteProfileId) {
    const tasteProfile = await TasteProfile.where({id:tasteProfileId}).fetch({
        require:true
    })
    return tasteProfile;
}

module.exports = {getAllTasteProfiles, getTasteProfileById};