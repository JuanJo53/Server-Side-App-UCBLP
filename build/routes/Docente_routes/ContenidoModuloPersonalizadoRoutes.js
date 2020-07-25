"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../../libs/VerifyToken");
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
        this.router.get('/teacher/cutson/module/content/score/get/:id', ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.listarNotasContenido);
        this.router.put('/teacher/cutson/module/content/score/', VerifyToken_1.TokenValidation, ContenidoModuloPersonalizadoController_1.contenidoModuloPersonalizadoController.modificarNotaContenido);
    }
}
const contenidoModuloPersonalizadoRoutes = new ContenidoModuloPersonalizadoRoutes();
exports.default = contenidoModuloPersonalizadoRoutes.router;
//# sourceMappingURL=ContenidoModuloPersonalizadoRoutes.js.map