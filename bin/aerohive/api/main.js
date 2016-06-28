

module.exports.configuration = {
    location: {
        GET: require(appRoot + "/bin/aerohive/api/configuration/location/location").GET
    }
};

module.exports.monitor = {
    device: {
        GET: require(appRoot + "/bin/aerohive/api/monitor/device").GET
    },
    client: {
        clientsList: require(appRoot + "/bin/aerohive/api/monitor/client").clientsList,
        clientDetails: require(appRoot + "/bin/aerohive/api/monitor/client").clientDetails
    }
};

module.exports.clientlocation = {
    clienttimeseries: {
        GET: require(appRoot + "/bin/aerohive/api/clientlocation/clienttimeseries").GET,
        GETwithEE: require(appRoot + "/bin/aerohive/api/clientlocation/clienttimeseries").GETwithEE

    },
    clientcount: {
        GET: require(appRoot + "/bin/aerohive/api/clientlocation/clientcount").GET,
        GETwithEE: require(appRoot + "/bin/aerohive/api/clientlocation/clientcount").GETwithEE
    }
};

module.exports.identity = {
    userGroups: {
        getUserGroups: require(appRoot + "/bin/aerohive/api/identity/userGroups").getUserGroups
    },
    credentials: {
        getCredentials: require(appRoot + "/bin/aerohive/api/identity/credentials").getCredentials,
        createCredential: require(appRoot + "/bin/aerohive/api/identity/credentials").createCredential,
        deleteCredential: require(appRoot + "/bin/aerohive/api/identity/credentials").deleteCredential,
        deliverCredential: require(appRoot + "/bin/aerohive/api/identity/credentials").deliverCredential,
        renewCredential: require(appRoot + "/bin/aerohive/api/identity/credentials").renewCredential,
        updateCredential: require(appRoot + "/bin/aerohive/api/identity/credentials").updateCredential
    }
};