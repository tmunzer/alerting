var mongoose = require('mongoose');

var AlarmSettingSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    emailList: [{type: mongoose.Schema.ObjectId, ref:"EmailList"}],
    location: {type: mongoose.Schema.ObjectId, ref: "Location"},
    disconnectedDevice: {
        enable: {type: Boolean, default: false},
        repeat: {type: Number},
        info: {type: Number},
        warning: {type: Number},
        alert: {type: Number},
        critical: {type: Number}
    },
    disconnectedLocation: {
        enable: {type: Boolean, default: false},
        repeat: {type: Number},
        info: {type: Number},
        warning: {type: Number},
        alert: {type: Number},
        critical: {type: Number}
    },
    connectedClients: {
        enable: {type: Boolean, default: false},
        repeat: {type: Number},
        info: {type: Number},
        warning: {type: Number},
        alert: {type: Number},
        critical: {type: Number}
    },
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var AlarmSetting = mongoose.model('AlarmSetting', AlarmSettingSchema);


// Pre save
AlarmSettingSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = AlarmSetting;