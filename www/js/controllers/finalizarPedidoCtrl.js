angular.module('starter')
.controller('finalizarPedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
	$scope.controlDisabled = false;

  $scope.numeroEstrellas=2;
  $scope.comment_rating={};

  $scope.init = function(){
    $scope.controlDisabled = false;
  };

  $scope.irAtras = function(){
    $scope.controlDisabled = true;
		$state.go("detallesPedido");
	};

	$scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: 'rgb(200, 200, 100)',
    iconOffColor:  'rgb(200, 100, 100)',
    rating:  2,
    minRating:1,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    $scope.numeroEstrellas = rating;
  };

  $scope.finalizar = function(){
    var confirmPopup = $ionicPopup.confirm({
        title: '',
        template: 'Desea finalizar el pedido?'
      });

    confirmPopup.then(function(res){
      if(res){
        // Petición para finalizar el pedido.
        var data = {
          id: SharedService.objHistorialSeleccionado.id,
          order_status_id: 5,
          star_rating: $scope.numeroEstrellas,
          comment_rating: $scope.comment_rating.comment
        };

        $http.put($rootScope._host + 'orders/updateState', data)
        .success(function(data){
          if(data.state == 1){
            var alertPopup = $ionicPopup.alert({
              title: 'Exito',
              template: data.message
            });

            $state.go("menu");
          }
          else{
            var alertPopup = $ionicPopup.alert({
              title: 'Exito',
              template: data.message
            });
          }
        });
      }
    });
  }
})