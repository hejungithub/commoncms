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
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            changepwd: function (pa) {
                var deferred = $q.defer();
                $http.post('/cms/adminchange', JSON.stringify(pa))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);


/**
 * search service func
 *
 * getSearchInfo
 *
 * */
angular.module('services').factory('SearchService', ['$q', '$http',
    function ($q, $http) {
        return {
            dosearch: function (para) {

                var deferred = $q.defer();
                $http.post('/cms/search', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
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
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
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
            fan:function(usr){
                para = {
                    "uid":usr.id,
                    "state":usr.reverse
                };
                var deferred = $q.defer();
                $http.post('/cms/user/fan',JSON.stringify(para))
                    .then(function (res) {
                        deferred.resolve(res.data);
                    });
                return deferred.promise;
            },
            zhifu:function(id){
                var deferred = $q.defer();
                $http.get('/cms/user/zhifu/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/";
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getUserRemote: function (id) {
                var deferred = $q.defer();
                $http.get('/cms/user/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/";
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getAllUser: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/user/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getUserById: function (ids) {
                var deferred = $q.defer();

                this.getUserRemote(ids).then(function (retdata) {
                    deferred.resolve(retdata);
                });
                return deferred.promise;
            },
            getMt4strategyById: function(id) {
                var deferred = $q.defer();
                $http.get('/cms/mt4strategy/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/";
                        } else {
                            deferred.resolve(res.data.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getMt4strategyAll: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/mt4strategy/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            saveMt4recommend: function (obj) {
                var para = {
                    'uid': obj.uid,
                    'uname': obj.name,
                    'mt4id': obj.mt4id
                };

                var deferred = $q.defer();
                $http.post('/cms/mt4strategy/save', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            removeMt4recommend: function (obj) {
                var deferred = $q.defer();
                $http.get('/cms/mt4strategy/cancel/' + obj.Mt4ID)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            getMt4Recommend: function () {
                var deferred = $q.defer();
                $http.get('/cms/mt4recommend/all')
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res);
                        }
                    }, function () {
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
 * course service
 * */
angular.module('services').factory('CourseService', ['$q', '$http',
    function ($q, $http) {
        return {
            delLiveById: function(id){
                var deferred = $q.defer();
                $http.get('/cms/live/del/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            delHisById: function(id){
                var deferred = $q.defer();
                $http.get('/cms/his/del/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getLiveById: function (id) {
                var deferred = $q.defer();
                $http.get('/cms/live/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            save_live: function(obj) {
                var deferred = $q.defer();
                $http.post('/cms/live/save', JSON.stringify(obj))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            add_live: function(obj) {
                var deferred = $q.defer();
                $http.post('/cms/live/add', JSON.stringify(obj))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            getHisById: function (id) {
                var deferred = $q.defer();
                $http.get('/cms/his/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            save_his: function(obj) {
                var deferred = $q.defer();
                $http.post('/cms/his/save', JSON.stringify(obj))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            add_his: function(obj) {
                var deferred = $q.defer();
                $http.post('/cms/his/add', JSON.stringify(obj))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            getAllHis: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/his/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getAllLive: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/live/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
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
 * system service
 * */
angular.module('services').factory('SystemService', ['$q', '$http',
    function ($q, $http) {
        return {
            dosearch: function (para) {
                var deferred = $q.defer();
                $http.post('/cms/search', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            doadd:function(para){
                var deferred = $q.defer();
                $http.post('/cms/sysaddval', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.resolve();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            getTixanAll: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/tixian/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },

            tixian: function(oid){
                var deferred = $q.defer();
                $http.get('/cms/tixian/do/' + oid)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            cancelTixian: function(oid){
                var deferred = $q.defer();
                $http.get('/cms/tixian/cancel/' + oid)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },

            getMsgAll: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/msg/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },

            sendMsg: function(obj) {
                var deferred = $q.defer();

                var para = {
                    'title': obj.title,
                    'content': obj.content
                };

                $http.post('/cms/msg/add', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });
                return deferred.promise;
            }

        };
    }
]);