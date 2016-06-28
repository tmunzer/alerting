var mongoose = require('mongoose');


var AlarmClientSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    xapi: {type: mongoose.Schema.ObjectId, ref:"Xapi"},
    location: [String],
    ssid: [String],
    infoValue: Number,
    infoEmail: {type: Boolean, default: false},
    minorValue: Number,
    minorEmail: {type: Boolean, default: false},
    majorValue: Number,
    majorEmail: {type: Boolean, default: false},
    acknowledged: {type: Boolean, default: false},
    cleared: {type: Boolean, default: false},
    message: String,
    Date: Date,
    ackDate: Date,
    clearDate: Date,
 
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var AlarmClient = mongoose.model('AlarmClient', AlarmClientSchema);


// Pre save
AlarmClientSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = AlarmClient;