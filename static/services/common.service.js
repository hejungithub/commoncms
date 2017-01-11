/**
 * admin service func
 *
 * getAdminInfo
 *
 * */
angular.module('services').factory('AdminService', ['$q', '$http',
    function ($q, $http) {
        return {
            getAdminInfo: function () {
                var para = {
                    'username': $.cookie('cmsuser'),
                    'userpwd': $.cookie('cmsupwd')
                };
                var deferred = $q.defer();
                $http.post('/cms/admin', JSON.stringify(para))
                    .then(function (res) {
                        console.log(res);
                        if (res.data) {
                            deferred.resolve(res.data);
                        } else {
                            window.location.href = "/cms/"
                        }
                    }, function() {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            }
        };
    }
]);



/**
 *
 * user service func
 * */
angular.module('services').factory('UserService', ['$q', '$http',
    function ($q, $http) {
        return {
            allUsers:{},
            getAllUser: function (datapage) {
                if(!datapage){
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/user/all/' + datapage)
                    .then(function (res) {
                        if (res.data) {
                            deferred.resolve(res.data);
                        } else {
                            window.location.href = "/cms/"
                        }
                    }, function() {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            }
        };
    }
]);