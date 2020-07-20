"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContenidoModuloPersonalizadoController_1 = require("../../controllers/Docente_controllers/ContenidoModuloPersonalizadoController");
class ContenidoModuloPersonalizadoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/teacher/cutson/module/content/get', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.listarContenido);
        this.router.post('/teacher/cutson/module/content', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.agregarContenido);
        this.router.post('/teacher/cutson/module/content/rubric', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.actualizarRubricas);
        this.router.put('/teacher/cutson/module/content', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.modificarContenido);
        this.router.delete('/teacher/cutson/module/content/:id', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.eliminarContenido);
        this.router.put('/teacher/cutson/module/content/enable/:id', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.activarContenido);
        this.router.put('/teacher/cutson/module/content/disable/:id', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.desactivarContenido);
    }
}
const contenidoModuloPersonalizadoRoutes = new ContenidoModuloPersonalizadoRoutes();
exports.default = contenidoModuloPersonalizadoRoutes.router;
//# sourceMappingURL=ContenidoModuloPersonalizadoRoutes.js.map