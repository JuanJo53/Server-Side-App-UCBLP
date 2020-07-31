"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PracticaController_1 = require("../../controllers/Alumno_Controllers/PracticaController");
const VerifyTokenAlumno_1 = require("../../libs/VerifyTokenAlumno");
class PracticaAlumnoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    config() {
        this.router.get('/students/practices/:id', VerifyTokenAlumno_1.TokenValidationAlumno, PracticaController_1.practicaController.listarPracticas);
        this.router.get('/students/info/practices/:id', VerifyTokenAlumno_1.TokenValidationAlumno, PracticaController_1.practicaController.infoPractica);
        this.router.get('/students/practice/start/:id', VerifyTokenAlumno_1.TokenValidationAlumno, PracticaController_1.practicaController.obtenerPractica);
        this.router.get('/students/practiceSQL/start/:id', VerifyTokenAlumno_1.TokenValidationAlumno, PracticaController_1.practicaController.obtenerPracticaSQL);
        this.router.post('/students/practice/finish', VerifyTokenAlumno_1.TokenValidationAlumno, PracticaController_1.practicaController.revisarPracticaSQL);
        // this.router.post('/students/practice/finish',TokenValidationAlumno,practicaController.revisarPractica);
    }
}
const practicaAlumnoRoutes = new PracticaAlumnoRoutes();
exports.default = practicaAlumnoRoutes.router;
//# sourceMappingURL=PracticaRoutes.js.map