"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CursoController_1 = require("../../controllers/Alumno_Controllers/CursoController");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
class CursoAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/students/courses', VerifyTokenAlumno_1.TokenValidationAlumno, CursoController_1.cursoAlumnoController.listarCursos);
    }
}
const cursoAlumnoRoutes = new CursoAlumnoRoutes();
exports.default = cursoAlumnoRoutes.router;
//# sourceMappingURL=CursoAlumnoRoutes.js.map