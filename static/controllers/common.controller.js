angular.module('controllers').controller('HeadController', ['$http', '$scope', 'AdminService', 'Admin',
    function ($http, $scope, AdminService, Admin) {
        'use strict';
        $scope.info = Admin;
    }
]);



angular.module('controllers').controller('UserListController', ['$http', '$scope', 'UserService', 'Users',
    function ($http, $scope, UserService, Users) {
        'use strict';
        console.log(Users);
        $scope.users = Users.data;
        $scope.size = Users.persize;
        $scope.currentPage = Users.cur;
        $scope.totalItems = Users.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            UserService.getAllUser($scope.currentPage).then(function (tmp) {
                $scope.users = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);