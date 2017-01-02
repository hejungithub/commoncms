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
                            deferred.resolve(JSON.parse(res.data));
                        } else {
                            window.location.href = "http://localhost:3000/cms/login"
                        }
                    }, function () {
                        window.location.href = "http://localhost:3000/cms/login"
                    });

                return deferred.promise;
            }
        };
    }
]);