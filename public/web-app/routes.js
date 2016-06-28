angular.module('alerting').config(function ($routeProvider) {
    $routeProvider
        .when("/alarms", {
            templateUrl: "/web-app/alarms/alarms.html",
            module: "Alarms",
            controller: "AlarmsCtrl"
        })
        .when("/rules", {
            templateUrl: "/web-app/rules/rules.html",
            module: "Rules",
            controller: "RulesCtrl"
        })
        .when("/settings", {
            templateUrl: "/web-app/settings/settings.html",
            module: "Settings",
            controller: "SettingsCtrl"
        })
        .when("/organizations", {
            templateUrl: "/web-app/organizations/organizations.html",
            module: "Organizations",
            controller: "OrganizationsCtrl"
        })
        .otherwise({
            redirectTo: "/alarms/"
        });
});