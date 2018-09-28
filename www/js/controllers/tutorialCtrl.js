angular.module('starter')
    .controller('tutorialCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window, $ionicSlideBoxDelegate) {

        $scope.init = function() {

        };

        $scope.navSlide = function(index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        }

        $scope.goMenu = function() {
            $state.go("menu");
        }

        $scope.slideHasChanged = function($index) {
            if ($index === 4) {
                $state.go("menu");
            }
        };

        $scope.omitir = function($index) {
            var data = {
                id: SharedService.datosUsuario.id
            };
            $http.put($rootScope._host + 'users/update_tutorial', data)
                .success(function(data) {
                    $state.go("menu");
                })
                .error(function(err) {
                    $state.go("menu");
                });
        };
    })
