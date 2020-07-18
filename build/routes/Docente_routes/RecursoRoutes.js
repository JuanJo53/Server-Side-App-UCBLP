"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../libs/VerifyToken");
const RecursoController_1 = require("../controllers/RecursoController");
class RecursoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.post('/teacher/seccion', VerifyToken_1.TokenValidation, RecursoController_1.recursoController.agregarSeccion);
        this.router.post('/teacher/seccion/resource', VerifyToken_1.TokenValidation, RecursoController_1.recursoController.agregarRecurso);
        this.router.get('/teacher/seccion/:id', RecursoController_1.recursoController.listarSecciones);
        this.router.get('/teacher/storagedoc', RecursoController_1.recursoController.subirDoc);
        this.router.get('/teacher/storagevideo', RecursoController_1.recursoController.subirVideo);
        this.router.get('/teacher/storageaudio', RecursoController_1.recursoController.subirAudio);
        this.router.post('/teacher/resource/file', RecursoController_1.recursoController.urlFile);
        this.router.get('/teacher/seccion/resource/:id', RecursoController_1.recursoController.listarRecursos);
        this.router.delete('/teacher/seccion/resource/:id', RecursoController_1.recursoController.eliminarRecurso);
        this.router.delete('/teacher/seccion/:id', RecursoController_1.recursoController.eliminarSeccion);
        this.router.put('/teacher/seccion/', RecursoController_1.recursoController.modificarSeccion);
        this.router.put('/teacher/seccion/resource', RecursoController_1.recursoController.modificarRecurso);
    }
}
const recursoRoutes = new RecursoRoutes();
exports.default = recursoRoutes.router;
//# sourceMappingURL=RecursoRoutes.js.map