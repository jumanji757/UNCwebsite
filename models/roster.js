const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RosterSchema = new Schema({
    name: String,
    image: String,
    number: Number,
    position: String,
    hometown: String,
    height: String,
    weight: Number,
    class: String,
    title: String,
    hotTakes: [
        {type: Schema.Types.ObjectId,
        ref: 'Takes'
    }
    ]

});

module.exports = mongoose.model('Roster', RosterSchema);
