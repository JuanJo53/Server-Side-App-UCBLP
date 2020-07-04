"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AlumnoController_1 = require("../controllers/AlumnoController");
const VerifyToken_1 = require("../libs/VerifyToken");
class AlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/student/profile', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.obtenerPerfilAlumno);
        this.router.get('/student/qualifications', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.obtenerCalificacionesAlumnoModulo);
    }
}
const alumnoRoutes = new AlumnoRoutes();
exports.default = alumnoRoutes.router;
//# sourceMappingURL=ALumnoRoutes.js.map