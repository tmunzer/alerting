module.exports.getOrganizationId = function (req) {
    var organizationId = 0;
    if (req.session.passport.user.fullAccess) {
        if (req.body.hasOwnProperty("organizationId")) organizationId = req.body.organizationId;
        else if (req.query.hasOwnProperty("organizationId")) organizationId = req.query.organizationId;
        else organizationId = 0
    }
    else organizationId = req.session.passport.user.organization;
    return organizationId;
};