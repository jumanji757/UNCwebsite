const mongoose = require('mongoose');
const players = require('./players');
const { styles, dpositions } = require('./seedHelpers');
const Roster = require('../models/roster');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Roster.deleteMany({});
    for (let i = 0; i < 7; i++) {
        const random7 = Math.floor(Math.random() * 7);
        const number = Math.floor(Math.random() * 55);
        const rost = new Roster({
            name: `${players[random7].name}, ${players[random7].position}`,
            title: `${sample(styles)} ${sample(dpositions)}`,
            image: 'http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSOQnBMIm2y0_I0AK7ia68lu5AOAlPyvokyvU5JEDiOtbN7_QkmIUWnWzWUKu8y2hvNZMZKppdkP38HO8Q',
            number
        })
        await rost.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});