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
        this.router.get('/student/qualification/:id', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.listarNotasAlumno);
        this.router.post('/student/profile', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.obtenerPerfilAlumno);
        this.router.get('/student/qualifications/modules', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.obtenerCalificacionesAlumnoModulo);
        this.router.get('/student/qualification/avg/practices', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.obtenerPromedioAlumnoPracticas);
        this.router.put('/student/qualification/practices/uptade', VerifyToken_1.TokenValidation, AlumnoController_1.alumnoController.actualizarNotaModuloPracticas);
    }
}
const alumnoRoutes = new AlumnoRoutes();
exports.default = alumnoRoutes.router;
//# sourceMappingURL=AlumnoRoutes.js.map