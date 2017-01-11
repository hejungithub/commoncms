/**
 * Created by Administrator on 2016-10-25.
 */

angular.module('controllers', []);
angular.module('services', []);
angular.module('routeApp', [
    'ui.router',
    'ui.bootstrap',
    'controllers',
    'services'
]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            views: {
                'head': {
                    templateUrl: '/cms/static/views/head.html',
                    controller: 'HeadController'
                },
                'ltnav': {
                    templateUrl: '/cms/static/views/ltnav.html'
                },
                'rtcontent': {
                    templateUrl: '/cms/static/views/rtcontent.html'
                }
            },
            resolve: {
                Admin: ['AdminService', function (resolve) { return resolve.getAdminInfo();}]
            }
        })

        .state('home.search', {
            url:'search',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/search.html'
                }
            }
        })

        .state('home.admininfo', {
            url:'admin/info',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/admininfo.html'
                }
            }
        })

        .state('home.adminchange', {
            url:'admin/change',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/adminchange.html'
                }
            }
        })

        .state('home.admincontrol', {
            url:'admin/control',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/admincontrol.html'
                }
            }
        })

        .state('home.userlist', {
            url:'user/list',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/userlist.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                Users: ['UserService', function (resolve) { return resolve.getAllUser();}]
            }
        })

        .state('home.userother', {
            url:'user/list',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/userother.html'
                }
            }
        })


        .state('home.mt4list', {
            url:'mt4/list',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/mt4list.html'
                }
            }
        })

        .state('home.mt4han', {
            url:'mt4/han',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/mt4han.html'
                }
            }
        })

        .state('home.mt4gen', {
            url:'mt4/gen',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/mt4gen.html'
                }
            }
        })
}]);
