"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TemaAlumnoController_1 = require("../../controllers/Alumno_Controllers/TemaAlumnoController");
const VerifyToken_1 = require("../../libs/VerifyToken");
class TemaAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/student/themes/:id', VerifyToken_1.TokenValidation, TemaAlumnoController_1.temaAlumnoController.listarTemas);
    }
}
const temaAlumnoRoutes = new TemaAlumnoRoutes();
exports.default = temaAlumnoRoutes.router;
//# sourceMappingURL=TemaAlumnoRoutes.js.map