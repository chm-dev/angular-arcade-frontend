'use strict';

/* Controllers */
var frontendControllers = angular.module('frontendControllers', []);


frontendControllers.filter('rmbrckts', function ($sce) {
    return function (text) {
        return text ? text.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\s/g, '%20') : '';
    };
})

frontendControllers.controller('PlatformsCtrl', ['$scope', 'platform',
    function ($scope, platform) {
        $scope.boxSrc
        $scope.platforms = platform.query();


        $scope.ulClass = 'platforms';
        $scope.ul = $('ul.' + $scope.ulClass);
        $scope.indx = 0;

        $scope.init = function () {
            //console.log('init');
            $scope.$broadcast('move', 0);
            //$($scope.ul.children().get($scope.indx)).addClass('active')
            //   console.log(ul.children().get($scope.indx))
            //   $scope.updateArt();

        }




}
]);





frontendControllers.controller('GamesListCtrl', ['$scope', '$routeParams', 'platform',
    function ($scope, $routeParams, platform) {

        $scope.platform = platform.get({
            platform: $routeParams.platform
        }, function (platform) {

            angular.forEach(platform.games, function (game, index) {
                //Just add the index to your item
                game.oindex = index;
            });
        });
        $scope.paths = platform.get({
            platform: 'paths'
        });
        $scope.orderProp = 'description';
        $scope.boxSrc
        $scope.indx = 0;
        $scope.ulClass = 'games';
        $scope.ul = $('ul.' + $scope.ulClass);
        $scope.navDisabled


        $scope.init = function () {
            //            $($scope.ul.children().get($scope.indx)).addClass('active')
            //   console.log(ul.children().get($scope.indx))
            $scope.$broadcast('move', 'init');
        }

        $scope.loading = function (action) {




            if (action == "start") {
                //console.log('start');
                if ($('#loading')) {
                    $('#loading').css('display', "block").animate({
                        'opacity': 1
                    }, 500, "linear");
                    win.on('blur', function () {
                        $('#loading .spinner').css('visibility', 'hidden')
                    });
                }
            } else if (action == "exit") {
                //console.log('exit');
                $('#loading').animate({
                    "opacity": 0
                }, 1200, "linear", function () {
                    $(this).css('display', "none");
                    $('#loading .spinner').css('visibility', 'visible');
                    win.removeAllListeners('blur');


                })
            }

        }


}]);


frontendControllers.controller("keyController", ['$scope', '$window', function ($scope, $window) {
    $(function () {
        /*
         * this swallows backspace keys on any non-input element.
         * stops backspace -> back
         */
        var rx = /INPUT|SELECT|TEXTAREA/i;

        $(document).bind("keydown keypress", function (e) {
            if (e.which == 8 || e.which == 9) { // 8 == backspace
                if (!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly) {
                    e.preventDefault();
                }
            }
        });
    });
    angular.element($window).on('keydown', function (e) {

        if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 8 || e.keyCode == 9) {
            $scope.$broadcast('move', e.keyCode);
        }


    });

}]);


