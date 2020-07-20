"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CursoController_1 = require("../controllers/Docente_controllers/CursoController");
const VerifyToken_1 = require("../libs/VerifyToken");
class CursoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/class-room', VerifyToken_1.TokenValidation, CursoController_1.cursoController.obtenerCursosDocente);
        this.router.get('/teacher/class-room/semester', VerifyToken_1.TokenValidation, CursoController_1.cursoController.obtenerSemestres);
        this.router.get('/teacher/class-room/level', VerifyToken_1.TokenValidation, CursoController_1.cursoController.obtenerNiveles);
        this.router.get('/teacher/class-room/navigation-tab', VerifyToken_1.TokenValidation, CursoController_1.cursoController.obtenerCursosDocentePestania);
        this.router.post('/teacher/class-room', VerifyToken_1.TokenValidation, CursoController_1.cursoController.agregarCurso);
        this.router.get('/teacher/class-room/schedule', CursoController_1.cursoController.obtenerHorariodeCurso);
        this.router.post('/teacher/class-room/add/schedule', CursoController_1.cursoController.agregarHorarioACurso);
        this.router.delete('/teacher/class-room/delete/day/schedule/:id', CursoController_1.cursoController.eliminarDiaDeHorario);
        this.router.put('/teacher/class-room/modify/day/schedule', CursoController_1.cursoController.modificarDiaDeHorario);
    }
}
const cursoRoutes = new CursoRoutes();
exports.default = cursoRoutes.router;
//# sourceMappingURL=CursoRoutes.js.map