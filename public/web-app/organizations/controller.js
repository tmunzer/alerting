angular.module('Organizations').controller("OrganizationsCtrl", function ($scope, $rootScope, $mdDialog, organizationsService) {

    var initialized = false;

    $scope.organizations;
    var requestForOrganizations = null;
    // table items
    $scope.selectAllChecked = false;
    $scope.selectedItems = 0;
    // pagination
    $scope.itemsByPage = 10;
    $scope.currentPage = 1;

    $scope.table = {
        show: false,
        filter: "",
        order: 'name'
    };

    function getOrganizations() {
        requestForOrganizations = organizationsService.getOrganizations();
        requestForOrganizations.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                console.log(promise);
                $scope.organizations = promise.organizations;
                $rootScope.organizations = promise.organizations;
            }
        });
    }

    $scope.newOrganization = function () {
        $mdDialog.show({
            controller: 'DialogOrganizationController',
            templateUrl: 'modals/modalOrganizationContent.html',
            locals: {
                items: {
                    organization: {}
                }
            }
        }).then(function () {
            getOrganizations();
        });
    };
    $scope.deleteOrganization = function (organizationId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeOrganization'
                }
            }
        }).then(function () {
            requestForOrganizations = organizationsService.deleteOrganization(organizationId);
            requestForOrganizations.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getOrganizations();
            })
        })
    };
    $scope.editOrganization = function (organization) {
        $mdDialog.show({
            controller: 'DialogOrganizationController',
            templateUrl: 'modals/modalOrganizationContent.html',
            locals: {
                items: {
                    organizationId: organization._id,
                    organization: organization
                }
            }
        }).then(function () {
            getOrganizations();
        });
    };


});