"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
const ModuloAlumnoController_1 = require("../../controllers/Alumno_Controllers/ModuloAlumnoController");
class ModuloAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/students/courses/modules/:id', VerifyTokenAlumno_1.TokenValidationAlumno, ModuloAlumnoController_1.moduloAlumnoController.listarNombreModulos);
        this.router.get('/students/courses/modules/notes/:id', VerifyTokenAlumno_1.TokenValidationAlumno, ModuloAlumnoController_1.moduloAlumnoController.listarNotasModulos);
    }
}
const moduloAlumnoRoutes = new ModuloAlumnoRoutes();
exports.default = moduloAlumnoRoutes.router;
//# sourceMappingURL=ModuloAlumnoRoutes.js.map