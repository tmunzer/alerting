var mongoose = require('mongoose');


var AlarmSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    type: String,
    acknowledged: {type: Boolean, default: false},
    cleared: {type: Boolean, default: false},
    message: String,
    Date: Date,
    ackDate: Date,
    clearDate: Date,
 
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var Alarm = mongoose.model('Alarm', AlarmSchema);


// Pre save
AlarmSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Alarm;