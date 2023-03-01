const mongoose = require('mongoose');
const Take = require('./take');
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
    takes: [
        {type: Schema.Types.ObjectId,
        ref: 'Take'
    }
    ]

});

RosterSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Take.deleteMany({
            _id:{
                $in: doc.takes
            }
        })

    }
})

module.exports = mongoose.model('Roster', RosterSchema);
