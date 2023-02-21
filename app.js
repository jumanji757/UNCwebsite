const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsEngine = require('ejs-mate');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const Roster = require('./models/roster');

mongoose.set('strictQuery', true);
// can remove if need be

mongoose.connect('mongodb://localhost:27017/uncproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsEngine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateRoster = (req, res, next) =>{
    const uncSchema = Joi.object({
        roster: Joi.object({
            name: Joi.string().required(),
            title: Joi.string().required(),
            height: Joi.string().required(),
            hometown: Joi.string().required(),
            weight: Joi.number().required(),
            image: Joi.string().required(),
        }).required()
    })
   const {error} = uncSchema.validate(req.body);
   if (error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
   } else {
    next();
   }
};

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/UNCroster', async (req, res) => {
    const rosters = await Roster.find({});
    res.render('UNCroster/index', { rosters })
});

app.get('/UNCroster/new', (req, res) => {
    res.render('UNCroster/new');
});

app.get('/UNCroster/highlights', (req, res) => {
    res.render('UNCroster/highlights');
});

app.post('/UNCroster', validateRoster, catchAsync(async (req, res, next) => {
    const roster = new Roster(req.body.uncroster);
    await roster.save();
    res.redirect(`/UNCroster/${roster._id}`)

}));

app.get('/UNCroster/:id', catchAsync(async (req, res) => {
    const roster = await Roster.findById(req.params.id)
    res.render('UNCroster/show', { roster });
}));

app.get('/UNCroster/:id/edit', catchAsync(async (req, res) => {
    const roster = await Roster.findById(req.params.id)
    res.render('UNCroster/edit', { roster });
}));

app.put('/UNCroster/:id', validateRoster, catchAsync(async (req, res) => {
    const { id } = req.params;
    const roster = await Roster.findByIdAndUpdate(id, { ...req.body.uncroster });
    res.redirect(`/UNCroster/${roster._id}`);
}));

app.delete('/UNCroster/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Roster.findByIdAndDelete(id);
    res.redirect('/UNCroster');
}));

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something Went Wrong!"
    res.status(statusCode).render('error', {err});

});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});
