var API = require(appRoot + "/bin/aerohive/api/main");


module.exports.updateDevices = function(xapi){
    API.monitor.device.GET(xapi, function(err, devices){
        if (err) console.log(err);
        else devices.forEach(function(device){
            console.log(device);
        })
    })
};