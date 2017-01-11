angular.module('controllers').controller('HeadController', ['$http', '$rootScope', 'AdminService', 'Admin',
    function ($http, $rootScope, AdminService, Admin) {
        'use strict';
        $rootScope.admin = Admin;

        $rootScope.keyname = "";

        $rootScope.exit = function(){
            $.cookie('cms', 'false', {expires: 1, path: '/' });
            alert("注销登录");
            window.location.href = '/cms/';
        }
    }
]);

angular.module('controllers').controller('SearchController', ['$http', '$scope', 'SearchService',
    function ($http, $scope, SearchService) {
        'use strict';
        $scope.name = "";
        $scope.tel = "";

        $scope.users = {};
        $scope.size = {};
        $scope.currentPage = 0;
        $scope.totalItems = {};
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            var pa = {
                name : $scope.name,
                tel : $scope.tel,
                cur: $scope.currentPage
            };
            SearchService.dosearch(pa).then(function (tmp) {
                if($.isEmptyObject(tmp)){
                }else{
                    $scope.users = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                }
            });
        };

        $scope.dosearch = function(){
            var pa = {
                name : $scope.name,
                tel : $scope.tel,
                cur : $scope.currentPage
            };
            SearchService.dosearch(pa).then(function(tmp){
                if($.isEmptyObject(tmp)){
                }else{
                    $scope.users = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                }
            },function(){
            });
        }
    }
]);

angular.module('controllers').controller('NavController', ['$http', '$scope', 'NavService', 'Nav',
    function ($http, $scope, NavService, Nav) {
        'use strict';
        $scope.nav = Nav;
    }
]);

angular.module('controllers').controller('AdminChangeController', ['$http', '$rootScope', '$scope', 'AdminService',
    function ($http, $rootScope, $scope, AdminService) {
        'use strict';

        $scope.changepwd = function(){
            if(typeof($scope.newpwd) == "undefined" || $scope.newpwd.trim() == ""){
                alert("密码不能为空");
                return;
            }

            var para = {
                name: $rootScope.admin.name,
                password: $.md5($scope.newpwd)
            };
           AdminService.changepwd(para).then(function(data){
               $rootScope.admin = data;
               $.cookie('cmsuser', data.name, {expires: 1, path: '/' });
               $.cookie('cmsupwd', data.password, {expires: 1, path: '/' });
               $.cookie('cms', 'true', {expires: 1, path: '/' });
               alert("修改密码成功");
               window.location.href = '/cms/main';
           })
        };
    }
]);

angular.module('controllers').controller('UserListController', ['$http', '$scope', 'UserService', 'Users',
    function ($http, $scope, UserService, Users) {
        'use strict';
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

angular.module('controllers').controller('UserDetailController', ['$http', '$scope', '$stateParams', 'UserService',
    function ($http, $scope, $stateParams, UserService) {
        'use strict';
        UserService.getUserById($stateParams.id).then(function(data){
            $scope.user = data;
        });
    }
]);


angular.module('controllers').controller('UserEditController', ['$http', '$scope', '$stateParams', 'UserService',
    function ($http, $scope, $stateParams, UserService) {
        'use strict';
        UserService.getUserById($stateParams.id).then(function(data){
            $scope.user = data;
        });
    }
]);