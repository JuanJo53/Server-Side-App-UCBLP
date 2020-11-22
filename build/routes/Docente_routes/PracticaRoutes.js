"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../../libs/VerifyToken");
const PracticaController_1 = require("../../controllers/Docente_controllers/PracticaController");
class PracticaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    ;
    //configurar respuesta routas
    config() {
        this.router.get('/teacher/practice/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.listarPracticas);
        this.router.post('/teacher/practice', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.agregarPractica);
        this.router.put('/teacher/practice', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.modificarPractica);
        this.router.delete('/teacher/practice/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.eliminarPractica);
        this.router.get('/teacher/practice/questions/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.listarPreguntasPractica);
        this.router.get('/teacher/practice/mod/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.obtenerPractica);
        this.router.post('/teacher/practice/questions', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.agregarPreguntasPractica);
        // this.router.post('/teacher/practice/questionsSQL',practicaController.agregarPreguntasPracticaSQL);
        this.router.put('/teacher/practice/questions', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.modificarPreguntaPractica);
        this.router.delete('/teacher/practice/questions/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.eliminarPreguntaPractica);
        this.router.get('/teacher/practice/scores/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.listarNotasPractica);
        this.router.get('/teacher/practice/scores/individual/:id', VerifyToken_1.TokenValidation, PracticaController_1.practicaController.respuestasEstudiante);
        this.router.get('/teacher/practice/dataset/:id', PracticaController_1.practicaController.dataSetPractica);
    }
}
const practicaRoutes = new PracticaRoutes();
exports.default = practicaRoutes.router;
//# sourceMappingURL=PracticaRoutes.js.map