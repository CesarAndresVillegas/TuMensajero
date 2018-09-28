angular.module('starter')
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            });

        $stateProvider
            .state('menu', {
                url: '/menu',
                templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
            });

        $stateProvider
            .state('iniciarPedido', {
                url: '/iniciarPedido',
                templateUrl: 'templates/iniciarPedido.html',
                controller: 'iniciarPedidoCtrl'
            });

        $stateProvider
            .state('perfilUsuario', {
                url: '/perfilUsuario',
                templateUrl: 'templates/perfilUsuario.html',
                controller: 'perfilUsuarioCtrl'
            });

        $stateProvider
            .state('historialPedidos', {
                url: '/historialPedidos',
                templateUrl: 'templates/historialPedidos.html',
                controller: 'historialPedidosCtrl'
            });

        $stateProvider
            .state('agregarTrayecto', {
                url: '/agregarTrayecto',
                templateUrl: 'templates/agregarTrayecto.html',
                controller: 'agregarTrayectoCtrl'
            });

        $stateProvider
            .state('registrarUsuario', {
                url: '/registrarUsuario',
                templateUrl: 'templates/registrarUsuario.html',
                controller: 'registrarUsuarioCtrl'
            });

        $stateProvider
            .state('recuperarPass', {
                url: '/recuperarPass',
                templateUrl: 'templates/recuperarPass.html',
                controller: 'recuperarPassCtrl'
            });

        $stateProvider
            .state('detallesPedido', {
                url: '/detallesPedido',
                templateUrl: 'templates/detallesPedido.html',
                controller: 'detallesPedidoCtrl'
            });

        $stateProvider
            .state('finalizarPedido', {
                url: '/finalizarPedido',
                templateUrl: 'templates/finalizarPedido.html',
                controller: 'finalizarPedidoCtrl'
            });

        $stateProvider
            .state('mapa', {
                url: '/mapa',
                templateUrl: 'templates/mapa.html',
                controller: 'mapaCtrl'
            });

        $stateProvider
            .state('verEnMapa', {
                url: '/verEnMapa',
                templateUrl: 'templates/verEnMapa.html',
                controller: 'verEnMapaCtrl'
            });

        $stateProvider
            .state('tutorial', {
                url: '/tutorial',
                templateUrl: 'templates/tutorial.html',
                controller: 'tutorialCtrl'
            });

        $urlRouterProvider.otherwise('/login');
    })
