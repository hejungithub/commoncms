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
            },
            changepwd: function (pa) {
                var deferred = $q.defer();
                $http.post('/cms/adminchange', JSON.stringify(pa))
                    .then(function (res) {
                        if (res.data) {
                            deferred.resolve(res.data);
                        } else {
                            deferred.reject();
                        }
                    }, function() {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);






/**
 * nav service func
 *
 * getNavInfo
 *
 * */
angular.module('services').factory('NavService', ['$q', '$http',
    function ($q, $http) {
        return {
            getNavInfo: function () {
                var deferred = $q.defer();
                $http.get('/cms/navinfo')
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


/**
 *
 * user service func
 * */
angular.module('services').factory('UserService', ['$q', '$http',
    function ($q, $http) {
        return {
            AllUsers:{},
            getUserRemote:function(id){
                var deferred = $q.defer();
                $http.get('/cms/user/get/' + id)
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
            },
            getAllUser: function (datapage) {
                if(!datapage){
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/user/all/' + datapage)
                    .then(function (res) {
                        if (res.data) {
                            AllUsers = res.data;
                            deferred.resolve(res.data);
                        } else {
                            window.location.href = "/cms/"
                        }
                    }, function() {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getUserById: function(ids){
                var deferred = $q.defer();

                if(typeof(AllUsers) == "undefined"){
                    this.getUserRemote(ids).then(function(retdata){
                        deferred.resolve(retdata);
                    });
                }else{
                    var ret = null;
                    $.each(AllUsers.data,function(idx,tmp){
                        if(ids == tmp.id){
                            ret = tmp;
                        }
                    });
                    deferred.resolve(ret);
                }

                return deferred.promise;
            }
        };
    }
]);