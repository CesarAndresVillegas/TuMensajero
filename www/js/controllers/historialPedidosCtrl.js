angular.module('starter')
.controller('historialPedidosCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
	$scope.controlDisabled = false;

    $scope.historialLista = [];
    $scope.contadorPagina = 1;
    $scope.itemsPerPage = 7;
    $scope.maxPage = 0;
    
    $scope.init = function(){
        $scope.controlDisabled = false;
        $scope.cargarHistorial();
    };

    $scope.irAtras=function(){
    	$scope.controlDisabled = true;
    	$state.go("menu")
    };

    $scope.irDetallesPedido=function(){
    	$scope.controlDisabled = true;
    	$state.go("detallesPedido")
    };

    $scope.cargarHistorial=function(){
        // Realizar petición de historial
        $http.get($rootScope._host + 'users/historial_pedidos/' + SharedService.datosUsuario.id)
        .success(function(data) {
            if(data.state == 1){
                $scope.historialLista = data.data;
                $scope.maxPage = Math.ceil($scope.historialLista.length/$scope.itemsPerPage);
            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Ha ocurrido un error',
                    template: data.message
                });
            }
        });
    };

    $scope.verDetalles=function(index){
        var objSeleccionado=$scope.historialLista[index];
        SharedService.objHistorialSeleccionado = objSeleccionado;
        $state.go("detallesPedido");
    };

    $scope.anterior = function(){
        $scope.contadorPagina --;
    };

    $scope.siguiente = function(){
        $scope.contadorPagina ++;
    }
})