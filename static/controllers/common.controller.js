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

angular.module('controllers').controller('UserListController', ['$http', '$scope', 'SystemService',
    function ($http, $scope, SystemService) {
        'use strict';

        $scope.types = {
            "用户名" : "name",
            "手机" : "tel"
        };

        $scope.cond = "tel";
        $scope.condval = "";
        $scope.users = {};
        $scope.size = {};
        $scope.currentPage = 0;
        $scope.totalItems = {};
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            var pa = {};
            pa.cur = $scope.currentPage;

            if($scope.cond == "tel"){
                pa.tel = $scope.condval;
            }else{
                pa.name = $scope.condval;
            }

            SystemService.dosearch(pa).then(function (tmp) {
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
            var pa = {};
            pa.cur = $scope.currentPage;

            if($scope.cond == "tel"){
                pa.tel = $scope.condval;
            }else{
                pa.name = $scope.condval;
            }

            SystemService.dosearch(pa).then(function(tmp){
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
        };

        $scope.dosearch();
    }
]);

angular.module('controllers').controller('UserDetailController', ['$http', '$scope', '$stateParams', 'UserService',
    function ($http, $scope, $stateParams, UserService) {
        'use strict';
        UserService.getUserById($stateParams.id).then(function(data){
            $scope.user = data;
        });
        UserService.getMt4strategyById($stateParams.id).then(function(data){
            $scope.mt4strategy = data;
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



angular.module('controllers').controller('LiveCourseController', ['$http', '$scope', 'CourseService', 'Lives',
    function ($http, $scope, CourseService, Lives) {
        'use strict';
        $scope.lives = Lives.data;
        $scope.size = Lives.persize;
        $scope.currentPage = Lives.cur;
        $scope.totalItems = Lives.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            CourseService.getAllLive($scope.currentPage).then(function (tmp) {
                $scope.lives = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);



angular.module('controllers').controller('HisCourseController', ['$http', '$scope', 'CourseService', 'Hiss',
    function ($http, $scope, CourseService, Hiss) {
        'use strict';
        $scope.hiss = Hiss.data;
        $scope.size = Hiss.persize;
        $scope.currentPage = Hiss.cur;
        $scope.totalItems = Hiss.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            CourseService.getAllHis($scope.currentPage).then(function (tmp) {
                $scope.hiss = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);

angular.module('controllers').controller('MT4recommendController', ['$http', '$scope', 'UserService', 'MT4', 'MT4RECOMMEND',
    function ($http, $scope,UserService, MT4, MT4RECOMMEND) {
        'use strict';

        if(!$.isEmptyObject(MT4)){
            $scope.mt4 = MT4.data;
            $scope.size = MT4.persize;
            $scope.currentPage = MT4.cur;
            $scope.totalItems = MT4.total;
            $scope.maxSize = 5;

            $scope.pageChanged = function () {
                UserService.getMt4strategyAll($scope.currentPage).then(function (tmp) {
                    $scope.mt4 = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                });
            };

            $scope.doadd = function(obj) {
                UserService.saveMt4recommend(obj).then(function(){
                    window.location.reload(true);
                })
            };
        }

        if(!$.isEmptyObject(MT4RECOMMEND)){
            $scope.remt4 = MT4RECOMMEND.data;
            $scope.resize = MT4RECOMMEND.persize;
            $scope.recurrentPage = MT4RECOMMEND.cur;
            $scope.retotalItems = MT4RECOMMEND.total;
            $scope.remaxSize = 5;

            $scope.repageChanged = function () {
                UserService.getMt4Recommend($scope.recurrentPage).then(function (tmp) {
                    $scope.remt4 = tmp.data;
                    $scope.resize = tmp.persize;
                    $scope.recurrentPage = tmp.cur;
                    $scope.retotalItems = tmp.total;
                    $scope.remaxSize = 5;
                });
            };
        }

    }
]);

angular.module('controllers').controller('SysAddValController', ['$http', '$scope', 'SystemService',
    function ($http, $scope, SystemService) {
        'use strict';

        $scope.types = {
            "用户名" : "name",
            "手机" : "tel"
        };

        $scope.cond = "tel";
        $scope.condval = "";
        $scope.users = {};
        $scope.size = {};
        $scope.currentPage = 0;
        $scope.totalItems = {};
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            var pa = {};
            pa.cur = $scope.currentPage;

            if($scope.cond == "tel"){
                pa.tel = $scope.condval;
            }else{
                pa.name = $scope.condval;
            }

            SystemService.dosearch(pa).then(function (tmp) {
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
            var pa = {};
            pa.cur = $scope.currentPage;

            if($scope.cond == "tel"){
                pa.tel = $scope.condval;
            }else{
                pa.name = $scope.condval;
            }

            SystemService.dosearch(pa).then(function(tmp){
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
        };

        $scope.dosearch();
    }
]);



angular.module('controllers').controller('SysAddValRealController', ['$http', '$scope', '$state', '$stateParams', 'SystemService',
    function ($http, $scope, $state, $stateParams, SystemService) {
        'use strict';

        $scope.types = {
            "奖金" : "money",
            "齐傲币" : "qiaomoney"
        };
        $scope.valtype = "money";

        $scope.uid = $stateParams.id;
        $scope.uname = $stateParams.name;


        $scope.doadd = function(){
            var pa = {};
            pa.uid = $scope.uid;
            pa.val = $scope.addval;
            pa.valtype = $scope.valtype;

            SystemService.doadd(pa).then(function(){
                alert("充值成功!");
                $state.go("home.addval");
            },function(){
                alert("充值失败!");
                $state.go("home.addval");
            });
        }
    }
]);


angular.module('controllers').controller('SysTixianController', ['$http', '$scope', '$modal', '$state', '$stateParams', 'SystemService',
    function ($http, $scope, $modal, $state, $stateParams, SystemService) {
        'use strict';

        $scope.pageChanged = function () {
            SystemService.getTixanAll($scope.currentPage).then(function (tmp) {
                console.log(tmp);
                $scope.dss = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
        $scope.pageChanged();

        $scope.openModel = function(oid) {
            $scope.oid = oid;
            $modal.open({
                templateUrl : 'modal.html',
                controller : 'modalCtrl',
                resolve : {
                    page : function() {
                        return $scope;
                    }
                }
            })
        };

        $scope.tixian = function(){
            SystemService.tixian($scope.oid).then(function (tmp) {
                $scope.pageChanged();
            });
        };

        $scope.cancelTxian = function(){
            SystemService.cancelTixian($scope.oid).then(function (tmp) {
                $scope.pageChanged();
            });
        }
    }
]);


angular.module('controllers').controller('modalCtrl', ['$http', '$scope', '$uibModalInstance','page',
    function ($http, $scope, $uibModalInstance, page) {
        'use strict';

        $scope.ok = function() {
            page.tixian();
            $uibModalInstance.close();
        };
        $scope.cancel = function() {
            page.cancelTxian();
            $uibModalInstance.close();
        };
        $scope.quit = function() {
            $uibModalInstance.close();
        }
    }
]);



angular.module('controllers').controller('SysMsgController', ['$http', '$scope', '$state', '$stateParams', 'SystemService',
    function ($http, $scope, $state, $stateParams, SystemService) {
        'use strict';

        $scope.pageChanged = function () {
            SystemService.getMsgAll($scope.currentPage).then(function (tmp) {
                $scope.dss = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
        $scope.pageChanged();
    }
]);


angular.module('controllers').controller('SysMsgAddController', ['$http', '$scope', '$state', '$stateParams', 'SystemService',
    function ($http, $scope, $state, $stateParams, SystemService) {
        'use strict';

        $scope.sendMsg = function(){
            SystemService.sendMsg($scope.msg).then(function(){
                alert("添加成功!");
                $state.go('home.msg');
            })
        };
    }
]);