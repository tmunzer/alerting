var express = require('express');
var router = express.Router();

var filters = require(appRoot + "/routes/api_filters");
var Users = require(appRoot + "/bin/models/users");
var Passwords = require(appRoot + "/bin/models/passwords");


//===============================================================//
//============================ settings USERS===========================//
//===============================================================//

//========================== GET info for the current connected user ===========================//

router.get("/self", function (req, res, next) {
    if (req.session.hasOwnProperty("passport")) {
        res.json({
            user: req.session.passport.user.id,
            gid: req.session.passport.user.GroupId
        });
    } else res.status(403).send('Unknown session');
});
//========================== GET my account info ===========================//
router.get("/myAccount", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {
        res.json({user: req.session.passport.user});
    } else res.status(403).send('Unknown session');
});
//========================== GET USERS list ===========================//
router.get("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {

        var organizationId = filters.getOrganizationId(req);
        var filterString = {};
        if (organizationId != 0) filterString = {organization: organizationId};

        Users.find(filterString)
            .populate("organization")
            .exec(function (err, users) {
            if (err) res.json({error: err});
            else res.json({users: users});
        });
    } else res.status(403).send('Unknown session');
});

//========================== GET GROUPS list ===========================//
router.get("/groups", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {
        Groups.find({id: [">=", req.session.passport.user.GroupId]}, null, function (err, groups) {
            if (err) res.json({error: err});
            else res.json({groups: groups});
        });
    } else res.status(403).send('Unknown session');
});

//========================= NEW USER > SAVE =========================//
router.post("/", function (req, res, next) {
    var user;
    if (req.session.hasOwnProperty('passport') && req.body.hasOwnProperty("user")) {
        if (req.body.hasOwnProperty('userId')) {
            if ((req.session.passport.user._id == req.body.userId) || (req.session.passport.user.writeAccess == true)) {
                // serialize the user
                user = req.body.user;

                //if user is not an admin (only admin can edit all organizations)
                var organizationId = filters.getOrganizationId(req);
                if (organizationId != 0) user.organization = organizationId;

                // update the user
                Users.findOneAndUpdate({_id: req.body.userId}, user, function (err) {
                    if (err) res.json({error: err});
                    else {
                        //update password if present
                        if (req.body.hasOwnProperty("password")) {
                            Passwords.findOneAndUpdate({user: req.body.userId}, req.body.password, function (err) {
                                if (err) res.json({error: err});
                                else res.json({});
                            })
                        } else res.json({});
                    }
                });
            }
            else res.json({error: "You don't have enough privilege"});
        } else {
            // serialize the user
            user = req.body.user;

            //if user is not an admin (only admin can edit all organizations)
            var organizationId = filters.getOrganizationId(req);
            if (organizationId != 0) user.organization = organizationId;

            // update the user
            Users(user).save(function (err, newUser) {
                if (err) res.json({error: err});
                if (req.body.hasOwnProperty("password")) {
                    Passwords({user: newUser._id, password: req.body.password}).save(function (err) {
                        if (err) res.json({error: err});
                        else res.json({});
                    })
                } else res.json({error: "Password is missing"});
            });
        }
    }
});

//========================= DELETE USER =========================//
router.delete('/', function (req, res) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.query.hasOwnProperty("id")) {
            var organizationId = filters.getOrganizationId(req);
            var filterString = {_id: req.query.id};
            if (organizationId != 0) filterString = {organization: organizationId, _id: req.query.id};
            Users.findOneAndRemove(filterString, function (err, user) {
                if (err) res.json({error: err});
                else Passwords.findOneAndRemove({user: user}, function (err) {
                    res.json({});
                });
            });
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;