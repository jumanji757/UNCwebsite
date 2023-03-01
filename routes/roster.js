const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Roster = require('../models/roster');
const {uncSchema} = require('../schemas.js')

const validateRoster = (req, res, next) =>{

    const {error} = uncSchema.validate(req.body, {
     abortEarly: false,});
    if (error){
     const msg = error.details.map(el => el.message).join(',')
     throw new ExpressError(msg, 400)
    } else {
     next();
    }
 };


router.get('', async (req, res) => {
    const rosters = await Roster.find({});
    res.render('UNCroster/index', { rosters })
});

router.get('/new', (req, res) => {
    res.render('UNCroster/new');
});

router.get('/highlights', (req, res) => {
    res.render('UNCroster/highlights');
});

// Creates new player
router.post('/', validateRoster, catchAsync(async (req, res, next) => {
    const roster = new Roster(req.body.roster);
    await roster.save();
    req.flash('success', 'Successfully added a new Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`)

}));

router.get('/:id', catchAsync(async (req, res) => {
    const roster = await Roster.findById(req.params.id).populate('takes');
    if(!roster){
        req.flash('error', 'Cannot find that player');
        return res.redirect('/UNCroster');
    }
    res.render('UNCroster/show', { roster });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const roster = await Roster.findById(req.params.id)
    if(!roster){
        req.flash('error', 'Cannot find that player');
        return res.redirect('/UNCroster');
    }
    res.render('UNCroster/edit', { roster });
}));

router.put('/:id', validateRoster, catchAsync(async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findByIdAndUpdate(id, { ...req.body.roster });
    req.flash('success', 'Successfully updated Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Roster.findByIdAndDelete(id);
    res.redirect('/UNCroster');
}));

module.exports = router;
