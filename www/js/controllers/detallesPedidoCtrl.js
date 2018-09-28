angular.module('starter')
    .controller('detallesPedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, $ionicActionSheet, $timeout, SharedService) {
        $scope.trayectos = [];
        $scope.observations = "";

        $scope.controlDisabled = false;

        $scope.detalles_pedido = [];

        $scope.objHistorialSeleccionado = {};

        $scope.total = 0;

        $scope.init = function() {
            $scope.controlDisabled = false;
            $scope.objHistorialSeleccionado = SharedService.objHistorialSeleccionado;
            $scope.inicializarDatos();
        };

        $scope.irAtras = function() {
            $scope.controlDisabled = true;
            $state.go("historialPedidos");
        };

        $scope.mostrarMenu = function() {
            // Inicia el action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: 'Cancelar todo el pedido'
                }, {
                    text: 'Reanudar el pedido'
                }, {
                    text: 'Llamar Mensajero',
                    click: 'llamarMensajero()'
                }, {
                    text: 'Ver en Mapa'
                }, {
                    text: 'Finalizar Pedido'
                }],
                titleText: '- Seleccione una Opción -',
                cancelText: 'Cancelar',
                cancel: function(param) {
                    return;
                },
                buttonClicked: function(index) {
                    if (index === 0) {
                        $scope.cancelarPedido();
                        return;
                    } else if (index === 1) {
                        $scope.reanudarPedido();
                        return;
                    } else if (index === 2) {
                        $scope.llamarMensajero(SharedService.objHistorialSeleccionado.delivery_phone);
                        return;
                    } else if (index === 3) {
                        $state.go("verEnMapa");
                        return;
                    } else if (index === 4) {
                        if ($scope.objHistorialSeleccionado.order_status_id == 4) {
                            $state.go("finalizarPedido");
                            return;
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Imposible finalizar',
                                template: "El pedido aun no se ha marcado como terminado por el mensajero"
                            });
                            return;
                        }
                    }
                }
            });
        };

        $scope.llamarMensajero = function(phonenumber) {
            var call = "tel:" + phonenumber;
            window.open(call, '_system');
        };

        $scope.inicializarDatos = function() {
            // Realizar petición de historial
            $http.get($rootScope._host + 'delivery/detalles_pedido/' + SharedService.objHistorialSeleccionado.id)
                .success(function(data) {
                    if (data.state == 1) {
                        $scope.detalles_pedido = data.data;
                        for (var i = 0; i < $scope.detalles_pedido.length; i++) {
                            $scope.total = $scope.total + Number($scope.detalles_pedido[i].cost);
                        }
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Ha ocurrido un error',
                            template: data.message
                        });
                    }
                });
        };

        $scope.cancelarPedido = function() {
            $scope.controlDisabled = true;

            if ($scope.objHistorialSeleccionado.delivery_man_id != '' && $scope.objHistorialSeleccionado.delivery_man_id != null) {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "El pedido ya fue tomado por un repartidor, imposible cancelar"
                });
                $scope.controlDisabled = false;
                return;
            }

            if ($scope.detalles_pedido.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "No hay trayectos en el servicio a cancelar"
                });
                $scope.controlDisabled = false;
                return;
            }

            if ($scope.objHistorialSeleccionado.order_status_id == "6") {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "El pedido ya se encuentra cancelado."
                });
                $scope.controlDisabled = false;
                return;
            }

            for (var i = 0; i < $scope.detalles_pedido.length; i++) {
                if ($scope.detalles_pedido[i].status != 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: "Error",
                        template: "Ya se encuentra un trayecto gestionado o cancelado, imposible cancelar"
                    });
                    $scope.controlDisabled = false;
                    return;
                }
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cancelar servicio',
                template: 'Desea cancelar el servicio?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var data = {
                        id: $scope.objHistorialSeleccionado.id,
                        order_status_id: 6,
                        star_rating: 0,
                        comment_rating: "Cancelado por usuario"
                    };

                    $http.put($rootScope._host + 'orders/updateState', data)
                        .success(function(data) {
                            if (data.state == 1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Exito',
                                    template: "El pedido se ha cancelado correctamente"
                                });
                                $state.go("historialPedidos");
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: '',
                                    template: data.message
                                });
                            }
                        });
                }
                $scope.controlDisabled = false;
            });
        };

        $scope.reanudarPedido = function() {
            $scope.controlDisabled = true;

            if ($scope.detalles_pedido.length == 0) {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "El pedido no tiene trayectos, imposible reanudar"
                });
                $scope.controlDisabled = false;
                return;
            }

            if ($scope.objHistorialSeleccionado.order_status_id != 6) {
                var alertPopup = $ionicPopup.alert({
                    title: "Error",
                    template: "El pedido no se encuentra cancelado, imposible reanudar"
                });
                $scope.controlDisabled = false;
                return;
            }

            var confirmPopup = $ionicPopup.confirm({
                title: 'Reanudar servicio',
                template: 'Desea reanudar el servicio ?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    var data = {
                        id: $scope.objHistorialSeleccionado.id,
                        order_status_id: 1,
                        star_rating: 0,
                        comment_rating: ""
                    };

                    $http.put($rootScope._host + 'orders/updateState', data)
                        .success(function(data) {
                            if (data.state == 1) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Exito',
                                    template: "El servicio se ha reanudado correctamente"
                                });
                                $state.go("historialPedidos");
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: '',
                                    template: data.message
                                });
                            }
                        });
                }
                $scope.controlDisabled = false;
            });
        }
    })