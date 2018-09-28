angular.module('starter')
    .controller('perfilUsuarioCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.usuario = {};
        $scope.datosUsuario = {};

        $scope.controlDisabled = false;

        $scope.init = function() {
            $scope.controlDisabled = false;
        };

        $scope.$on('$ionicView.enter', function() {
            $scope.datosUsuario = SharedService.datosUsuario;

            $scope.usuario.name = SharedService.datosUsuario.name;
            $scope.usuario.last_name = SharedService.datosUsuario.last_name;
            $scope.usuario.phone = SharedService.datosUsuario.phone;
            $scope.usuario.mail = SharedService.datosUsuario.mail;
        });

        $scope.irAtras = function() {
            $scope.controlDisabled = true;
            $state.go("menu")
        };

        $scope.modificarDatos = function() {
            $scope.controlDisabled = true;
            // Realizar petición de login
            var data = {
                id: $scope.datosUsuario.id,
                name: $scope.usuario.name,
                last_name: $scope.usuario.last_name,
                phone: $scope.usuario.phone
            };
            $http.put($rootScope._host + 'users/update_contact', data)
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == 1) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Ok',
                            template: data.message
                        });
                    }
                });
        }

        $scope.modificarPass = function() {
            $scope.controlDisabled = true;

            if ($scope.usuario.newPassConfirm != $scope.usuario.newPass) {
                $scope.controlDisabled = false;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Las contraseñas no coinciden.'
                });
                return;
            }

            var data = {
                id: $scope.datosUsuario.id,
                oldPass: $scope.usuario.oldPass,
                newPass: $scope.usuario.newPass
            };

            $http.put($rootScope._host + 'users/update_pass', data)
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == "1") {
                        $scope.usuario.oldPass = "";
                        $scope.usuario.newPass = "";
                        $scope.usuario.newPassConfirm = "";

                        var alertPopup = $ionicPopup.alert({
                            title: '',
                            template: data.message
                        });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: data.message
                        });
                    }
                })
                .error(function(err) {
                    $scope.controlDisabled = false;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Ha ocurrido un error.'
                    });
                });
        };

        $scope.terms = function() {
            // Realizar petición de login
            $http.get($rootScope._host + 'terms/getActive')
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == 1) {
                        $scope.pdf_terms = data.data;
                        //window.open($scope.pdf_terms.url, '_blank');
                        window.open('https://docs.google.com/viewer?url='+$scope.pdf_terms.url+'&embedded=true', '_blank', 'location=yes');
                    }
                });
        }
    })
