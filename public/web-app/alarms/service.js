angular.module('Alarms').factory("alarmsService", function ($http, $q, $rootScope) {
    var dataLoaded = false;
    var promise = null;

    function getAlarms() {
        var params = {
            status: "",
            level: ""
        };
        dataLoaded = false;

        var canceller = $q.defer();
        var request = $http({
            url: "/api/alarms",
            method: "GET",
            //params: params,
            timeout: canceller.promise
        });

        if (promise) promise.abort();
        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    dataLoaded = true;
                    return response.data;
                }
            },
            function (response) {
                if (response.status && response.status >= 0) {
                    $rootScope.$broadcast('serverError', response);
                    return ($q.reject("error"));
                }
            });

        promise.abort = function () {
            canceller.resolve();
        };
        promise.finally(function () {
            console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });

        return promise;
    }

    function ackAlarms(ids) {

        dataLoaded = false;

        var canceller = $q.defer();
        var request = $http({
            url: "/api/alarms/ack",
            method: "POST",
            params: {ids: ids},
            timeout: canceller.promise
        });

        if (promise) promise.abort();
        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    dataLoaded = true;
                    return response.data;
                }
            },
            function (response) {
                if (response.status && response.status >= 0) {
                    $rootScope.$broadcast('serverError', response);
                    return ($q.reject("error"));
                }
            });

        promise.abort = function () {
            canceller.resolve();
        };
        promise.finally(function () {
            console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });

        return promise;
    }

    function clearAlarms(ids) {

        dataLoaded = false;

        var canceller = $q.defer();
        var request = $http({
            url: "/api/alarms/clear",
            method: "POST",
            params: {ids: ids},
            timeout: canceller.promise
        });

        if (promise) promise.abort();
        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    dataLoaded = true;
                    return response.data;
                }
            },
            function (response) {
                if (response.status && response.status >= 0) {
                    $rootScope.$broadcast('serverError', response);
                    return ($q.reject("error"));
                }
            });

        promise.abort = function () {
            canceller.resolve();
        };
        promise.finally(function () {
            console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });

        return promise;
    }

    function deleteAlarms(ids) {

        dataLoaded = false;

        var canceller = $q.defer();
        var request = $http({
            url: "/api/alarms",
            method: "DELETE",
            params: {ids: ids},
            timeout: canceller.promise
        });

        if (promise) promise.abort();
        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    dataLoaded = true;
                    return response.data;
                }
            },
            function (response) {
                if (response.status && response.status >= 0) {
                    $rootScope.$broadcast('serverError', response);
                    return ($q.reject("error"));
                }
            });

        promise.abort = function () {
            canceller.resolve();
        };
        promise.finally(function () {
            console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });

        return promise;
    }


    return {
        getAlarms: getAlarms,
        ackAlarms: ackAlarms,
        clearAlarms: clearAlarms,
        deleteAlarms: deleteAlarms,
        isLoaded: function isLoaded() {
            return dataLoaded;
        }
    }
});
