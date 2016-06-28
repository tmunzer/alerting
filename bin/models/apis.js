var mongoose = require('mongoose');

var XapiSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    ownerId: {type: String, required: true},
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
    vpcUrl: {type: String, required: true},
    vhmId: {type: String, required: true},
    expireAt: {type: String, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var Xapi = mongoose.model('Xapi', XapiSchema);


// Pre save
XapiSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Xapi;

