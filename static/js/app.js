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
]).config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
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
                    templateUrl: '/cms/static/views/ltnav.html',
                    controller: 'NavController'
                },
                'rtcontent': {
                    templateUrl: '/cms/static/views/rtcontent.html',
                    controller: 'NavController'
                }
            },
            resolve: {
                Admin: ['AdminService', function (resolve) { return resolve.getAdminInfo();}],
                Nav: ['NavService', function (resolve) { return resolve.getNavInfo();}]
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

        .state('home.adminedit', {
            url:'admin/edit',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/adminedit.html',
                    controller: 'AdminChangeController'
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

        .state('home.userdetail', {
            url:'user/detail/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/userdetail.html',
                    controller: 'UserDetailController'
                }
            }
        })

        .state('home.useredit', {
            url:'user/edit/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/useredit.html',
                    controller: 'UserEditController'
                }
            }
        })

        .state('home.livecourse', {
            url:'course/live',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/livecourse.html',
                    controller: 'LiveCourseController'
                }
            },
            resolve: {
                Lives: ['CourseService', function (resolve) { return resolve.getAllLive();}]
            }
        })

        .state('home.livecourseedit', {
            url:'course/live/edit/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/livecourseedit.html',
                    controller: 'LiveCourseEditController'
                }
            }
        })

        .state('home.livecourseadd', {
            url:'course/live/add',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/livecourseadd.html',
                    controller: 'LiveCourseAddController'
                }
            }
        })

        .state('home.hiscourse', {
            url:'course/his',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/hiscourse.html',
                    controller: 'HisCourseController'
                }
            },
            resolve: {
                Hiss: ['CourseService', function (resolve) { return resolve.getAllHis();}]
            }
        })

        .state('home.hiscourseedit', {
            url:'course/his/edit/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/hiscourseedit.html',
                    controller: 'HisCourseEditController'
                }
            }
        })

        .state('home.hiscourseadd', {
            url:'course/his/add',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/hiscourseadd.html',
                    controller: 'HisCourseAddController'
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

        .state('home.mt4recommend', {
            url:'mt4/recommend',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/mt4recommend.html',
                    controller: 'MT4recommendController'
                }
            },
            resolve: {
                MT4: ['UserService', function (resolve) { return resolve.getMt4strategyAll();}],
                MT4RECOMMEND: ['UserService', function (resolve) { return resolve.getMt4Recommend();}]
            }
        })


        /**
         * 系统充值
         * */
        .state('home.addval', {
            url:'system/addval',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/sysaddval.html',
                    controller: 'SysAddValController'
                }
            }
        })

        /**
         * 系统充值
         * */
        .state('home.addvalreal', {
            url:'system/addvalreal/:id-:name',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/sysaddvalreal.html',
                    controller: 'SysAddValRealController'
                }
            }
        })


        /**
         * 提现
         * */
        .state('home.tixian', {
            url:'system/tixian',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/systixian.html',
                    controller: 'SysTixianController'
                }
            }
        })

        /**
         * send msg
         * */
        .state('home.msg', {
            url:'system/msg',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/sysmsg.html',
                    controller: 'SysMsgController'
                }
            }
        })

        /**
         * add msg
         * */
        .state('home.msgadd', {
            url:'system/msg/add',
            views: {
                'rtcontent@': {
                    templateUrl: '/cms/static/views/sysmsgadd.html',
                    controller: 'SysMsgAddController'
                }
            }
        })

}]);
