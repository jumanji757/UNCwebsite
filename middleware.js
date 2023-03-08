const {uncSchema, takeSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Roster = require('./models/roster');
const Take = require('./models/take');



module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        // store the url they are requesting
        req.flash('error', 'You must be signed in first!')
       return res.redirect('/login')
    }
    next();
}

module.exports.validateRoster = (req, res, next) =>{

    const {error} = uncSchema.validate(req.body, {
     abortEarly: false,});
    if (error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg, 400)
    } else {
     next();
    }
 };

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const roster = await Roster.findById(id);
    if (!roster.author.equals(req.user._id)){
         req.flash('error', 'You do not have permission to do that!');
         return res.redirect('/UNCroster/${id}');
     }
     next();
 };

 module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, takeId} = req.params;
    const take = await Take.findById(takeId);
    if (!take.author.equals(req.user._id)){
         req.flash('error', 'You do not have permission to do that!');
         return res.redirect('/UNCroster/${id}');
     }
     next();
 };

module.exports.validateTake = (req, res, next) => {
    const {error} = takeSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
       } else {
        next();
       }
}
