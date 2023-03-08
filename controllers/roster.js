const Roster = require('../models/roster');

module.exports.index = async (req, res) => {
    const rosters = await Roster.find({});
    res.render('UNCroster/index', { rosters })
};

module.exports.renderNewForm = (req, res) => {
    res.render('UNCroster/new');
};

module.exports.addPlayer = async (req, res, next) => {
    const roster = new Roster(req.body.roster);
    roster.author = req.user._id
    await roster.save();
    req.flash('success', 'Successfully added a new Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`)
};

module.exports.showPlayer = async (req, res,) => {
        const roster= await Roster.findById(req.params.id).populate({
            path: 'takes',
            populate: {
                path: 'author'
            }
        }).populate('author');
        console.log(roster);
        if(!roster){
            req.flash('error', 'Cannot find that player');
            return res.redirect('/UNCroster');
        }
        res.render('UNCroster/show', { roster });
};

module.exports.editPlayer = async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findById(id);
    if(!roster){
        req.flash('error', 'Cannot find that player');
        return res.redirect('/UNCroster');
    }
    res.render('UNCroster/edit', { roster });
};

module.exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findByIdAndUpdate(id, { ...req.body.roster });
    req.flash('success', 'Successfully updated Tarheel!')
    res.redirect(`/UNCroster/${roster._id}`);
};

module.exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    await Roster.findByIdAndDelete(id);
    res.redirect('/UNCroster');
};
