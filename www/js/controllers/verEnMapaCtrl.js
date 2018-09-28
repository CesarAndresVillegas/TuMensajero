angular.module('starter')
.controller('verEnMapaCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $interval) {
	$scope.controlDisabled = false;
	$scope.map;
	$scope.pedidoActual={};
	$scope.timerPedido;
	$scope.marcador;
	$scope.init = function(){
		$interval.cancel($scope.timerPedido);
		$scope.pedidoActual = SharedService.objHistorialSeleccionado;
		$http.get($rootScope._host + 'positions/last/' + $scope.pedidoActual.delivery_man_id)
		.success(function(data) {
			if(data.state == 1){
				var latLng = new google.maps.LatLng(data.data.lat, data.data.lng);

				var mapOptions = {
					center: latLng,
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					streetViewControl: false,
					draggable: false,
					disableDoubleClickZoom: true,
					scrollwheel: false,
					navigationControl: false,
					disableDefaultUI: true
				}
				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
				$scope.setPositionMarker(data.data.lat, data.data.lng);
				var functionVerificarPosicion = function(){
					$http.get($rootScope._host + 'positions/last/' + $scope.pedidoActual.delivery_man_id)
					.success(function(data) {
						$scope.setPositionMarker(data.data.lat, data.data.lng);
					});
				}
				$scope.timerPedido=$interval(functionVerificarPosicion,15000);
			}
			else{
				var alertPopup = $ionicPopup.alert({
					template: data.message
				});
				$state.go("detallesPedido");
			}
		});
	};

	$scope.irAtras = function(){
		$scope.controlDisabled = true;
		$interval.cancel($scope.timerPedido);
		$state.go("detallesPedido");
	};

	$scope.setPositionMarker=function(lat, lng){
		var latLng = new google.maps.LatLng(lat, lng);
		if ($scope.marcador) {
			$scope.marcador.setPosition(latLng);
			$scope.map.setCenter(latLng);
		}
		else{
			$scope.marcador = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: latLng,
				icon: "img/rsz_logo.png"
			});
			$scope.map.setCenter(latLng);
		}
	}
})