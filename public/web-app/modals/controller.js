angular.module('Modals').controller('ModalCtrl', function ($scope, $rootScope, $mdDialog) {
    $rootScope.displayed = false;
    $scope.$on('apiError', function (event, apiError) {
        if (!$rootScope.displayed) {
            $rootScope.displayed = true;
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'modals/modalErrorContent.html',
                escapeToClose: false,
                locals: {
                    items: {
                        apiErrorStatus: apiError.status,
                        apiErrorMessage: apiError.message,
                        apiErrorCode: apiError.code
                    }
                }
            }).then(function () {
                $rootScope.displayed = false;
            });
        }
    });
    $scope.$on('serverError', function (event, serverError) {
        if (!$rootScope.displayed) {
            $rootScope.displayed = true;
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'modals/modalServerErrorContent.html',
                escapeToClose: false,
                locals: {
                    items: {
                        errorStatus: serverError.status,
                        errorMessage: serverError.data
                    }
                }
            }).then(function () {
                $rootScope.displayed = false;
            });
        }
    });
    $scope.$on('apiWarning', function (event, apiWarning) {
        if (!$rootScope.displayed) {
            $rootScope.displayed = true;
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'modals/modalWarningContent.html',
                escapeToClose: false,
                locals: {
                    items: {
                        apiWarningStatus: apiWarning.status,
                        apiWarningMessage: apiWarning.message,
                        apiWarningCode: apiWarning.code
                    }
                }
            }).then(function () {
                $rootScope.displayed = false;
            });
        }
    });


});


angular.module('Modals').controller('DialogController', function ($scope, $mdDialog, items) {
    // items is injected in the controller, not its scope!
    $scope.items = items;
    $scope.close = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };
});
angular.module('Modals').controller('DialogConfirmController', function ($scope, $mdDialog, items) {
    // items is injected in the controller, not its scope!
    $scope.action = items.action;
    $scope.cancel = function () {
        $mdDialog.cancel()
    };
    $scope.confirm = function () {
        $mdDialog.hide();
    }
});
angular.module("Modals").controller("DialogApiController", function ($scope, $rootScope, $mdDialog, organizationsService, settingsApisService, items) {
    $scope.apiId = items.apiId;
    $scope.api = angular.copy(items.api);
    if (items.api.hasOwnProperty("organization")) $scope.organizationId = $scope.api.organization._id;

    $scope.organizations;
    $scope.isWorking = true;

    var requestForOrganizations = organizationsService.getOrganizations();
    requestForOrganizations.then(function (promise) {
        if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
        else {
            $scope.organizations = promise.organizations;
            $scope.isWorking = false;
        }
    });

    $scope.save = function () {
        $scope.isWorking = true;
        var updateApi = settingsApisService.assignApi($scope.api, $scope.organizationId);
        updateApi.then(function (promise) {
            $scope.isWorking = false;
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else $mdDialog.hide();
        })
    };

    $scope.cancel = function () {
        $mdDialog.cancel()
    };
});



angular.module("Modals").controller("DialogOrganizationController", function ($scope, $rootScope, $mdDialog, organizationsService, items) {
    $scope.organization = angular.copy(items.organization);
    if (items.hasOwnProperty('organizationId')) $scope.organizationId = items.organizationId;
    else $scope.organizationId = null;

    $scope.isWorking = false;

    $scope.isNotValid = function () {
        if (!$scope.organization.hasOwnProperty('name')) return true;
        else if ($scope.organization.name == "") return true;
        else return false;
    };

    $scope.save = function () {
        $scope.isWorking = true;
        var updateOrganization = organizationsService.updateOrganization($scope.organizationId, $scope.organization);
        updateOrganization.then(function (promise) {
            $scope.isWorking = false;
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else $mdDialog.hide();
        })
    };

    $scope.cancel = function () {
        $mdDialog.cancel()
    };
});

angular.module("Modals").controller("DialogEmailListController", function ($scope, $rootScope, $mdDialog, $mdConstant, settingsUsersService, organizationsService, settingsEmailListsService, items) {
    if (items.emailList != undefined) $scope.emailList = angular.copy(items.emailList);
    else $scope.emailList = {
        name: "",
        emails: []
    }
    if (items.hasOwnProperty('emailListId')) $scope.emailListId = items.emailListId;
    else $scope.emailListId = null;


    // Any key code can be used to create a custom separator
    var semicolon = 186;
    $scope.customKeys = [
        $mdConstant.KEY_CODE.ENTER,
        $mdConstant.KEY_CODE.SPACE,
        $mdConstant.KEY_CODE.COMMA,
        $mdConstant.KEY_CODE.TAB,
        semicolon];

    $scope.isWorking = false;

    $scope.isNotValid = function () {
        if (!$scope.emailList.hasOwnProperty('name')) return true;
        else if ($scope.emailList.name == "") return true;
        else if (!$scope.emailList.hasOwnProperty("emails")) return true;
        else if ($scope.emailList.emails.length == 0) return true;
        else return false;
    };

    $scope.organizations;

    var requestForMyAccount = settingsUsersService.getMyAccount();
    requestForMyAccount.then(function (promise) {
        if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
        else {
            $scope.myAccount = promise.user;
            var requestForOrganizations = organizationsService.getOrganizations();
            requestForOrganizations.then(function (promise) {
                if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
                else {
                    $scope.organizations = promise.organizations;
                    $scope.isWorking = false;
                }
            });
        }
    })



    $scope.save = function () {
        $scope.isWorking = true;
        var updateEmailList = settingsEmailListsService.updateEmailList($scope.emailListId, $scope.emailList);
        updateEmailList.then(function (promise) {
            $scope.isWorking = false;
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else $mdDialog.hide();
        })
    };

    $scope.cancel = function () {
        $mdDialog.cancel()
    };
});


