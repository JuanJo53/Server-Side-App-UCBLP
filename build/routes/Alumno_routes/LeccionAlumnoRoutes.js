"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LeccionAlumnoController_1 = require("../../controllers/Alumno_Controllers/LeccionAlumnoController");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
class TemaAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/students/lessons/:id', VerifyTokenAlumno_1.TokenValidationAlumno, LeccionAlumnoController_1.leccionAlumnoController.listarLecciones);
    }
}
const temaAlumnoRoutes = new TemaAlumnoRoutes();
exports.default = temaAlumnoRoutes.router;
//# sourceMappingURL=LeccionAlumnoRoutes.js.map