"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LeccionAlumnoController_1 = require("../../controllers/Alumno_Controllers/LeccionAlumnoController");
const VerifyToken_1 = require("../../libs/VerifyToken");
class TemaAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/student/themes/lessons/:id', VerifyToken_1.TokenValidation, LeccionAlumnoController_1.leccionAlumnoController.listarLecciones);
    }
}
const temaAlumnoRoutes = new TemaAlumnoRoutes();
exports.default = temaAlumnoRoutes.router;
//# sourceMappingURL=CursoAlumnoController.js.map