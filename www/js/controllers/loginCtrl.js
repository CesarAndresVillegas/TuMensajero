angular.module('starter')
    .controller('loginCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
        // Objeto de usuario.
        $scope.usuario = {};
        $scope.controlDisabled = false;
        $scope.pdf_terms = {};
        $scope.user_terms = {};

        $scope.init = function() {
            $scope.controlDisabled = false;
            $scope.traerTerminos();
            if ($window.localStorage.getItem('user') && $window.localStorage.getItem('pwd')) {
                $scope.usuario.user = $window.localStorage.getItem('user');
                $scope.usuario.pwd = $window.localStorage.getItem('pwd');
                $scope.login();
            }
        };

        $scope.traerTerminos = function() {
            $scope.controlDisabled = true;

            // Realizar petición de login
            $http.get($rootScope._host + 'terms/getActive')
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == 1) {
                        $scope.pdf_terms = data.data;
                    }
                });
        };

        $scope.verificarTerminosUsuarios = function(userId, fb) {
            $scope.controlDisabled = true;

            // Realizar petición de login
            $http.get($rootScope._host + '/terms/get/' + userId)
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == 1) {
                        $scope.user_terms = data.data;

                        if ($scope.user_terms.pdf_terms_id == $scope.pdf_terms.id) {
                            if (Number(SharedService.datosUsuario.tutorial)) {
                                $state.go("menu");
                            } else {
                                $state.go("tutorial");
                            }
                            if (!fb) {
                                $window.localStorage.setItem('user', $scope.usuario.user);
                                $window.localStorage.setItem('pwd', $scope.usuario.pwd);
                            }
                        } else {
                            var theOpen = "window.open('" + $scope.pdf_terms.url + "' , '_blank')";
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Términos y condiciones',
                                template: 'Nuestros <a href="#" onclick="' + theOpen + '">Términos y Condiciones</a> han cambiado',
                                cancelText: 'Cancelar',
                                okText: 'Aceptar'
                            });

                            confirmPopup.then(function(res) {
                                if (res) {

                                    var dataTerm = {
                                        users_id: userId,
                                        pdf_terms_id: $scope.pdf_terms.id
                                    };
                                    $http.put($rootScope._host + 'terms/updateTermUser', dataTerm)
                                        .success(function(data) {
                                            $scope.controlDisabled = false;
                                            if (data.state == 1) {
                                                if (Number(SharedService.datosUsuario.tutorial)) {
                                                    $state.go("menu");
                                                } else {
                                                    $state.go("tutorial");
                                                }
                                                if (!fb) {
                                                    $window.localStorage.setItem('user', $scope.usuario.user);
                                                    $window.localStorage.setItem('pwd', $scope.usuario.pwd);
                                                }
                                            } else {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Error',
                                                    template: 'Ocurrio error actualizando los términos y condiciones, por favor intentelo más tarde'
                                                });
                                                $window.localStorage.removeItem('user');
                                                $window.localStorage.removeItem('pwd');
                                                $state.go("login");
                                            }
                                        });
                                } else {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: 'No ha actualizado los términos y condiciones, imposible continuar'
                                    });
                                    $window.localStorage.removeItem('user');
                                    $window.localStorage.removeItem('pwd');
                                    $state.go("login");
                                }
                            })
                        }
                    } else {
                        var theOpen = "window.open('" + $scope.pdf_terms.url + "' , '_blank')";
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Términos y condiciones',
                            template: 'Nuestros <a href="#" onclick="' + theOpen + '">Términos y Condiciones</a> han cambiado',
                            cancelText: 'Cancelar',
                            okText: 'Aceptar'
                        });

                        confirmPopup.then(function(res) {
                            if (res) {

                                var dataTerm = {
                                    users_id: userId,
                                    pdf_terms_id: $scope.pdf_terms.id
                                };
                                $http.put($rootScope._host + 'terms/updateTermUser', dataTerm)
                                    .success(function(data) {
                                        $scope.controlDisabled = false;
                                        if (data.state == 1) {
                                            if (Number(SharedService.datosUsuario.tutorial)) {
                                                $state.go("menu");
                                            } else {
                                                $state.go("tutorial");
                                            }
                                            if (!fb) {
                                                $window.localStorage.setItem('user', $scope.usuario.user);
                                                $window.localStorage.setItem('pwd', $scope.usuario.pwd);
                                            }
                                        } else {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: 'Ocurrio error actualizando los términos y condiciones, por favor intentelo más tarde'
                                            });
                                            $window.localStorage.removeItem('user');
                                            $window.localStorage.removeItem('pwd');
                                            $state.go("login");
                                        }
                                    });
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'No ha actualizado los términos y condiciones, imposible continuar'
                                });
                                $window.localStorage.removeItem('user');
                                $window.localStorage.removeItem('pwd');
                                $state.go("login");
                            }
                        })
                    }
                });
        };

        $scope.login = function() {
            $scope.controlDisabled = true;

            // Realizar petición de login
            $http.get($rootScope._host + 'users/login/' + $scope.usuario.user + '/' + $scope.usuario.pwd)
                .success(function(data) {
                    $scope.controlDisabled = false;
                    if (data.state == 1 && data.data.rol_id == 3) {
                        SharedService.datosUsuario = data.data;
                        $scope.verificarTerminosUsuarios(data.data.id, false);
                        window.plugins.OneSignal.sendTag("_id", data.data.id);
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Ha ocurrido un error al iniciar sesión',
                            template: 'Por favor verifique Usuario / Contraseña'
                        });
                    }
                });
        };

        $scope.loginFB = function() {
            openFB.login(function(response) {
                if (response.status == 'connected') {
                    var access_token = response.authResponse.accessToken;
                    openFB.api({
                        path: '/me',
                        params: { "access_token": access_token, "fields": "name,email,first_name,last_name" },
                        success: function(data) {
                            // Peticion al servidor
                            $http.post($rootScope._host + 'users/loginFB', data)
                                .success(function(data) {
                                    if (data.state == "1") {
                                        // Login success FB.
                                        SharedService.datosUsuario = data.data;
                                        $scope.verificarTerminosUsuarios(data.data.id, true);
                                        window.plugins.OneSignal.sendTag("_id", data.data.id);
                                    } else {
                                        // Error Login FB
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Ha ocurrido un error al iniciar sesión',
                                            template: data.message
                                        });
                                    }
                                });
                        },
                        error: function(data) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Ha ocurrido un error al iniciar sesión',
                                template: data.message
                            });
                        }
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Facebook Error.',
                        template: response.error
                    });
                }
            }, { scope: 'email,public_profile' });
        };

        $scope.registro = function() {
            $scope.controlDisabled = true;
            $state.go("registrarUsuario")
        };

        $scope.recuperarPass = function() {
            $scope.controlDisabled = true;
            $state.go("recuperarPass")
        };
    })
