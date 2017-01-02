angular.module('controllers').controller('HeadController', ['$http', '$scope', 'AdminService', 'Admin',
    function ($http, $scope, AdminService, Admin) {
        'use strict';
        $scope.info = Admin;
    }
]);