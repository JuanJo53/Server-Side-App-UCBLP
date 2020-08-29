"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
const RecursoAlumnoController_1 = require("../../controllers/Alumno_Controllers/RecursoAlumnoController");
class RecursoAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/students/courses/resources/:id', VerifyTokenAlumno_1.TokenValidationAlumno, RecursoAlumnoController_1.recursoAlumnoController.obtenerRecursosAlumno);
        this.router.post('/students/resource/file', VerifyTokenAlumno_1.TokenValidationAlumno, RecursoAlumnoController_1.recursoAlumnoController.urlFile);
    }
}
const recursoAlumnoRoutes = new RecursoAlumnoRoutes();
exports.default = recursoAlumnoRoutes.router;
//# sourceMappingURL=RecursoAlumnoRoutes.js.map