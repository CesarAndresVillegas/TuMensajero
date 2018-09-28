angular.module('starter')
.controller('registrarUsuarioCtrl', function($scope, $rootScope, $ionicPopup, $state, $http) {
	$scope.userRegistro = {};
	$scope.controlDisabled = false;
	$scope.pdf_terms = {};

	$scope.init = function(){
		$scope.controlDisabled = false;
		$scope.traerTerminos();
	};

	$scope.traerTerminos = function(){
		$scope.controlDisabled = true;

		// Realizar petición de login
		$http.get($rootScope._host + 'terms/getActive')
		.success(function(data) {
			$scope.controlDisabled = false;
			if(data.state == 1){
				$scope.pdf_terms = data.data;
			}
		});
	};

	$scope.irAtras = function(){
		$scope.controlDisabled = true;
		$state.go("login");
	};

	$scope.registrarUsuario = function(){
		if(!$scope.userRegistro.name){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Por favor indique el nombre."
			});
			return;
		}

		if(!$scope.userRegistro.last_name){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Por favor indique el apellido."
			});
			return;
		}

		if(!$scope.userRegistro.mail){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Por favor verifique el correo electronico."
			});
			return;
		}

		if(!$scope.userRegistro.phone){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Por favor indique el telefono."
			});
			return;
		}

		if(!$scope.userRegistro.password || !$scope.userRegistro.passwordConfirm){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Por favor indique los campos de contraseña"
			});
			return;
		}

		if($scope.userRegistro.password != $scope.userRegistro.passwordConfirm){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "Las contraseñas no coinciden por favor revise."
			});
			return;
		}

		if(!$scope.userRegistro.accept){
			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "No se han aceptado los términos y condiciones, imposible registrar"
			});
			return;
		}

		$scope.controlDisabled = true;

		var datosRegistro = {
			mail: $scope.userRegistro.mail,
			pass: $scope.userRegistro.password,
			name: $scope.userRegistro.name,
			last_name: $scope.userRegistro.last_name,
			phone: $scope.userRegistro.phone,
			pdf_terms_id: $scope.pdf_terms.id
		};

		$http({
			url: $rootScope._host + 'users/register',
			method: "POST",
			data: datosRegistro
		})
		.success(function(data, status, headers, config) {
			$scope.controlDisabled = false;
			if(data.state == 1){
				$scope.userRegistro = {};
				$state.go("login");
				var alertPopup = $ionicPopup.alert({
					title: 'Exito',
					template: data.message
				});
			}
			else{
				var alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: data.message
				});
			}
		})
		.error(function(data){
			$scope.controlDisabled = false;
		});
	};

	$scope.terminosYCondiciones = function(){
		window.open("https://www.simple-it.co/", '_blank', 'location=no');
	};
})