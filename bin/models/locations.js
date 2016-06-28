var mongoose = require('mongoose');

function capitalize (val){
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}


var LocationSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    acsId: {type: String},
    name: {type: String},
    folderType: {type: String},
    address: {type: String},
    uniqueName: {type: String},
    folders: [{type: mongoose.Schema.ObjectId, ref: "Location"}],
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var Location = mongoose.model('Location', LocationSchema);


// Pre save
LocationSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Location;