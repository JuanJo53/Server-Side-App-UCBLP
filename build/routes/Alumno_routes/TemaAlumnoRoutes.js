"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TemaAlumnoController_1 = require("../../controllers/Alumno_Controllers/TemaAlumnoController");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
class TemaAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/students/themes/:id', VerifyTokenAlumno_1.TokenValidationAlumno, TemaAlumnoController_1.temaAlumnoController.listarTemas);
    }
}
const temaAlumnoRoutes = new TemaAlumnoRoutes();
exports.default = temaAlumnoRoutes.router;
//# sourceMappingURL=TemaAlumnoRoutes.js.map