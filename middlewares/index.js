
const checkIfAuthenticated = function (req,res,next) {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'Only logged in users may view this page');
        res.redirect('/user/login')
    } else {
        next();
    }
} 

module.exports = {checkIfAuthenticated};