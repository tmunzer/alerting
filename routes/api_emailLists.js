var express = require('express');
var router = express.Router();

var filters = require(appRoot + "/routes/api_filters");
var EmailLists = require(appRoot + "/bin/models/emailLists");


//===============================================================//
//============================ settings EMAIL LISTS===========================//
//===============================================================//


//========================== GET EMAILS list ===========================//
router.get("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {

        var organizationId = filters.getOrganizationId(req);
        var filterString = {};
        if (organizationId != 0) filterString = {organization: organizationId};

        EmailLists.find(filterString)
            .populate("organization")
            .exec(function (err, emailLists) {
            if (err) res.json({error: err});
            else if (emailLists) res.json({emailLists: emailLists});
            else res.json({emailLists: []});
        });
    } else res.status(403).send('Unknown session');
});

//========================= NEW EMAILS > SAVE =========================//
router.post("/", function (req, res, next) {
    var emailList
    if (req.session.hasOwnProperty('passport') && req.body.hasOwnProperty("emailList")) {
        if (req.body.hasOwnProperty('emailListId')) {
            if (req.session.passport.user.writeAccess == true) {
                // serialize the user
                emailList = req.body.emailList;

                //if user is not an admin (only admin can edit all organizations)
                var organizationId = filters.getOrganizationId(req);
                if (organizationId != 0) emailList.organization = organizationId;

                // update the user
                EmailLists.findOneAndUpdate({_id: req.body.emailListId}, emailList, function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });
            }
            else res.json({error: "You don't have enough privilege"});
        } else {
            // serialize the user
            emailList = req.body.emailList;

            //if user is not an admin (only admin can edit all organizations)
            var organizationId = filters.getOrganizationId(req);
            if (organizationId != 0) emailList.organization = organizationId;

            // update the user
            EmailLists(emailList).save(function (err) {
                if (err) res.json({error: err});
                else res.json({});                
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
            EmailLists.findOneAndRemove(filterString, function (err) {
                if (err) res.json({error: err});
                else res.json({});            
            });
        }
    } else res.status(403).send('Unknown session');
});

module.exports = router;