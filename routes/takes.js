const express = require('express');
const router = express.Router({mergeParams: true});

const Roster = require('../models/roster');
const Take = require('../models/take');

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');
const {takeSchema} = require('../schemas.js')

const validateTake = (req, res, next) => {
    const {error} = takeSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
       } else {
        next();
       }
}

router.post('/', validateTake, catchAsync(async (req,res) => {
    const roster = await Roster.findById(req.params.id);
    const take = new Take(req.body.take);
    roster.takes.push(take);
        // takes is from RosterSchema object
    await take.save();
    await roster.save();
    req.flash('success', 'Created Hot Take!')
    res.redirect(`/UNCroster/${roster._id}`)
}));

router.delete('/:takeId', catchAsync(async(req, res) => {
    const {id, takeId} = req.params
    Roster.findByIdAndUpdate(id, {$pull: {takes: takeId}});
    // pull operator removes from an existing array(takes) all instances of a value or values that match a specified condition.
    await Take.findByIdAndDelete(takeId)
    req.flash('success', 'Successfully deleted your terrible take!')
    res.redirect(`/UNCroster/${id}`);
}));


module.exports = router;
