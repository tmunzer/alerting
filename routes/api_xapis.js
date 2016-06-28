var express = require('express');
var router = express.Router();

var filters = require(appRoot + "/routes/api_filters");
var Apis = require(appRoot + "/bin/models/apis");


//===============================================================//
//============================ settings API===========================//
//===============================================================//

//========================== GET API ===========================//
router.get("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {

        var organizationId = filters.getOrganizationId(req);
        var filterString = {};
        if (organizationId != 0) filterString = {organization: organizationId};


        Apis.find(filterString)
            .populate("organization")
            .exec(function (err, apis) {
            if (err) res.json({error: err});
            else res.json({apis: apis});
        });

    } else res.status(403).send('Unknown session');
});


//========================== DELETE API ===========================//
router.delete('/', function (req, res) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.query.hasOwnProperty("id")) {
            var organizationId = filters.getOrganizationId(req);
            var filterString = {_id: req.query.id};
            if (organizationId != 0) filterString = {organization: organizationId, _id: req.query.id};
            Apis.findOneAndRemove(filterString, function (err, user) {
                if (err) res.json({error: err});
                res.json({});
            });
        }
    } else res.status(403).send('Unknown session');
});
//========================== UPDATE API ===========================//
//===   Called when a API configuration is assigned to a School ===//
router.post("/", function (req, res, next) {
    if (req.session.hasOwnProperty('passport')) {
        if (req.body.hasOwnProperty('api')) {
            if (req.session.passport.user.writeAccess == true) {
                // serialize the user
                var api = req.body.api;

                //if user is not an admin (only admin can edit all organizations)
                var organizationId = filters.getOrganizationId(req);
                if (organizationId != 0) {
                    api.organization = organizationId;
                    // update the user
                    Apis.findOneAndUpdate({_id: req.body.api._id}, api, function (err) {
                        if (err) res.json({error: err});
                        else res.json({});
                    });
                } else Apis.findOneAndUpdate({_id: req.body.api._id}, {$unset: {organization: ""}}, function (err) {
                    if (err) res.json({error: err});
                    else res.json({});
                });
            } else res.json({error: "You don't have enough privilege"});
        } else res.json({error: "apiId is missing"});
    } else res.status(403).send('Unknown session');
});

module.exports = router;