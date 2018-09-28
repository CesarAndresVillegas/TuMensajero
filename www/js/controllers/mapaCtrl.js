angular.module('starter')
.controller('mapaCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $timeout) {
	$scope.controlDisabled = false;
	$scope.map;
	$scope.marker;
	$scope.trayectoActual;
	$scope.isInitialAddress;
	$scope.lastTrayecto;

	$scope.init = function(){
		$scope.trayectoActual = SharedService.trayectoActual;
		$scope.isInitialAddress = SharedService.isInitialAddress;
		$rootScope.show();
		if(SharedService.trayectos.length > 0){
			$scope.lastTrayecto = SharedService.trayectos[SharedService.trayectos.length-1]	
		}else{
			$scope.lastTrayecto = {};
		}

		if($scope.lastTrayecto.final_lat && $scope.lastTrayecto.final_lng){
			$rootScope.hide();
			var slat = $scope.lastTrayecto.final_lat;
			var slng = $scope.lastTrayecto.final_lng;

			var latLng = new google.maps.LatLng(slat, slng);

			var mapOptions = {
				center: latLng,
				zoom: 17,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false,
				navigationControl: false,
				disableDefaultUI: true
			};

			$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
			$scope.setPosition(latLng);

			google.maps.event.addListener($scope.map, 'center_changed', function() {
				$timeout(function() {
					var center = $scope.map.getCenter();
					$scope.setPosition(center);
				}, 100);
			});
		}
		else{
			navigator.geolocation.getCurrentPosition(function(data) {
				$rootScope.hide();
				var slat = data.coords.latitude;
				var slng = data.coords.longitude;

				var latLng = new google.maps.LatLng(slat, slng);

				var mapOptions = {
					center: latLng,
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					streetViewControl: false,
					navigationControl: false,
					disableDefaultUI: true
				};

				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
				$scope.setPosition(latLng);

				google.maps.event.addListener($scope.map, 'center_changed', function() {
					$timeout(function() {
						var center = $scope.map.getCenter();
						$scope.setPosition(center);
					}, 100);
				});
			},
			function(err){
				console.log(err);
				$rootScope.hide();
				var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'No se ha logrado determinar tu posición, verifica que el GPS este encendido.'
                });
				$state.go("agregarTrayecto");
			},
			{timeout:7000}
			);
		}
	};

	$scope.irAtras = function(){
		$scope.controlDisabled = true;
		$state.go("agregarTrayecto");
	};

	$scope.asignarDireccion = function(){
		var vlat = $scope.marker.position.lat();
		var vlng = $scope.marker.position.lng();

		if($scope.isInitialAddress){
			// Para inicial
			$scope.trayectoActual.initial_lat = vlat;
			$scope.trayectoActual.initial_lng = vlng;

			$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + vlat + ',' + vlng + '&sensor=true')
			.success(function(data){
				var dir = (data.results[0].formatted_address).split(",");
				$scope.trayectoActual.initial_address = dir[0] + ", " + dir[1];
				$state.go("agregarTrayecto");
			});
		}else{
			// Para final
			$scope.trayectoActual.final_lat = vlat;
			$scope.trayectoActual.final_lng = vlng;

			$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + vlat + ',' + vlng + '&sensor=true')
			.success(function(data){
				var dir = (data.results[0].formatted_address).split(",");
				$scope.trayectoActual.final_address = dir[0] + ", " + dir[1];
				$state.go("agregarTrayecto");
			});
		}
	};

	$scope.setPosition=function(pos){
		if($scope.marker == null){
			$scope.marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: pos
			});
		}else{
			$scope.marker.setPosition(pos);
		}
	}
})