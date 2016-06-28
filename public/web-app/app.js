angular.module("Alarms", []);
angular.module("Rules", []);
angular.module("Settings", []);
angular.module("Modals", []);
angular.module("Organizations", []);
angular.module("CustomFilters", []);
var alerting = angular.module("alerting", [
    "ngRoute",
    'ui.bootstrap',
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'CustomFilters',
    'Alarms',
    'Rules',
    'Settings',
    'Modals',
    'Organizations',
    'scDateTime',
    'pascalprecht.translate'
]);

alerting
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette("blue", {
                'default': '600'
            })
            .accentPalette('green', {
                'default': '400' // by default use shade 400 from the pink palette for primary intentions
            });
    }).config(['$httpProvider', function ($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]).config(function ($translateProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider
            .translations('en', en)
            .translations('fr', fr)
            .registerAvailableLanguageKeys(['en', 'fr'], {
                'en_*': 'en',
                'fr_*': 'fr',
                "*": 'en'
            })
            .determinePreferredLanguage()
            .fallbackLanguage('en')
            .usePostCompiling(true)
            .useSanitizeValueStrategy("escapeParameters");

    });



alerting.controller("UserCtrl", function ($scope, $rootScope, $mdDialog, $mdSidenav, $location, $translate) {
    //$rootScope.GroupId = angular.element(document.getElementsByName('GroupId')[0]).val();
    $scope.authorizedLevel = function(level){
        return $rootScope.GroupId <= level;
    };


    var originatorEv;
    this.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
    };
    this.sideNav = function (id) {
        $mdSidenav(id).toggle()
    };
    this.showFab = function () {
        var haveFab = ["/monitor", "/credentials"];
        return (haveFab.indexOf($location.path().toString()) > -1);
    };
    this.translate = function (langKey){
        $translate.use(langKey);
    }
});

alerting.controller("HeaderCtrl", function ($scope, $rootScope, $location, $window, $mdDialog, organizationsService) {
    $rootScope.clientId = angular.element(document.getElementsByName('clientId')[0]).val();
    $rootScope.redirectUrl = angular.element(document.getElementsByName('redirectUrl')[0]).val();
    
    $scope.organizationId = 0;
    $scope.organizations = [];
    var requestForOrganizations = organizationsService.getOrganizations();
    requestForOrganizations.then(function (promise) {
        if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
        else {
            $rootScope.organizations = promise.organizations;
        }
    });
    $rootScope.$watch("organizations", function(){
        $scope.organizations = $rootScope.organizations;
    });

    $scope.$watch('organizationId', function(){
        $rootScope.organizationId = $scope.organizationId;
        if ($location.path().toString().split("/")[1] == "organizations"){
            $location.path('/alarms')
        }
    });
    
    $scope.showOrganizations = function(){
        return $scope.organizationId == 0;

    }


    $scope.nav = {};
    $scope.nav.isActive = function (path) {
        if (path === $location.path().toString().split("/")[1]) return true;
        else return false;
    };
    $scope.subnav = {};
    $scope.subnav.isActive = function (path) {
        if (path === $location.path().toString().split("/")[2]) return true;
        else return false;
    };


});