frontendControllers.controller('NavigationCtrl', ['$scope', 'platform', 'buildRoms',
    function ($scope, platform, buidRoms) {
        $scope.$on('move', function (event, keyCode) {
            //  console.log('move ' + keyCode);
            if (!$scope.navDisabled) {

                /* ENTER - aktywujemy aktywną opcję */
                if (keyCode == 13) {
                    if ($scope.ulClass == "games") {
                        $scope.loading('start');
                        //alert('Uruchom grę ' + $scope.platform.menu.game[$('ul.' + $scope.ulClass).children().get($scope.indx).dataset.oindex].description);
                        var exec = require("child_process").exec;
                        console.log($scope.paths.roms);
                        var emulator = $scope.paths.emulators[$scope.platform.info.id];
                        var roms = $scope.paths.roms;
                        var gamefile = $scope.platform.games[$('ul.' + $scope.ulClass).children().get($scope.indx).dataset.oindex].filename;

                        var runFile = decodeURIComponent(emulator + "\"" + roms + $scope.platform.info.id + '%5C' + gamefile + "\"");

                        console.log(runFile);


                        $scope.navDisabled = true;
                        var child = exec(runFile,
                            function (error, stdout, stderr) {
                                console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr);
                                if (error !== null) {
                                    console.log('exec error: ' + error);
                                }
                            });
                        child.on('exit', function (code) {
                            console.log('Child process exited ' +
                                'with exit code ' + code);

                            $($scope.ul.children().get($scope.indx)).addClass('active')
                            $scope.navDisabled = false;
                            $scope.loading('exit');
                        });
                        return
                    } else if ($scope.ulClass == "platforms") {

                        location.href = "#/platform/" + $scope.platforms[$scope.indx].id;


                    } else if ($scope.ulClass == "settings") {


                        if ($('#scan').hasClass('active')) {

                            require("../app/js/node/build-roms.js");
                            console.log('2scan');
                        }


                    }


                }




                $($scope.ul.children().get($scope.indx)).removeClass('active')

                /* strzałka w dół - 1 w dół */
                if (keyCode == 40 && $scope.indx + 1 < $scope.ul.children().length) {
                    $scope.indx++;
                }
                /* strzałka w górę - 1 w górę */
                if (keyCode == 38 && $scope.indx != 0) {
                    $scope.indx--;
                }
                /* strzałka w lewo - 10 w górę */
                if (keyCode == 37 && $scope.indx != 0) {
                    if ($scope.indx - 10 < 0) {
                        $scope.indx = 0;
                    } else {

                        $scope.indx = $scope.indx - 10;
                    }
                }

                /* strzałka w prawo - 10 w dół */
                if (keyCode == 39 && $scope.indx + 1 < $scope.ul.children().length) {
                    if ($scope.indx + 10 > $scope.ul.children().length - 1) {
                        $scope.indx = $scope.ul.children().length - 1;
                    } else {

                        $scope.indx = $scope.indx + 10;
                    }
                }


                if (keyCode == 9) { //tab wchodzimy do opcji
                    console.log('tab pressed');
                    location.href = '#/settings';
                }




                /* Backspace - cofamy do głównego menu ale tylko w menu games*/
                if (keyCode == 8) {
                    if ($scope.ulClass == "games" || location.href.split("#")[1] == '\/settings') {
                        //location.href = '#/platforms';
                        history.back();
                    }


                }

                $($scope.ul.children().get($scope.indx)).addClass('active')

                $($scope.ul.parent()).scrollTo($($scope.ul.children().get($scope.indx)), 40, {
                        offset: -($(window).height() / 2)
                    })
                    //console.log('scrolling to ' + $scope.ul.children().get($scope.indx).id + '\nindx = ' + $scope.indx + '\n' + $scope.ul.children().get($scope.indx).dataset.oindex);

                /* update art */
                if ($scope.ulClass == "games") {

                    $scope.boxSrc =
                        'img/games/' + $scope.platform.info.id +
                        '/Box/' + $scope.platform.games[$('ul.' + $scope.ulClass).children().get($scope.indx).dataset.oindex].filenameNoExt + '.png';
                    keyCode == 'init' ? '' : $scope.$apply();

                }
            }
        })

                }]);

frontendControllers.controller('SettingsCtrl', ['$scope', 'platform', 'buildRoms',
    function ($scope, platform, buildRoms) {
        $scope.indx = 0;
        $scope.ulClass = 'settings';
        $scope.ul = $('ul.' + $scope.ulClass);
        $scope.paths = platform.get({
            platform: 'paths',
        });
        $scope.init = function () {
            $scope.$broadcast('move', 'init');
        }
        $scope.$on('$viewContentLoaded', function () {
            $scope.init();

        });

                }])