angular.module('Organizations').factory("organizationsService", function ($http, $q, $rootScope) {
    var isLoaded = false;
    var promise = null;


    function getOrganizations() {
        isLoaded = false;
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/organizations",
            method: "GET",
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
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
            //console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });
        return promise;
    }
    function deleteOrganization(id) {
        if (promise) promise.abort();

        var canceller = $q.defer();
        var request = $http({
            url: "/api/organizations",
            method: "DELETE",
            params: {id: id},
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else return response
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
            //console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });
        return promise;
    }

    function updateOrganization(organizationId, organization){
        if (promise) promise.abort();
        var canceller = $q.defer();

        var data;
        if (organizationId) data= {organizationId: organizationId, organization: organization};
        else data= {organization: organization};
        
        var request = $http({
            url: "/api/organizations",
            method: "POST",
            data: data,
            timeout: canceller.promise
        });

        promise = request.then(
            function (response) {
                if (response.data.error) return response.data;
                else {
                    isLoaded = true;
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
            //console.info("Cleaning up object references.");
            promise.abort = angular.noop;
            canceller = request = promise = null;
        });
        return promise;
    }

    return {
        getOrganizations: getOrganizations,
        updateOrganization: updateOrganization,
        deleteOrganization: deleteOrganization,
        isLoaded: function () {
            return isLoaded;
        }
    }
});