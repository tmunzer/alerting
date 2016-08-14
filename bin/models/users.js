var mongoose = require('mongoose');
var bCrypt = require('bcryptjs');
var Password = require(appRoot + "/bin/models/passwords");

function cryptPassword (password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function capitalize (val){
    if (typeof val !== 'string') val = '';
    return val.charAt(0).toUpperCase() + val.substring(1);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var UserSchema = new mongoose.Schema({
    organization: {type: mongoose.Schema.ObjectId, ref:"Organization"},
    name: {
        first: {type: String, set: capitalize, trim: true, default: ""},
        last: {type: String, set: capitalize, trim: true, default: ""}
    },
    email: {type: String, required: true, unique: true, validator: validateEmail},
    enabled: {type: Boolean, default: true},
    fullAccess: {type: Boolean, default: false},
    writeAccess: {type: Boolean, default: false},
    lastLogin: Date,
    created_at    : { type: Date },
    updated_at    : { type: Date }
});

var User = mongoose.model('User', UserSchema);

User.newLogin = function(email, password, callback){
    this.findOne({email: email})
        .exec(function(err, user){
        if (err) callback(err, null);
        else if  (!user) callback(null, false);
        else {
            Password.findOne({user: user}, function(err, userPassword){
                if (err) callback(err, null);
                else if (user.enabled && bCrypt.compareSync(password, userPassword.password)){
                    user.lastLogin = new Date();
                    user.save();
                    callback(null, user);
                }
                else callback(null, false);
            })
        }
    })
};

User.findByEmail = function(email, callback){
    this.findOne({email: email}, callback);
};
User.findById = function(id, callback){
    this.findOne({_id: id}, callback);
};

// Pre save
UserSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = User;
