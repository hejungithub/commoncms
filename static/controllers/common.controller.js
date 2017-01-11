angular.module('controllers').controller('HeadController', ['$http', '$scope', 'CommonService', 'Admin',
    function ($http, $scope, CommonService, Admin) {
        'use strict';
        $scope.info = Admin;
    }
]);



angular.module('controllers').controller('HeadController', ['$http', '$scope', 'CommonService', 'Users',
    function ($http, $scope, CommonService, Users) {
        'use strict';
        $scope.users = Users;
    }
]);