angular.module('starter')
.factory('SharedService', function() {
	var SharedService = {
		datosUsuario: {},
		trayectos: [],
		observationsOrden: "",
		objHistorialSeleccionado:{},
		trayectoActual: {},
		tipoSeleccionado: {}
	};
	return SharedService;
});