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