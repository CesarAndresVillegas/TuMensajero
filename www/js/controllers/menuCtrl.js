angular.module('starter')
.controller('menuCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, $window) {
	$scope.controlDisabled = false;

    $scope.$on('$ionicView.enter', function() {

    });

    $scope.init = function(){
        $scope.controlDisabled = false;
    };

    $scope.perfilUsuario=function(){
        $scope.controlDisabled = true;
        $state.go("perfilUsuario");
    };

    $scope.solicitarServicio=function(){
        $scope.controlDisabled = true;
        $state.go("iniciarPedido");
    };

    $scope.historialPedidos=function(){
        $scope.controlDisabled = true;
        $state.go("historialPedidos");
    };

    $scope.irAtras=function(){
        $scope.controlDisabled = true;
        // A confirm dialog
        var confirmPopup = $ionicPopup.confirm({
            title: 'Salir de BikeNow',
            template: 'Desea salir de la aplicación?'
        });

        confirmPopup.then(function(res) {
           if(res) {
            $window.localStorage.removeItem('user');
            $window.localStorage.removeItem('pwd');
            $state.go("login");
        } else {
         $scope.controlDisabled = false;
     }
 });
    };
})