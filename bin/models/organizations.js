var mongoose = require('mongoose');

function capitalize (val){
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}


var OrganizationSchema = new mongoose.Schema({
    name: {type: String, set: capitalize, required: true},
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var Organization = mongoose.model('Organization', OrganizationSchema);


// Pre save
OrganizationSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = Organization;

