angular.module('starter')
    .controller('agregarTrayectoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService) {
        $scope.tipoOrdenes = {};
        $scope.tipoSeleccionado = {};
        $scope.trayectos;
        $scope.habilitarDireccionInicial = true;

        $scope.trayecto = {};

        $scope.controlDisabled = false;

        $scope.init = function() {
            $scope.obtenerTipoPeticiones();
            $scope.controlDisabled = false;

            $scope.trayecto = SharedService.trayectoActual;
        };

        $scope.$on('$ionicView.loaded', function() {
            if (SharedService.trayectos.length > 0) {
                $scope.trayecto.initial_address = SharedService.trayectos[SharedService.trayectos.length - 1].final_address;
                $scope.habilitarDireccionInicial = false;
            } else {
                $scope.habilitarDireccionInicial = true;
            }
        });

        $scope.irAtras = function() {
            $scope.controlDisabled = true;
            $state.go("iniciarPedido");
        };

        $scope.agregarTrayecto = function() {
            //--------------------------------------------------------
            //Validaciones
            //--------------------------------------------------------
            if (!$scope.tipoSeleccionado.data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique el tipo de orden"
                });
                return;
            }

            if (!$scope.trayecto.initial_address) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique la dirección inicial"
                });
                return;
            }

            if (!$scope.trayecto.final_address) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique la dirección final"
                });
                return;
            }

            if (!$scope.trayecto.observations) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique las anotaciones"
                });
                return;
            }
            $scope.controlDisabled = true;

            //--------------------------------------------------------
            //Validaciones Fin
            //--------------------------------------------------------

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

            var trayecto = {
                orders_type_id: $scope.tipoSeleccionado.data.id,
                observations: $scope.trayecto.observations,
                initial_address: $scope.trayecto.initial_address,
                initial_lat: $scope.trayecto.initial_lat,
                initial_lng: $scope.trayecto.initial_lng,
                final_address: $scope.trayecto.final_address,
                final_lat: $scope.trayecto.final_lat,
                final_lng: $scope.trayecto.final_lng,
                cost: $scope.tipoSeleccionado.data.cost,
                name_petition: $scope.tipoSeleccionado.data.name,
                register_date: currentDate
            };

            SharedService.trayectos.push(trayecto);
            SharedService.trayectoActual = {};
            SharedService.tipoSeleccionado = {};
            $scope.trayecto = {};
            $scope.tipoSeleccionado = {};

            $state.go("iniciarPedido");
        };

        $scope.agregarIdaYVuelta = function() {
            //--------------------------------------------------------
            //Validaciones
            //--------------------------------------------------------
            if (!$scope.tipoSeleccionado.data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique el tipo de orden"
                });
                return;
            }

            if (!$scope.trayecto.initial_address) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique la dirección inicial"
                });
                return;
            }

            if (!$scope.trayecto.final_address) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique la dirección final"
                });
                return;
            }

            if (!$scope.trayecto.observations) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Por favor indique las anotaciones"
                });
                return;
            }
            $scope.controlDisabled = true;

            //--------------------------------------------------------
            //Validaciones Fin
            //--------------------------------------------------------

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

            var trayecto = {
                orders_type_id: $scope.tipoSeleccionado.data.id,
                observations: $scope.trayecto.observations,
                initial_address: $scope.trayecto.initial_address,
                initial_lat: $scope.trayecto.initial_lat,
                initial_lng: $scope.trayecto.initial_lng,
                final_address: $scope.trayecto.final_address,
                final_lat: $scope.trayecto.final_lat,
                final_lng: $scope.trayecto.final_lng,
                cost: $scope.tipoSeleccionado.data.cost,
                name_petition: $scope.tipoSeleccionado.data.name,
                register_date: currentDate
            };

            SharedService.trayectos.push(trayecto);

            var trayecto = {
                orders_type_id: $scope.tipoSeleccionado.data.id,
                observations: $scope.trayecto.observations,
                initial_address: $scope.trayecto.final_address,
                initial_lat: $scope.trayecto.final_lat,
                initial_lng: $scope.trayecto.final_lng,
                final_address: $scope.trayecto.initial_address,
                final_lat: $scope.trayecto.initial_lat,
                final_lng: $scope.trayecto.initial_lng,
                cost: $scope.tipoSeleccionado.data.return_cost,
                name_petition: $scope.tipoSeleccionado.data.name,
                register_date: currentDate
            };

            SharedService.trayectos.push(trayecto);

            SharedService.trayectoActual = {};
            SharedService.tipoSeleccionado = {};
            $scope.trayecto = {};
            $scope.tipoSeleccionado = {};

            $state.go("iniciarPedido");
        };

        $scope.obtenerTipoPeticiones = function() {
            $rootScope.show();
            $http.get($rootScope._host + "orders/orders_type")
                .success(function(data) {
                    $rootScope.hide();
                    if (data.state == 1) {
                        $scope.tipoOrdenes = data.data;
                        $scope.tipoSeleccionado = SharedService.tipoSeleccionado;
                    }
                });
        };

        $scope.verMapa = function(tipo) {
            $scope.controlDisabled = true;
            SharedService.trayectoActual = $scope.trayecto;
            SharedService.tipoSeleccionado = $scope.tipoSeleccionado;
            // Se define si el mapa es para la dirección inicial o final.
            if (tipo == 'inicial') {
                SharedService.isInitialAddress = true;
            } else {
                SharedService.isInitialAddress = false;
            }

            $state.go("mapa");
        };
    })
