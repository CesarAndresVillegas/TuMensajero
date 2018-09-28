angular.module('starter')
    .controller('iniciarPedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.trayectos = [];
        $scope.orden = {};

        $scope.controlDisabled = false;

        $scope.irAtras = function() {
            $scope.controlDisabled = true;
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Salir del Pedido',
                template: 'Desea salir de la aplicación? Perdera los trayectos agregados'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    SharedService.trayectos = [];
                    SharedService.observationsOrden = "";
                    $state.go("menu");
                } else {
                    $scope.controlDisabled = false;
                }
            });
        };

        $scope.agregarPeticion = function() {
            $scope.controlDisabled = true;
            $state.go("agregarTrayecto");
            SharedService.observationsOrden = $scope.orden.observations;
        };

        $scope.getTotalOrden = function() {
            var total = 0;
            var trayectos = SharedService.trayectos;

            for (var i = 0; i < trayectos.length; i++) {
                total = total + Number(trayectos[i].cost);
            }

            return total;
        }

        $scope.finalizar = function() {
            $scope.controlDisabled = true;
            if (SharedService.trayectos <= 0) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique al menos un trayecto."
                });
                $scope.controlDisabled = false;
                return;
            }

            var currentDate = new Date();
            var currentHour = currentDate.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth();
            currentMonth++;
            if (Number(currentMonth) < 9) {
                currentMonth = "0" + currentMonth;
            }
            var currentDay = currentDate.getDate();
            if (Number(currentDay) < 9) {
                currentDay = "0" + currentDay;
            }

            currentDate = "" + currentYear + "-" + currentMonth + "-" + currentDay + " " + currentHour;
            var orden = {
                users_id: SharedService.datosUsuario.id,
                orders_details: SharedService.trayectos,
                observations: $scope.orden.observations,
                register_date: currentDate
            }

            // Enviar orden.
            $http({
                    url: $rootScope._host + 'orders/create',
                    method: "POST",
                    data: orden
                })
                .success(function(data, status, headers, config) {
                    // success
                    if (data.state == 1) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Exito',
                            template: data.message
                        });
                        $scope.orden = {};
                        SharedService.trayectos = [];
                        SharedService.observationsOrden = "";
                        $state.go("menu");
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: data.message
                        });
                    }
                    $scope.controlDisabled = false;
                })
                .error(function(data) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: data.message
                    });
                    $scope.controlDisabled = false;
                });

        };

        $scope.init = function() {
            $scope.trayectos = SharedService.trayectos;
            $scope.orden.observations = SharedService.observationsOrden;
        };

        $scope.eliminarTrayecto = function() {
            $scope.controlDisabled = true;
            var trayectos = SharedService.trayectos;
            if (trayectos.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "No hay trayectos para cancelar"
                });
                $scope.controlDisabled = false;
                return;
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Eliminar trayecto',
                    template: 'Desea eliminar el último trayecto agregado?'
                });

                confirmPopup.then(function(res) {
                    if (res) {
                        SharedService.trayectos.pop();
                        $scope.trayectos = SharedService.trayectos;
                        $scope.orden.observations = SharedService.observationsOrden;
                    }
                    $scope.controlDisabled = false;
                });
            }
        };
    })
