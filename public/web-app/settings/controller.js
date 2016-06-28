angular.module("Settings").filter("organizationDisplay", function () {
    return function (input) {
        if (!input || input.length === 0) return "None";
        else return input
    }
});

angular.module('Settings').controller("SettingsCtrl", function ($scope, $rootScope, $mdDialog, settingsUsersService, organizationsService, settingsApisService, settingsEmailListsService) {

    $scope.requestForUsers = null;
    $scope.users;
    var requestForMyAccount = null;
    $scope.myAccount;

    $scope.lessons = [];
    $scope.organizations = [];
    $scope.schedule = [];

    // pagination
    $scope.userItemsByPage = 10;
    $scope.userCurrentPage = 1;
    $scope.userTable = {
        show: false,
        filter: "",
        order: 'email'
    };


    var requestForEmailLists = null;
    $scope.emailLists;

    $scope.emailListsItemsByPage = 10;
    $scope.emailListsCurrentPage = 1;
    $scope.emailListsTable = {
        show: false,
        filter: "",
        order: 'name'
    };


    var requestForApis = null;
    $scope.apis;

    $scope.apiItemsByPage = 10;
    $scope.apiCurrentPage = 1;
    $scope.apiTable = {
        show: false,
        filter: "",
        order: '-startDate'
    };


    $scope.registerLink = 'https://cloud.aerohive.com/thirdpartylogin?client_id=' + $rootScope.clientId + '&redirect_uri=' + $rootScope.redirectUrl;


    function getUsers() {
        requestForMyAccount = settingsUsersService.getMyAccount();
        requestForMyAccount.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.myAccount = promise.user;
                $scope.requestForUsers = settingsUsersService.getUsers();
                $scope.requestForUsers.then(function (promise) {
                    if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                    else {
                        $scope.users = promise.users;
                    }
                });
            }
        });
    }

    $scope.newUser = function () {
        $mdDialog.show({
            controller: 'DialogUserController',
            templateUrl: 'modals/modalUserContent.html',
            locals: {
                items: {}
            }
        }).then(function () {
            getUsers();
        });
    };
    $scope.editUser = function (user) {
        $mdDialog.show({
            controller: 'DialogUserController',
            templateUrl: 'modals/modalUserContent.html',
            locals: {
                items: {
                    userId: user._id,
                    user: user
                }
            }
        }).then(function () {
            getUsers();
        });
    };
    $scope.deleteUser = function (userId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeUser'
                }
            }
        }).then(function () {
            var requestForUser = settingsUsersService.deleteUser(userId);
            requestForUser.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getUsers();
            })
        })
    };


    function getEmailLists() {
        requestForEmailLists = settingsEmailListsService.getEmailLists();
        requestForEmailLists.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else $scope.emailLists = promise.emailLists;
        });
    }


    $scope.newEmailList = function () {
        $mdDialog.show({
            controller: 'DialogEmailListController',
            templateUrl: 'modals/modalEmailListContent.html',
            locals: {
                items: {}
            }
        }).then(function () {
            getEmailLists();
        });
    };
    $scope.editEmailList = function (emailList) {
        $mdDialog.show({
            controller: 'DialogEmailListController',
            templateUrl: 'modals/modalEmailListContent.html',
            locals: {
                items: {
                    emailListId: emailList._id,
                    emailList: emailList
                }
            }
        }).then(function () {
            getEmailLists();
        });
    };
    $scope.deleteEmailList = function (emailListId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeEmailList'
                }
            }
        }).then(function () {
            var requestForEmailLists = settingsEmailListsService.deleteEmailList(emailListId);
            requestForEmailLists.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getEmailLists();
            })
        })
    };





    function getApis() {
        requestForApis = settingsApisService.getApis();
        requestForApis.then(function (promise) {
            if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
            else {
                $scope.apis = promise.apis;
            }
        })
    }

    $scope.deleteApi = function (apiId) {
        $mdDialog.show({
            controller: "DialogConfirmController",
            templateUrl: "modals/modalConfirmContent.html",
            locals: {
                items: {
                    action: 'removeApi'
                }
            }
        }).then(function () {
            requestForApis = settingsApisService.deleteApi(apiId);
            requestForApis.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else getApis();
            })
        })
    };

    $scope.editApi = function (api) {
        $mdDialog.show({
            controller: 'DialogApiController',
            templateUrl: 'modals/modalApiContent.html',
            locals: {
                items: {
                    apiId: api._id,
                    api: api,
                }
            }
        }).then(function () {
            getApis();
        });
    };

    $rootScope.$watch("organizationId", function () {
        getEmailLists();
        getUsers();
        getApis();
    });


});