angular.module('Alarms').controller("AlarmsCtrl", function ($scope, $rootScope, $mdDialog, alarmsService) {

    var initialized = false;

    $scope.requestForAlarms = null;
    $scope.alarms = [];
    var alarms = [];
    // table items
    $scope.selectAllChecked = false;
    $scope.selectedItems = 0;
    // pagination
    $scope.itemsByPage = 10;
    $scope.currentPage = 1;

    $scope.table = {
        show: false,
        filter: "",
        order: 'entryDate'
    };

    $scope.removeFilter = function () {
        $scope.table.show = false;
        $scope.table.filter = '';
    };


    $scope.requestForAlarms = alarmsService.getAlarms();
    $scope.requestForAlarms.then(function (promise) {
        initialized = true;
        if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
        else {
            alarms = promise.alarms;
            $scope.alarms = promise.alarms;
            $scope.alarmsLoaded = function () {
                return alarmsService.isLoaded()
            };
        }
    });
    

    $scope.$watch("table.filter", function () {
        $scope.alarms = [];
        alarms.forEach(function (alarm) {
            if ($scope.table.filter == ""
                || (alarm.userName && alarm.userName.toString().toLowerCase().indexOf($scope.table.filter.toString().toLowerCase()) >= 0)
                || (alarm.email && alarm.email.toString().toLowerCase().indexOf($scope.table.filter.toString().toLowerCase()) >= 0)
                || (alarm.phone && alarm.phone.indexOf($scope.table.filter) >= 0))
                $scope.alarms.push(alarm);
        })

    });
    


    $scope.selectAll = function () {
        if ($scope.alarms) {
            $scope.alarms.forEach(function (alarm) {
                alarm.selected = $scope.selectAllChecked;
            });
            if ($scope.selectAllChecked) $scope.selectedItems = $scope.alarms.length;
            else $scope.selectedItems = 0;
        }
    };
    $scope.selectOne = function (alarm, row) {
        if (row) alarm.selected = !alarm.selected;

        if (alarm.selected) {
            $scope.selectedItems++;
        } else $scope.selectedItems--;
        $scope.selectAllChecked = $scope.selectedItems == $scope.alarms.length;
    };



    $scope.refresh = function () {
        console.log('test');
        if (initialized) {
            $scope.selectAllChecked = false;
            $scope.selectAll();
            $scope.requestForAlarms = alarmsService.getAlarms();
            $scope.requestForAlarms.then(function (promise) {
                if (promise && promise.error) $scope.$broadcast("apiError", promise.error);
                else {
                    alarms = promise;
                    $scope.alarms = promise;
                }
            });
        }
    };
    

    $scope.ackAlert = function () {

    }

    $scope.clearAlert = function () {

    }

    $scope.removeAlert = function () {

    }

    $scope.refresh = function () {

    }
});