angular.module("Modals").controller("DialogUserController", function ($scope, $rootScope, $mdDialog, settingsUsersService, organizationsService, items) {
    $scope.password_confirm = "";
    $scope.myAccount = {};
    if (items.hasOwnProperty('user')) {
        $scope.user = angular.copy(items.user);
    }
    else $scope.user = {
        name: {
            first: "",
            last: ""
        },
        email: "",
        fullAccess: false,
        writeAccess: false,
        organization: undefined,
        enabled: true
    };
    if (items.hasOwnProperty('user')) $scope.userId = angular.copy(items.userId);
    else $scope.userId = null;


    $scope.isWorking = true;

    $scope.$watch("user.fullAccess", function () {
        if ($scope.user.fullAccess == true) $scope.user.writeAccess = true;
    });

    $scope.showPasswordConfirm = function () {
        if ($scope.hasOwnProperty('password') && $scope.password != "") return true;
        else return false;
    };

    function getSelf() {
        var requestForMyAccount = settingsUsersService.getMyAccount();
        requestForMyAccount.then(function (promise) {
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else {
                $scope.myAccount = promise.user;
                getOrganization();
            }
        })
    }

    function getOrganization() {
        if ($scope.myAccount.fullAccess == true) {
            var requestForOrganizations = organizationsService.getOrganizations();
            requestForOrganizations.then(function (promise) {
                if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
                else {
                    $scope.organizations = promise.organizations;
                    $scope.isWorking = false;
                }
            })
        } else {
            $scope.user.organization = $scope.myAccount.organization;
            $scope.isWorking = false;
        }
    }

    getSelf();

    $scope.isNotValid = function () {
        if ($scope.user.username == "") return true;
        else if ($scope.password) {
            if ($scope.password == "") return true;
            else if ($scope.password_confirm == "") return true;
            else if ($scope.password != $scope.password_confirm) return true;
        }
        else if (!$scope.user.fullAccess && !$scope.user.organization) return true;
        else return false;
    };

    $scope.save = function () {
        $scope.isWorking = true;
        var updateUser = settingsUsersService.updateUser($scope.userId, $scope.user, $scope.password);
        updateUser.then(function (promise) {
            $scope.isWorking = false;
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else $mdDialog.hide();
        })
    };


    $scope.cancel = function () {
        $mdDialog.cancel()
    };
});


/* ==============================================================================
 ====================================================
 ====================================================
 ==========================
 ====================================================
 ====================================================
 ============================================================================== */



angular.module("Modals").controller("DialogMyAccountController", function ($scope, $mdDialog, settingsUsersService, items) {
    $scope.password_confirm = "";

    $scope.user;

    $scope.isWorking = true;

    var requestForSelf = settingsUsersService.getMyAccount();
    requestForSelf.then(function (promise) {
        if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
        else {
            $scope.user = promise.myAccount;
            $scope.isWorking = false;
        }
    });


    $scope.showPasswordConfirm = function () {
        if ($scope.user.hasOwnProperty('password') && $scope.user.password != "") return true;
        else return false;
    };


    $scope.isNotValid = function () {
        if ($scope.user.username == "") return true;
        else if ($scope.user.password == "") return true;
        else if ($scope.password_confirm == "") return true;
        else if ($scope.user.password != $scope.password_confirm) return true;
        else if (!$scope.user.GroupId > 0) return true;
        else if ($scope.user.GroupId > 1 && !$scope.user.SchoolId > 0) return true;
        else return false;
    };
    $scope.save = function () {
        $scope.isWorking = true;
        var updateUser = settingsUsersService.updateUser($scope.user.id, $scope.user);
        updateUser.then(function (promise) {
            $scope.isWorking = false;
            if (promise && promise.error) $rootScope.$broadcast("apiWarning", promise.error);
            else $mdDialog.hide();
        })
    };

    $scope.cancel = function () {
        $mdDialog.cancel()
    };
});

